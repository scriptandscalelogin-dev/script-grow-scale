import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createClientSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  company: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  tier: z.enum(["starter", "growth", "scale"]).optional().nullable(),
  monthly_fee: z.number().nonnegative().optional().nullable(),
  start_date: z.string().optional().nullable(),
  password: z.string().min(8).optional().nullable(),
});

export const createClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createClientSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Verify caller is admin
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr) throw new Error(`Role check failed: ${roleErr.message}`);
    if (!isAdmin) throw new Error("Forbidden: admin only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Create auth user (email-confirmed). Generate a random password if none given.
    const password =
      data.password && data.password.length >= 8
        ? data.password
        : `${crypto.randomUUID()}A1!`;

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (createErr || !created.user) {
      throw new Error(`Create user failed: ${createErr?.message ?? "unknown"}`);
    }

    const userId = created.user.id;

    // Upsert profile row (no auto-trigger exists).
    const { error: profileErr } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        email: data.email,
        full_name: data.full_name,
        company: data.company ?? null,
        phone: data.phone ?? null,
        tier: data.tier ?? null,
        monthly_fee: data.monthly_fee ?? null,
        start_date: data.start_date ?? null,
        status: "active",
      },
      { onConflict: "id" },
    );
    if (profileErr) {
      throw new Error(`Profile insert failed: ${profileErr.message}`);
    }

    // Assign 'client' role.
    const { error: roleInsErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "client" });
    if (roleInsErr && !roleInsErr.message.includes("duplicate")) {
      throw new Error(`Role assign failed: ${roleInsErr.message}`);
    }

    return { id: userId, email: data.email, full_name: data.full_name };
  });

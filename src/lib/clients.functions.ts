import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createClientSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  company: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  tier: z.enum(["opener", "closer", "rainmaker"]).optional().nullable(),
  monthly_fee: z.number().nonnegative().optional().nullable(),
  start_date: z.string().optional().nullable(),
  password: z.string().min(8).optional().nullable(),
  invite_mode: z.enum(["password", "invite"]).default("password"),
  redirect_to: z.string().url().optional().nullable(),
});

export const createClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createClientSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: roleRow, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr) throw new Error(`Role check failed: ${roleErr.message}`);
    if (!roleRow) throw new Error("Forbidden: admin only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId: string;
    let tempPassword: string | null = null;
    let inviteAcceptUrl: string | null = null;

    if (data.invite_mode === "invite") {
      const { data: invited, error: invErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        data.email,
        {
          data: { full_name: data.full_name },
          redirectTo: data.redirect_to ?? undefined,
        },
      );
      if (invErr || !invited.user) {
        throw new Error(`Invite failed: ${invErr?.message ?? "unknown"}`);
      }
      userId = invited.user.id;
    } else {
      const password =
        data.password && data.password.length >= 8
          ? data.password
          : `${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}A1!`;
      tempPassword = password;

      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: data.full_name },
      });
      if (createErr || !created.user) {
        throw new Error(`Create user failed: ${createErr?.message ?? "unknown"}`);
      }
      userId = created.user.id;
    }

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
    if (profileErr) throw new Error(`Profile insert failed: ${profileErr.message}`);

    const { error: roleInsErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "client" });
    if (roleInsErr && !roleInsErr.message.includes("duplicate")) {
      throw new Error(`Role assign failed: ${roleInsErr.message}`);
    }

    return {
      id: userId,
      email: data.email,
      full_name: data.full_name,
      invite_mode: data.invite_mode,
      temp_password: tempPassword,
      invite_accept_url: inviteAcceptUrl,
    };
  });

const sendResetSchema = z.object({
  email: z.string().email(),
  redirect_to: z.string().url(),
});

export const sendPasswordResetForClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => sendResetSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Use the standard resetPasswordForEmail via admin client (respects Supabase Auth email templates).
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, {
      redirectTo: data.redirect_to,
    });
    if (error) throw new Error(`Send reset failed: ${error.message}`);
    return { ok: true };
  });

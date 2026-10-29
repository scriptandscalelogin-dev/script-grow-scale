import { createFileRoute, redirect } from "@tanstack/react-router";

// Card checkout has been removed. Every fee is invoiced and paid by bank transfer.
// Old /pay/... links land on the payments explainer instead of a dead end.
export const Route = createFileRoute("/pay/$tier")({
  beforeLoad: () => {
    throw redirect({ to: "/payments", statusCode: 301 });
  },
});

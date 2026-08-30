import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("*")({
  head: () => ({
    meta: [
      { title: "Page not found · Script & Scale" },
      { name: "description", content: "This page isn't here. Let's find what you need." },
    ],
  }),
  component: NotFound,
});

function NotFound() {
  return (
    <PageShell>
      <section className="min-h-screen flex items-center">
        <div className="container-tight py-20 text-center">
          <div className="mb-6">
            <p className="text-8xl font-serif font-bold text-muted-foreground">404</p>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl mt-4">
            We're used to getting interesting results, this one was a bit unplanned.
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
            The page you're looking for doesn't exist. That's okay. Let's get you back to finding where your pipeline is actually leaking.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-primary">
              Let's fix this leak
            </Link>
            <Link to="/contact" className="btn-outline">
              Book a diagnostic
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

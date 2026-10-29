import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site-shell";

export function NotFoundPage() {
  return (
    <PageShell>
      <section className="min-h-[70vh] flex items-center">
        <div className="container-tight py-20 text-center">
          <p className="text-8xl font-serif font-bold text-muted-foreground">404</p>

          <h1 className="mt-4 font-serif text-5xl md:text-6xl">
            Yeah, that's not part of the script.
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground">
            The page you were after isn't here. The follow-up, the objections and the close are, so let's get back to those.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-primary">
              Back to the script
            </Link>
            <Link to="/contact" className="btn-outline">
              Book a diagnostic
            </Link>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            Or try:{" "}
            <Link to="/how-it-works" className="underline">How it works</Link>
            {", "}
            <Link to="/pricing" className="underline">Pricing</Link>
            {", "}
            <Link to="/guarantee" className="underline">The guarantee</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

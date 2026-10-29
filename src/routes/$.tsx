import { createFileRoute, notFound } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/not-found";

// Catch-all. Throwing notFound() makes the server answer with a real 404 status
// instead of rendering a "not found" screen with a 200.
export const Route = createFileRoute("*")({
  head: () => ({
    meta: [
      { title: "Page not found · Script & Scale" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: () => {
    throw notFound();
  },
  notFoundComponent: NotFoundPage,
});

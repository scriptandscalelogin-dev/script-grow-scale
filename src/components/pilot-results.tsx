import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Reveal } from "@/components/motion";

type Pilot = {
  name: string;
  place: string;
  quote: string;
};

const FEATURED: Pilot[] = [
  {
    name: "Tom B.",
    place: "Glasgow, Management Consultancy",
    quote:
      "The diagnosis session was a wake-up call. We realised our follow-up was the weak link. Fixing that alone lifted our close rate by 22% in two months. It's the kind of clarity we'd been missing.",
  },
  {
    name: "Rebecca M.",
    place: "London, ITSM Provider",
    quote:
      "The scripts they built were spot-on. No fluff, just practical objection handling that matched our offers. We closed £120k in new business last quarter, and my team finally feels confident on every call.",
  },
  {
    name: "Charlotte E.",
    place: "Newcastle (Tyneside), HR Consultancy",
    quote:
      "We needed consistency across sales calls. Script & Scale gave us a playbook every recruiter follows. Our win rates are up 20%, and I don't have to worry about rogue messaging anymore.",
  },
];

const MORE: Pilot[] = [
  {
    name: "Imran K.",
    place: "Manchester, BPO Services",
    quote:
      "We'd been losing deals at the objection stage for months. Script & Scale built scripts tailored to our actual offers, not generic advice. Within a quarter, we closed £110k in new business. My team finally feels confident instead of scrambling.",
  },
  {
    name: "Emily R.",
    place: "Liverpool, BPO Services",
    quote: "We closed two enterprise deals worth £95k after implementing their follow-up sequences.",
  },
  {
    name: "David C.",
    place: "Bristol, MSP",
    quote: "Short and sweet: pipeline yield up 18%, fewer deals slipping away.",
  },
  {
    name: "Euan M.",
    place: "Edinburgh, Legal Consultancy",
    quote:
      "The cadence drills are tough but effective. Our solicitors now handle fee objections with confidence instead of hesitation. Prospects stay engaged longer, and it's become part of our rhythm, not just a one-off training.",
  },
  {
    name: "Sarah K.",
    place: "Leeds, Accounting Consultancy",
    quote:
      "I've sat through plenty of sales training before, but this was different. They mapped our leaks live, built scripts around our actual objections, and then kept us sharp with cadence workshops. Prospects notice the difference, especially when fees come up.",
  },
  {
    name: "Michael H.",
    place: "Sheffield, Manufacturing Consultancy",
    quote:
      "They didn't just tell us what was wrong. They showed us. Seeing the leaks mapped out in real time was invaluable. For our manufacturing clients, that clarity means fewer stalled projects and more signed contracts.",
  },
  {
    name: "Oliver G.",
    place: "Nottingham, IT Consultancy",
    quote:
      "The tonality coaching was a game-changer. Our consultants sound more confident, and prospects respond differently. It's subtle, but it adds up.",
  },
];

function Attribution({ p }: { p: Pilot }) {
  return (
    <figcaption className="mt-5 border-t border-rule pt-4">
      <div className="text-sm font-medium text-foreground">{p.name}</div>
      <div className="mono text-xs text-muted-foreground">{p.place}</div>
    </figcaption>
  );
}

export function PilotResults() {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setIndex(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  const snaps = api ? api.scrollSnapList().length : MORE.length;

  return (
    <section className="rule-b" aria-labelledby="pilot-results-heading">
      <div className="container-tight py-20">
        <Reveal>
          <h2 id="pilot-results-heading" className="font-serif text-4xl md:text-5xl">
            What happened in the pilots
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Results from our founding pilot clients, who worked with Script &amp; Scale unpaid while we tested the
            process. Names are shortened at their request. Results are their own. Individual results vary.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURED.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12} className="h-full">
              <figure className="flex h-full flex-col justify-between rounded-md border border-rule bg-card/60 p-6">
                <blockquote className="font-serif text-xl leading-snug text-foreground">{p.quote}</blockquote>
                <Attribution p={p} />
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">More from the pilots</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Previous pilot result"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-foreground transition-colors hover:border-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-rule"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                disabled={!canNext}
                aria-label="Next pilot result"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-foreground transition-colors hover:border-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-rule"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>

          <Carousel
            setApi={setApi}
            opts={{ align: "start", containScroll: "trimSnaps" }}
            className="mt-4"
            aria-label="More pilot client results"
          >
            <CarouselContent>
              {MORE.map((p) => (
                <CarouselItem key={p.name} className="basis-[88%] sm:basis-1/2 lg:basis-1/3">
                  <figure className="flex h-full flex-col justify-between rounded-md border border-rule bg-card/60 p-6">
                    <blockquote className="text-sm leading-relaxed text-foreground">{p.quote}</blockquote>
                    <Attribution p={p} />
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <p className="mono mt-4 text-xs text-muted-foreground" aria-live="polite">
            {Math.min(index + 1, snaps)} / {snaps}
          </p>
        </div>
      </div>
    </section>
  );
}

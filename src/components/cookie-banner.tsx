import { useState, useEffect } from "react";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const cookieBannerDismissed = localStorage.getItem("cookie-banner-dismissed");
    setDismissed(!!cookieBannerDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("cookie-banner-dismissed", "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-rule bg-background/95 backdrop-blur-sm">
      <div className="container-tight flex items-center justify-between gap-4 py-3 px-4 md:py-4">
        <p className="text-xs text-muted-foreground">
          We use cookies to keep you signed in. That's it. <a href="/privacy" className="underline hover:text-foreground">Privacy policy</a>.
        </p>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 px-3 py-2 text-xs font-medium text-foreground hover:bg-highlight/10 rounded transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { btn } from "@/components/ui";
import { common, type Lang } from "@/lib/i18n";
import { statusPages } from "@/messages/dashboard";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState<Lang>("hi");
  useEffect(() => {
    setLang(document.documentElement.lang === "en" ? "en" : "hi");
  }, []);
  const t = statusPages[lang];
  const c = common[lang];
  return (
    <main id="main" className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10 sm:px-6">
      <section role="alert">
        <h1 className="text-4xl font-bold tracking-tight">{t.errorTitle}</h1>
        <p className="mt-3 text-lg text-ink-2">{t.errorBody}</p>
        {error.digest ? (
          <p className="mt-4 font-mono text-sm text-ink-3">
            {t.reference}: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => reset()} className={btn.primary}>
            {c.retry}
          </button>
          <a href="tel:108" className={btn.danger}>
            {c.call108}
          </a>
        </div>
      </section>
    </main>
  );
}

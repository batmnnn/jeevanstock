"use client";

// Device coordinates are used once, inside the click handler, to compute kilometres.
// They are not kept in state, URLs, storage, or any request.

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Drug } from "@/lib/centres";
import type { Common } from "@/lib/i18n";
import { distancesFrom, formatDistance, orderFamilyList } from "@/lib/family/place";
import { searchCentres } from "@/lib/family/search";
import type { LastIssueLabel } from "@/lib/directory";
import type { FamilyListItem } from "@/lib/family/list";
import { CentreActions } from "@/components/family/centre-actions";
import { StatusChip, btn, cx } from "@/components/ui";
import type { StockStatus } from "@/lib/domain";

export interface CentreListCopy {
  useLocation: string;
  locationWorking: string;
  locationDenied: string;
  locationUnsupported: string;
  locationReady: string;
  distanceUnit: string;
  stockFirst: string;
  stockThenDistance: string;
  nearestFirst: string;
  listNearby: string;
  listAll: string;
  directions: string;
  call: string;
  demoNote: string;
  newTab: string;
  countNow: string;
  countLast: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchNone: string;
  searchLoose: string;
  searchOne: string;
  searchMany: string;
  searchGo: string;
}

type LocState = "idle" | "working" | "denied" | "unsupported" | "ready";

const COUNT: Record<StockStatus, string> = {
  in: "text-in",
  low: "text-low",
  out: "text-out",
  stale: "text-stale",
  sent: "text-sent",
};

function LastCount({ last, label, size }: { last: LastIssueLabel; label: string; size: string }) {
  return (
    <div className="shrink-0 text-right">
      <p className="text-sm text-ink-3">{label}</p>
      <p className={cx("mt-1 font-mono leading-none tabular-nums text-ink", size)}>{last.qty}</p>
      <p className="mt-2 text-sm font-medium text-ink-2">{last.dateLabel}</p>
    </div>
  );
}

export function CentreList({
  items,
  need,
  statusText,
  drugShort,
  copy,
}: {
  items: FamilyListItem[];
  need: Drug | null;
  statusText: Pick<Common, "status">;
  drugShort: Common["drugShort"];
  copy: CentreListCopy;
}) {
  const [distances, setDistances] = useState<Record<string, number> | null>(null);
  const [loc, setLoc] = useState<LocState>("idle");
  const [query, setQuery] = useState("");
  const matchesRef = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => orderFamilyList(items, need, distances), [items, need, distances]);
  const found = useMemo(() => searchCentres(ordered, query), [ordered, query]);
  const searching = query.trim().length > 0;
  const sortNote = need ? (distances ? copy.stockThenDistance : copy.stockFirst) : distances ? copy.nearestFirst : null;
  const live =
    loc === "working"
      ? copy.locationWorking
      : loc === "denied"
        ? copy.locationDenied
        : loc === "unsupported"
          ? copy.locationUnsupported
          : loc === "ready"
            ? copy.locationReady
            : "";

  function revealMatches() {
    if (!query.trim()) {
      document.getElementById("centre-search")?.focus();
      return;
    }
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    matchesRef.current?.scrollIntoView({ block: "start" });
  }

  function locate() {
    if (loc === "working") return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setDistances(null);
      setLoc("unsupported");
      return;
    }
    setLoc("working");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = distancesFrom(items, { lat: pos.coords.latitude, lon: pos.coords.longitude });
        if (!next) {
          setDistances(null);
          setLoc("unsupported");
          return;
        }
        setDistances(next);
        setLoc("ready");
      },
      () => {
        setDistances(null);
        setLoc("denied");
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 8_000 },
    );
  }

  return (
    <section className="relative mt-8" aria-labelledby="centre-list-heading">
      <h2 id="centre-list-heading" className="relative z-10 text-base font-medium">
        {need ? copy.listNearby : copy.listAll}
      </h2>
      {sortNote ? <p className="mt-1 text-sm text-ink-3">{sortNote}</p> : null}
      <label htmlFor="centre-search" className="mt-3 block text-sm font-medium text-ink-2">
        {copy.searchLabel}
      </label>
      <div className="mt-1 flex items-stretch gap-2">
        <input
          id="centre-search"
          type="search"
          value={query}
          maxLength={40}
          autoComplete="off"
          enterKeyHint="search"
          placeholder={copy.searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              revealMatches();
            }
          }}
          className="glass block min-h-12 w-full min-w-0 flex-1 scroll-mt-28 rounded-2xl px-4 text-base text-ink placeholder:text-ink-3"
        />
        <button type="button" className={cx(btn.primary, "shrink-0 px-4")} onClick={revealMatches}>
          {copy.searchGo}
        </button>
      </div>
      {searching ? (
        <div ref={matchesRef} className="scroll-mt-28">
          <p role="status" aria-live="polite" className="mt-2 text-sm text-ink-2">
            {found.items.length === 0
              ? copy.searchNone
              : `${found.items.length === 1 ? copy.searchOne : `${found.items.length} ${copy.searchMany}`}${found.loosened ? ` ${copy.searchLoose}` : ""}`}
          </p>
          {found.items.length > 0 ? (
            <ul className="glass mt-2 overflow-hidden rounded-2xl">
              {found.items.map((item) => {
                const status = item.focus?.status ?? item.asv.status;
                return (
                  <li key={item.centreId} className="border-b border-line last:border-b-0">
                    <Link href={item.href} className="flex min-h-12 items-center justify-between gap-3 px-4 py-2">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{item.name}</span>
                        <span className="block text-sm text-ink-3">{item.district}</span>
                      </span>
                      <StatusChip status={status} t={statusText} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        className={cx(btn.secondary, "mt-3 w-full")}
        onClick={locate}
        disabled={loc === "working"}
      >
        {loc === "working" ? copy.locationWorking : copy.useLocation}
      </button>
      {live ? (
        <p role="status" aria-live="polite" className="mt-2 text-sm font-semibold text-ink-2">
          {live}
        </p>
      ) : null}
      {found.items.length === 0 ? null : (
      <ul className="mt-3 grid list-none gap-3 p-0">
        {found.items.map((item) => {
          const distance = item.distanceKm == null ? null : formatDistance(item.distanceKm, copy.distanceUnit);
          return (
            <li key={item.centreId} className="glass relative rounded-2xl">
              <div className="relative min-w-0 px-4 py-4">
                <h3 className="text-lg font-medium leading-snug">
                  <Link href={item.href} className="after:absolute after:inset-0 after:content-['']">
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-ink-3">
                  {item.district} · {item.state}
                  {distance ? <span className="font-medium text-ink"> · {distance}</span> : null}
                </p>
                {item.focus ? (
                  <>
                    <div className="mt-3 border-t border-line pt-3">
                      <StatusChip status={item.focus.status} t={statusText} />
                      <div className={cx("mt-3 flex items-start gap-4", (need === "ASV" ? item.lastAsv : item.lastArv) ? "justify-between" : "justify-end")}>
                        <div className="min-w-0">
                          {(need === "ASV" ? item.lastAsv : item.lastArv) ? <p className="text-sm text-ink-3">{copy.countNow}</p> : null}
                          <p className={cx("mt-1 font-mono text-4xl leading-none tabular-nums", COUNT[item.focus.status])}>{item.focus.vialsLabel}</p>
                        </div>
                        {need === "ASV" && item.lastAsv ? <LastCount last={item.lastAsv} label={copy.countLast} size="text-4xl" /> : null}
                        {need === "ARV" && item.lastArv ? <LastCount last={item.lastArv} label={copy.countLast} size="text-4xl" /> : null}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-ink-3">{item.focus.updatedLabel}</p>
                    {need === "ASV" && item.issueAsv ? <p className="mt-2 text-sm text-ink-2">{item.issueAsv}</p> : null}
                    {need === "ARV" && item.issueArv ? <p className="mt-2 text-sm text-ink-2">{item.issueArv}</p> : null}
                  </>
                ) : (
                  <ul className="mt-3 list-none p-0">
                    {(["ASV", "ARV"] as const).map((drug) => {
                      const row = drug === "ASV" ? item.asv : item.arv;
                      const issue = drug === "ASV" ? item.issueAsv : item.issueArv;
                      const last = drug === "ASV" ? item.lastAsv : item.lastArv;
                      return (
                        <li key={drug} className="border-t border-line py-2">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-sm font-medium">{drugShort[drug]}</span>
                            <StatusChip status={row.status} t={statusText} />
                          </div>
                          <div className={cx("mt-2 flex items-start gap-4", last ? "justify-between" : "justify-end")}>
                            <div className="min-w-0">
                              {last ? <p className="text-sm text-ink-3">{copy.countNow}</p> : null}
                              <p className={cx("mt-1 font-mono text-2xl leading-none tabular-nums", COUNT[row.status])}>{row.vialsLabel}</p>
                            </div>
                            {last ? <LastCount last={last} label={copy.countLast} size="text-2xl" /> : null}
                          </div>
                          {issue ? <p className="mt-2 text-sm text-ink-2">{issue}</p> : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <CentreActions
                  name={item.name}
                  directionsUrl={item.directionsUrl}
                  labels={{ directions: copy.directions, call: copy.call, demoNote: copy.demoNote, newTab: copy.newTab }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      )}
    </section>
  );
}

"use client";

// Device coordinates are used once, inside the click handler, to compute kilometres.
// They are not kept in state, URLs, storage, or any request.

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Drug } from "@/lib/centres";
import type { Common } from "@/lib/i18n";
import { distancesFrom, formatDistance, orderFamilyList } from "@/lib/family/place";
import type { FamilyListItem } from "@/lib/family/list";
import { CentreActions } from "@/components/family/centre-actions";
import { Card, StatusChip, btn, cx } from "@/components/ui";

export interface CentreListCopy {
  useLocation: string;
  locationPrivacy: string;
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
  demoPhones: string;
  newTab: string;
}

type LocState = "idle" | "working" | "denied" | "unsupported" | "ready";

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
  const ordered = useMemo(() => orderFamilyList(items, need, distances), [items, need, distances]);
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
    <section className="mt-6" aria-labelledby="centre-list-heading">
      <h2 id="centre-list-heading" className="text-lg font-bold">
        {need ? copy.listNearby : copy.listAll}
      </h2>
      {sortNote ? <p className="mt-1 text-sm text-ink-3">{sortNote}</p> : null}
      <button
        type="button"
        className={cx(btn.secondary, "mt-3 w-full")}
        onClick={locate}
        disabled={loc === "working"}
        aria-describedby="location-privacy"
      >
        {loc === "working" ? copy.locationWorking : copy.useLocation}
      </button>
      <p id="location-privacy" className="mt-2 text-sm text-ink-3">
        {copy.locationPrivacy}
      </p>
      <p role="status" aria-live="polite" className="mt-2 min-h-6 text-sm font-semibold text-ink-2">
        {live}
      </p>
      <p className="text-sm text-ink-3">{copy.demoPhones}</p>
      <ul className="mt-3 grid list-none gap-3 p-0">
        {ordered.map((item) => {
          const distance = item.distanceKm == null ? null : formatDistance(item.distanceKm, copy.distanceUnit);
          return (
            <Card as="li" key={item.centreId} className="relative">
              <h3 className="text-lg font-bold leading-snug">
                <Link href={item.href} className="underline decoration-line-2 underline-offset-4 after:absolute after:inset-0 after:content-['']">
                  {item.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-ink-2">
                {item.district} · {item.state}
              </p>
              {distance ? <p className="mt-1 text-sm font-semibold tabular">{distance}</p> : null}
              {item.focus ? (
                <div className="mt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={item.focus.status} t={statusText} />
                    <span className="text-sm font-semibold tabular">{item.focus.vialsLabel}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-3">{item.focus.updatedLabel}</p>
                </div>
              ) : (
                <ul className="mt-3 grid list-none gap-2 p-0">
                  {(["ASV", "ARV"] as const).map((drug) => {
                    const row = drug === "ASV" ? item.asv : item.arv;
                    return (
                      <li key={drug} className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold">{drugShort[drug]}</span>
                        <StatusChip status={row.status} t={statusText} />
                        <span className="text-sm text-ink-2 tabular">{row.vialsLabel}</span>
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
            </Card>
          );
        })}
      </ul>
    </section>
  );
}

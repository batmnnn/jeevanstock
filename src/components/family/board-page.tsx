import { CentreList } from "@/components/family/centre-list";
import { EmergencyCall } from "@/components/family/emergency-call";
import { HomeScene } from "@/components/family/home-scene";
import { NeedPills } from "@/components/family/need-pills";
import { Unavailable } from "@/components/unavailable";
import { ButtonLink, Card, Mono, PageShell } from "@/components/ui";
import { CENTRES } from "@/lib/centres";
import { config } from "@/lib/config";
import { buildPublicBoard } from "@/lib/directory";
import { buildFamilyList } from "@/lib/family/list";
import { parseNeed } from "@/lib/family/need";
import { readBoard } from "@/lib/family/read-board";
import { boardHref, type Board } from "@/lib/family/routes";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import type { Snapshot } from "@/lib/repo";
import { buildCentreViews } from "@/lib/views";
import { family } from "@/messages/family";

export async function FamilyBoard({
  board,
  searchParams,
}: {
  board: Board;
  searchParams: Promise<{ need?: string | string[] }>;
}) {
  const lang = await getLang();
  const need = parseNeed((await searchParams).need);
  const t = family[lang];
  const c = common[lang];
  const snap = (await readBoard()) ?? (board === "live" ? directoryOnly() : null);
  if (!snap) {
    return (
      <>
        <HomeScene />
        <PageShell className="relative z-10">
          <Unavailable lang={lang} retryHref={boardHref(board, need)} />
        </PageShell>
      </>
    );
  }

  const views =
    board === "demo"
      ? buildCentreViews(snap).filter((view) => CENTRES.some((centre) => centre.centreId === view.centre.centreId))
      : buildPublicBoard(snap);
  const items = buildFamilyList(
    views,
    snap.nowSec,
    need,
    {
      vials: c.vials,
      minutesAgo: c.minutesAgo,
      noUpdate: c.noUpdate,
      sentShelf: c.sentShelf,
      vialsUnknown: t.vialsUnknown,
      updated: t.updated,
    },
    lang,
  );
  const title = need ? t.resultsTitle[need] : board === "demo" ? t.demoTitle : t.liveTitle;
  const lead = need ? t.resultsLead : board === "demo" ? t.demoLead : t.liveLead;

  return (
    <>
      <HomeScene />
      <PageShell className="relative z-10">
        <div className="relative">
          <img
            src="/art/vials.png"
            alt=""
            width={723}
            height={510}
            className="pointer-events-none absolute -right-3 -top-2 z-0 w-36 drop-shadow-[0_14px_18px_rgb(20_27_45/0.16)] sm:w-44"
          />
          <h1 className="relative z-10 max-w-[12ch] pr-16 font-display text-[2.65rem] font-normal leading-[1.15] text-balance">{title}</h1>
          <p className="relative z-10 mt-3 max-w-md text-lg text-ink-2">{lead}</p>
        </div>
        <div className="mt-5">
          <NeedPills
            board={board}
            need={need}
            copy={{
              snakebite: t.snakebite,
              snakebiteEn: t.snakebiteEn,
              dogbite: t.dogbite,
              dogbiteEn: t.dogbiteEn,
              selected: t.selected,
            }}
          />
        </div>
        <div className="mt-4">
          <EmergencyCall label={c.call108} />
        </div>
        {board === "demo" ? (
          <DemoCredentials title={t.demoStaffTitle} body={t.demoDoorBody} staffDoor={t.staffDoor} tryTitle={t.tryTitle} trySteps={t.trySteps} />
        ) : null}
        {items.length === 0 ? (
          <Card className="mt-6">
            <h2 className="text-lg font-bold">{t.emptyTitle}</h2>
            <p className="mt-2 text-ink-2">{t.emptyBody}</p>
          </Card>
        ) : (
          <CentreList
            items={items}
            need={need}
            statusText={{ status: c.status }}
            drugShort={c.drugShort}
            copy={{
              useLocation: t.useLocation,
              locationWorking: t.locationWorking,
              locationDenied: t.locationDenied,
              locationUnsupported: t.locationUnsupported,
              locationReady: t.locationReady,
              distanceUnit: t.distanceUnit,
              stockFirst: t.stockFirst,
              stockThenDistance: t.stockThenDistance,
              nearestFirst: t.nearestFirst,
              listNearby: t.listNearby,
              listAll: t.listAll,
              directions: t.directions,
              call: t.call,
              demoNote: t.demoNote,
              newTab: t.newTab,
              countNow: c.countNow,
              countLast: c.countLast,
              searchLabel: t.searchLabel,
              searchPlaceholder: t.searchPlaceholder,
              searchNone: t.searchNone,
              searchLoose: t.searchLoose,
              searchOne: t.searchOne,
              searchMany: t.searchMany,
              searchGo: t.searchGo,
            }}
          />
        )}
      </PageShell>
    </>
  );
}

/** The CGMSCL list needs nothing from the ledger, so it still shows when Arkiv is unreachable. */
function directoryOnly(): Snapshot {
  return { centres: [], stock: [], reports: [], acks: [], currentBlock: 0, nowSec: Math.floor(Date.now() / 1000), admin: "", payer: "" };
}

function DemoCredentials({
  title,
  body,
  staffDoor,
  tryTitle,
  trySteps,
}: {
  title: string;
  body: string;
  staffDoor: string;
  tryTitle: string;
  trySteps: readonly string[];
}) {
  if (!config().showDemoPins) {
    return (
      <div className="mt-4">
        <ButtonLink href="/staff" variant="secondary" className="w-full">
          {staffDoor}
        </ButtonLink>
      </div>
    );
  }
  const pins = config().centrePins;
  return (
    <aside aria-labelledby="demo-try" className="mt-4 rounded-2xl bg-paper/85 px-4 py-3">
      <h2 id="demo-try" className="text-base font-medium">
        {tryTitle}
      </h2>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink-2">
        {trySteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <h3 className="mt-4 text-base font-medium">{title}</h3>
      <p className="mt-1 text-sm text-ink-2">{body}</p>
      <ul className="mt-3 space-y-2">
        {CENTRES.map((centre) => {
          const pin = pins.get(centre.centreId);
          if (!pin) return null;
          return (
            <li key={centre.centreId} className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{centre.name}</span>
              <Mono className="text-lg font-bold">{pin}</Mono>
            </li>
          );
        })}
      </ul>
      <ButtonLink href="/staff" variant="secondary" className="mt-3 w-full">
        {staffDoor}
      </ButtonLink>
    </aside>
  );
}

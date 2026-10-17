/** How many centres a search shows. The full list stays when the box is empty. */
export const SEARCH_LIMIT = 10;

export interface SearchableCentre {
  name: string;
  district: string;
}

export interface CentreSearch<T> {
  items: T[];
  loosened: boolean;
}

/** Letters and digits only, so "PHC, Gurur" matches "gurur". */
export function foldCentreQuery(value: string): string {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, "");
}

function keyOf(item: SearchableCentre): string {
  return foldCentreQuery(`${item.name} ${item.district}`);
}

/**
 * Top matches in the list's existing order.
 * A full name wins. If that hits nothing, shorter and shorter prefixes of what was typed are tried.
 */
export function searchCentres<T extends SearchableCentre>(items: readonly T[], query: string): CentreSearch<T> {
  const q = foldCentreQuery(query).slice(0, 40);
  if (!q) return { items: [...items], loosened: false };
  const rows = items.map((item) => ({ item, key: keyOf(item) }));
  const full = rows.filter((row) => row.key.includes(q)).map((row) => row.item);
  if (full.length > 0) return { items: full.slice(0, SEARCH_LIMIT), loosened: false };
  for (let n = q.length - 1; n >= 1; n--) {
    const prefix = q.slice(0, n);
    const hits = rows.filter((row) => row.key.includes(prefix)).map((row) => row.item);
    if (hits.length > 0) return { items: hits.slice(0, SEARCH_LIMIT), loosened: true };
  }
  return { items: [], loosened: false };
}

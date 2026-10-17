/**
 * Tiramisu's Ident32 check rejects uppercase bytes in a user attribute name
 * (`centreId` fails at the "I"). System names like `$contentType` are exempt.
 * These are the names on the wire. Domain code keeps camelCase.
 */
export const CHAIN = {
  centreId: "centre_id",
  postedAt: "posted_at",
  hourBucket: "hour_bucket",
  reportKey: "report_key",
} as const;

const FROM_WIRE: Record<string, string> = {
  centre_id: "centreId",
  posted_at: "postedAt",
  hour_bucket: "hourBucket",
  report_key: "reportKey",
};

export const readAttrName = (name: string) => FROM_WIRE[name] ?? name;

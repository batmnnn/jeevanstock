// Synthetic demo centres only. Not real facilities.
export const APP = "jeevanstock-demo";
export const CENTRES = [
  { centreId: "DEMO-RAMPUR-1", name: "Demo PHC Rampur-1", district: "Demo District A", state: "MP", lat: 24.1, lon: 80.1 },
  { centreId: "DEMO-SONPUR-CHC", name: "Demo CHC Sonpur", district: "Demo District A", state: "MP", lat: 24.2, lon: 80.2 },
  { centreId: "DEMO-KALAPUR-2", name: "Demo PHC Kalapur-2", district: "Demo District B", state: "MP", lat: 24.3, lon: 80.0 },
] as const;
export type Drug = "ASV" | "ARV";
export type Reason = "out" | "no_doctor" | "closed";

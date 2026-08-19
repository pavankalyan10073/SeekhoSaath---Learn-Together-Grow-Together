const SHEET_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

export type SheetRow = Record<string, string | number | boolean | null | undefined>;

function getEnv() {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID || "";
  const accessToken = import.meta.env.VITE_GOOGLE_SHEET_ACCESS_TOKEN || process.env.GOOGLE_SHEET_ACCESS_TOKEN || "";
  return { spreadsheetId, accessToken };
}

async function sheetFetch(path: string, init?: RequestInit) {
  const { accessToken } = getEnv();
  const res = await fetch(`${SHEET_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets error ${res.status}: ${text}`);
  }
  return res.json();
}

function esc(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return s.replace(/^=+|^\+|^-/g, "\\$&");
}

export async function appendRow(sheetName: string, values: SheetRow[]) {
  const { spreadsheetId } = getEnv();
  if (!spreadsheetId) return;
  const rows = values.map((row) =>
    Object.values(row).map((v) => esc(v))
  );
  await sheetFetch(`/${spreadsheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=USER_ENTERED`, {
    method: "POST",
    body: JSON.stringify({ values: rows }),
  });
}

export async function syncTutorApplication(app: Record<string, unknown>) {
  appendRow("tutor_applications", [app]);
}

export async function syncBooking(booking: Record<string, unknown>) {
  appendRow("bookings", [booking]);
}

export async function syncPayment(payment: Record<string, unknown>) {
  appendRow("payments", [payment]);
}

export async function syncTutor(tutor: Record<string, unknown>) {
  appendRow("approved_tutors", [tutor]);
}

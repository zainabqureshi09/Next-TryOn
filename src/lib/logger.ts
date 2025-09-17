export function logInfo(message: string, meta?: Record<string, unknown>) {
  console.log(`[INFO] ${message}`, meta || "");
}

export function logError(message: string, meta?: Record<string, unknown>) {
  console.error(`[ERROR] ${message}`, meta || "");
}

export function formatError(e: unknown) {
  if (e && typeof e === "object" && "message" in e) return (e as any).message as string;
  try { return JSON.stringify(e); } catch { return String(e); }
}











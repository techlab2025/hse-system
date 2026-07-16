export function formatTime(isoString: string | Date): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

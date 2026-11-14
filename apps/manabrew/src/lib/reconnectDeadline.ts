export function resumeReconnectDeadline(
  deadline: number | null,
  hiddenSince: number,
  now: number,
): number | null {
  return deadline === null ? null : deadline + Math.max(0, now - hiddenSince);
}

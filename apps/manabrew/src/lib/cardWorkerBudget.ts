type CardWorkerDevice = Pick<
  Navigator,
  "hardwareConcurrency" | "userAgent" | "platform" | "maxTouchPoints"
>;

export function cardWorkerCount(device: CardWorkerDevice | undefined): number {
  if (
    device &&
    (/iPad|iPhone|iPod/.test(device.userAgent) ||
      (device.platform === "MacIntel" && device.maxTouchPoints > 1))
  ) {
    // WebKit is much likelier to evict the whole WASM game under memory pressure.
    return 1;
  }
  return Math.max(1, Math.min(3, (device?.hardwareConcurrency || 2) - 1));
}

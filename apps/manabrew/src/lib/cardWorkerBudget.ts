type CardWorkerDevice = Pick<
  Navigator,
  "hardwareConcurrency" | "userAgent" | "platform" | "maxTouchPoints"
>;

export function isAppleMobileDevice(device: CardWorkerDevice | undefined): boolean {
  return Boolean(
    device &&
    (/iPad|iPhone|iPod/.test(device.userAgent) ||
      (device.platform === "MacIntel" && device.maxTouchPoints > 1)),
  );
}

export function cardMemoryBudget(device: CardWorkerDevice | undefined) {
  if (isAppleMobileDevice(device)) {
    // Preserve the Forge WASM and current card faces rather than caching an
    // additional 256 MiB of finished rasters in WebKit's process.
    return { finishedCards: 256, finishedBytes: 64 * 1024 * 1024, rendererResolutionCap: 1.5 };
  }
  return { finishedCards: 1024, finishedBytes: 256 * 1024 * 1024, rendererResolutionCap: 2 };
}

export function cardWorkerCount(device: CardWorkerDevice | undefined): number {
  if (isAppleMobileDevice(device)) {
    // WebKit is much likelier to evict the whole WASM game under memory pressure.
    return 1;
  }
  return Math.max(1, Math.min(3, (device?.hardwareConcurrency || 2) - 1));
}

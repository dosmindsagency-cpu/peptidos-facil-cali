export type PepScrollMetrics = {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
};

export const PEP_NEAR_BOTTOM_PX = 80;

export function isNearPepScrollBottom(
  metrics: PepScrollMetrics,
  threshold = PEP_NEAR_BOTTOM_PX,
): boolean {
  const distanceFromBottom =
    metrics.scrollHeight - metrics.clientHeight - metrics.scrollTop;
  return distanceFromBottom <= threshold;
}

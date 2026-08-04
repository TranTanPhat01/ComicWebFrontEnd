import { LoadingState } from "@/components/feedback/loading-state";

/**
 * Root loading fallback — shown while the root layout suspense boundary resolves.
 */
export default function RootLoading() {
  return <LoadingState message="Đang tải trang..." />;
}

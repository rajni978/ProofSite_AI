import { SkeletonLoader } from "@/components/dashboard/SkeletonLoader";

export default function LoadingDashboard() {
  return (
    <main className="dashboard-page-content">
      <SkeletonLoader />
    </main>
  );
}

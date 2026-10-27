import DashboardApp from "@/dashboard/DashboardApp";

export const metadata = { title: "Admin Dashboard | Lokal Lens" };

export default function AdminDashboardPage() {
  return <DashboardApp role="admin" />;
}

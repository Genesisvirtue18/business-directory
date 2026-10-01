import DashboardApp from "@/dashboard/DashboardApp";

export const metadata = { title: "Admin Dashboard | DirectFlow" };

export default function AdminDashboardPage() {
  return <DashboardApp role="admin" />;
}

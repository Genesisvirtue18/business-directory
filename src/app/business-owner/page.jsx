import DashboardApp from "@/dashboard/DashboardApp";

export const metadata = { title: "Business Owner Dashboard | DirectFlow" };

export default function BusinessOwnerDashboardPage() {
  return <DashboardApp role="owner" />;
}

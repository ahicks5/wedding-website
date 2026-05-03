import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Wedding RSVP admin dashboard.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}

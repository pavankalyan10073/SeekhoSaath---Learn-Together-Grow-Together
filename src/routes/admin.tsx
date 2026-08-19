import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — SeekhoSaath" },
      { name: "description", content: "Admin dashboard for managing tutor applications." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return <AdminPanel />;
}

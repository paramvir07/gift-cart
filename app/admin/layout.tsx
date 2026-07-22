import { AppShell } from "@/components/Admin/app-shell"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}

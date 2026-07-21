import { AppShell } from "@/components/Admin/app-shell"
import { Dashboard } from "@/components/Admin/dashboard"

const AdminHome = () => {
  return (
    <div>
    <AppShell>
			<Dashboard />
		</AppShell>
    </div>
  )
}

export default AdminHome

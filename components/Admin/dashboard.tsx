import { BillingHealth } from "@/components/Admin/billing-health"
import { ChannelSalesChart } from "@/components/Admin/channel-sales-chart"
import { DashboardActivity } from "@/components/Admin/dashboard-activity"
import { DashboardInvoices } from "@/components/Admin/dashboard-invoices"
import { NetRevenueChart } from "@/components/Admin/net-revenue-chart"
import { DashboardStats } from "@/components/Admin/stats"

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-px bg-border p-px md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <NetRevenueChart />
      <ChannelSalesChart />
      <DashboardInvoices />
      <BillingHealth />
      <DashboardActivity />
    </div>
  )
}

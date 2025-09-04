import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AppShell } from "~/components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { prisma } from "~/lib/db.server";
import { getTaskStats } from "~/utils/task-automation.server";
import { 
  Users, 
  CheckSquare, 
  Upload, 
  TrendingUp,
  AlertCircle,
  Calendar
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - ScribeSync" },
    { name: "description", content: "Overview of your customer data pipeline" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Get dashboard statistics
  const [
    totalCustomers,
    recentCustomers,
    taskStats,
    recentImports,
    customersBySource,
    recentInteractions
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        customerId: true,
        firstName: true,
        lastName: true,
        email: true,
        source: true,
        totalSpend: true,
        createdAt: true
      }
    }),
    getTaskStats(),
    prisma.customerImport.findMany({
      take: 5,
      orderBy: { importTimestamp: 'desc' },
      include: {
        dataSource: {
          select: { name: true, type: true }
        }
      }
    }),
    prisma.customer.groupBy({
      by: ['source'],
      _count: { source: true },
      orderBy: { _count: { source: 'desc' } }
    }),
    prisma.interaction.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
  ]);

  // Calculate total revenue
  const totalRevenue = await prisma.customer.aggregate({
    _sum: { totalSpend: true }
  });

  return json({
    stats: {
      totalCustomers,
      totalRevenue: totalRevenue._sum.totalSpend || 0,
      ...taskStats
    },
    recentCustomers,
    recentImports,
    customersBySource,
    recentInteractions
  });
}

export default function Dashboard() {
  const { stats, recentCustomers, recentImports, customersBySource, recentInteractions } = useLoaderData<typeof loader>();

  const pieColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-display text-[var(--color-text-primary)]">
            Dashboard
          </h1>
          <p className="text-body text-[var(--color-text-secondary)] mt-2">
            Welcome to ScribeSync. Here's an overview of your customer data pipeline.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Total Customers</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.totalCustomers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Open Tasks</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.open}
                  </p>
                  {stats.overdue > 0 && (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {stats.overdue} overdue
                    </p>
                  )}
                </div>
                <CheckSquare className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Recent Imports</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {recentImports.length}
                  </p>
                </div>
                <Upload className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Sources Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Customers by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customersBySource.map(item => ({
                        name: item.source || 'Unknown',
                        value: item._count.source
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {customersBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.interactionId} className="flex items-start gap-3 p-3 bg-gray-50 rounded-[var(--radius-sm)]">
                    <Calendar className="w-4 h-4 text-[var(--color-text-secondary)] mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {interaction.customer.firstName} {interaction.customer.lastName}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {interaction.type} • {new Date(interaction.timestamp).toLocaleDateString()}
                      </p>
                      {interaction.notes && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 truncate">
                          {interaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {recentInteractions.length === 0 && (
                  <p className="text-center text-[var(--color-text-secondary)] py-8">
                    No recent interactions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Total Spend</th>
                    <th className="text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCustomers.map((customer) => (
                    <tr key={customer.customerId} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[var(--color-text-primary)]">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {customer.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {customer.source || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-primary)]">
                        ${customer.totalSpend.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentCustomers.length === 0 && (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  No customers yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

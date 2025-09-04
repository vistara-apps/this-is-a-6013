import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, Form } from "@remix-run/react";
import { useState } from "react";
import { AppShell } from "~/components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { DataTable, DataTableHeader, DataTableTitle, DataTableActions } from "~/components/ui/DataTable";
import { Modal, ModalContent, ModalFooter } from "~/components/ui/Modal";
import { prisma } from "~/lib/db.server";
import { processCustomerCreatedTasks } from "~/utils/task-automation.server";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Building,
  DollarSign
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Customers - ScribeSync" },
    { name: "description", content: "Manage your customer database" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [customers, totalCount] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: {
            interactions: true,
            tasks: true,
          },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return json({
    customers,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    search,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const source = formData.get("source") as string;
    const totalSpend = parseFloat(formData.get("totalSpend") as string) || 0;

    if (!firstName || !lastName || !email) {
      return json({ error: "First name, last name, and email are required" }, { status: 400 });
    }

    try {
      const customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          source: source || undefined,
          totalSpend,
        },
      });

      // Trigger task automation
      await processCustomerCreatedTasks(customer.customerId);

      return redirect("/customers");
    } catch (error) {
      return json({ error: "Failed to create customer" }, { status: 500 });
    }
  }

  if (intent === "delete") {
    const customerId = formData.get("customerId") as string;
    
    try {
      await prisma.customer.delete({
        where: { customerId },
      });
      return redirect("/customers");
    } catch (error) {
      return json({ error: "Failed to delete customer" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function Customers() {
  const { customers, pagination, search } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (_: any, customer: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <div className="font-medium text-[var(--color-text-primary)]">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {customer.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone" as const,
      header: "Phone",
      render: (phone: string) => phone ? (
        <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
          <Phone className="w-3 h-3" />
          {phone}
        </div>
      ) : (
        <span className="text-[var(--color-text-secondary)]">—</span>
      ),
    },
    {
      key: "source" as const,
      header: "Source",
      render: (source: string) => source ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {source}
        </span>
      ) : (
        <span className="text-[var(--color-text-secondary)]">Unknown</span>
      ),
    },
    {
      key: "totalSpend" as const,
      header: "Total Spend",
      render: (totalSpend: number) => (
        <div className="flex items-center gap-1 font-medium text-[var(--color-text-primary)]">
          <DollarSign className="w-3 h-3" />
          {totalSpend.toLocaleString()}
        </div>
      ),
    },
    {
      key: "stats" as const,
      header: "Activity",
      render: (_: any, customer: any) => (
        <div className="text-sm text-[var(--color-text-secondary)]">
          {customer._count.interactions} interactions • {customer._count.tasks} tasks
        </div>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (_: any, customer: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/customers/${customer.customerId}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteCustomerId(customer.customerId)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-display text-[var(--color-text-primary)]">
            Customers
          </h1>
          <p className="text-body text-[var(--color-text-secondary)] mt-2">
            Manage your customer database and view unified customer profiles.
          </p>
        </div>

        {/* Customers Table */}
        <Card>
          <DataTableHeader>
            <DataTableTitle>
              All Customers ({pagination.totalCount})
            </DataTableTitle>
            <DataTableActions>
              <Form method="get" className="flex items-center gap-2">
                <Input
                  name="search"
                  placeholder="Search customers..."
                  defaultValue={search}
                  className="w-64"
                />
                <Button type="submit" variant="secondary">
                  <Search className="w-4 h-4" />
                </Button>
              </Form>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DataTableActions>
          </DataTableHeader>

          <DataTable
            data={customers}
            columns={columns}
            variant="hover"
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-[var(--color-text-secondary)]">
                Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} customers
              </div>
              <div className="flex items-center gap-2">
                {pagination.hasPreviousPage && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/customers?page=${pagination.currentPage - 1}${search ? `&search=${search}` : ''}`)}
                  >
                    Previous
                  </Button>
                )}
                {pagination.hasNextPage && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/customers?page=${pagination.currentPage + 1}${search ? `&search=${search}` : ''}`)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Create Customer Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New Customer"
        >
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="First Name"
                required
              />
              <Input
                name="lastName"
                label="Last Name"
                required
              />
            </div>
            
            <Input
              name="email"
              label="Email"
              type="email"
              required
            />
            
            <Input
              name="phone"
              label="Phone"
              type="tel"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="source"
                label="Source"
                placeholder="e.g., Website, Referral"
              />
              <Input
                name="totalSpend"
                label="Total Spend"
                type="number"
                step="0.01"
                defaultValue="0"
              />
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Customer
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteCustomerId}
          onClose={() => setDeleteCustomerId(null)}
          title="Delete Customer"
        >
          <ModalContent>
            <p className="text-body text-[var(--color-text-secondary)]">
              Are you sure you want to delete this customer? This action cannot be undone and will also delete all associated interactions and tasks.
            </p>
          </ModalContent>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteCustomerId(null)}
            >
              Cancel
            </Button>
            <Form method="post">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="customerId" value={deleteCustomerId || ""} />
              <Button type="submit" variant="destructive">
                Delete Customer
              </Button>
            </Form>
          </ModalFooter>
        </Modal>
      </div>
    </AppShell>
  );
}

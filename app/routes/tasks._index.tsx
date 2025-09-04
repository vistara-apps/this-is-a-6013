import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { AppShell } from "~/components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Input, Textarea } from "~/components/ui/Input";
import { DataTable, DataTableHeader, DataTableTitle, DataTableActions } from "~/components/ui/DataTable";
import { Modal, ModalContent, ModalFooter } from "~/components/ui/Modal";
import { prisma } from "~/lib/db.server";
import { getTaskStats, getTaskRules, updateTaskRule } from "~/utils/task-automation.server";
import { 
  Plus, 
  Search, 
  CheckSquare, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Settings,
  Check,
  X
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tasks - ScribeSync" },
    { name: "description", content: "Manage customer tasks and automation rules" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "all";
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  
  if (status !== "all") {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { description: { contains: search, mode: "insensitive" as const } },
      { customer: { 
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } }
        ]
      }}
    ];
  }

  const [tasks, totalCount, taskStats, taskRules] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // Open tasks first
        { dueDate: 'asc' }, // Then by due date
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit,
      include: {
        customer: {
          select: {
            customerId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    }),
    prisma.task.count({ where }),
    getTaskStats(),
    getTaskRules()
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return json({
    tasks,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    filters: { status, search },
    taskStats,
    taskRules
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const customerId = formData.get("customerId") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!customerId || !description) {
      return json({ error: "Customer and description are required" }, { status: 400 });
    }

    try {
      await prisma.task.create({
        data: {
          customerId,
          description,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          status: 'open'
        }
      });

      return redirect("/tasks");
    } catch (error) {
      return json({ error: "Failed to create task" }, { status: 500 });
    }
  }

  if (intent === "complete") {
    const taskId = formData.get("taskId") as string;
    
    try {
      await prisma.task.update({
        where: { taskId },
        data: { 
          status: 'completed',
          completedAt: new Date()
        }
      });
      return redirect("/tasks");
    } catch (error) {
      return json({ error: "Failed to complete task" }, { status: 500 });
    }
  }

  if (intent === "delete") {
    const taskId = formData.get("taskId") as string;
    
    try {
      await prisma.task.delete({
        where: { taskId }
      });
      return redirect("/tasks");
    } catch (error) {
      return json({ error: "Failed to delete task" }, { status: 500 });
    }
  }

  if (intent === "toggle-rule") {
    const ruleId = formData.get("ruleId") as string;
    const enabled = formData.get("enabled") === "true";
    
    updateTaskRule(ruleId, enabled);
    return redirect("/tasks");
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function Tasks() {
  const { tasks, pagination, filters, taskStats, taskRules } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  // Load customers for task creation
  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const taskColumns = [
    {
      key: "status" as const,
      header: "Status",
      render: (status: string, task: any) => {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && status === 'open';
        
        if (status === 'completed') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckSquare className="w-3 h-3" />
              Completed
            </span>
          );
        }
        
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isOverdue 
              ? 'bg-red-100 text-red-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {isOverdue ? 'Overdue' : 'Open'}
          </span>
        );
      },
    },
    {
      key: "description" as const,
      header: "Task",
      render: (description: string, task: any) => (
        <div>
          <div className="font-medium text-[var(--color-text-primary)]">
            {description}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
            <User className="w-3 h-3" />
            {task.customer.firstName} {task.customer.lastName}
          </div>
        </div>
      ),
    },
    {
      key: "dueDate" as const,
      header: "Due Date",
      render: (dueDate: string | null) => dueDate ? (
        <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
          <Calendar className="w-3 h-3" />
          {new Date(dueDate).toLocaleDateString()}
        </div>
      ) : (
        <span className="text-[var(--color-text-secondary)]">—</span>
      ),
    },
    {
      key: "createdAt" as const,
      header: "Created",
      render: (createdAt: string) => (
        <span className="text-[var(--color-text-secondary)]">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (_: any, task: any) => (
        <div className="flex items-center gap-2">
          {task.status === 'open' && (
            <Form method="post" className="inline">
              <input type="hidden" name="intent" value="complete" />
              <input type="hidden" name="taskId" value={task.taskId} />
              <Button size="sm" variant="secondary" type="submit">
                <Check className="w-4 h-4" />
              </Button>
            </Form>
          )}
          <Form method="post" className="inline">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="taskId" value={task.taskId} />
            <Button size="sm" variant="destructive" type="submit">
              <X className="w-4 h-4" />
            </Button>
          </Form>
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
            Tasks
          </h1>
          <p className="text-body text-[var(--color-text-secondary)] mt-2">
            Manage customer tasks and configure automation rules.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Total Tasks</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {taskStats.total}
                  </p>
                </div>
                <CheckSquare className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Open Tasks</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {taskStats.open}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Completed</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {taskStats.completed}
                  </p>
                </div>
                <CheckSquare className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Overdue</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {taskStats.overdue}
                  </p>
                  {taskStats.overdue > 0 && (
                    <p className="text-xs text-red-600 mt-1">Needs attention</p>
                  )}
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Table */}
        <Card>
          <DataTableHeader>
            <DataTableTitle>
              All Tasks ({pagination.totalCount})
            </DataTableTitle>
            <DataTableActions>
              <Form method="get" className="flex items-center gap-2">
                <select 
                  name="status" 
                  defaultValue={filters.status}
                  className="input-text w-32"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="completed">Completed</option>
                </select>
                <Input
                  name="search"
                  placeholder="Search tasks..."
                  defaultValue={filters.search}
                  className="w-64"
                />
                <Button type="submit" variant="secondary">
                  <Search className="w-4 h-4" />
                </Button>
              </Form>
              <Button onClick={() => setShowRulesModal(true)} variant="secondary">
                <Settings className="w-4 h-4 mr-2" />
                Automation Rules
              </Button>
              <Button onClick={() => {
                loadCustomers();
                setShowCreateModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DataTableActions>
          </DataTableHeader>

          <DataTable
            data={tasks}
            columns={taskColumns}
            variant="hover"
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-[var(--color-text-secondary)]">
                Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} tasks
              </div>
              <div className="flex items-center gap-2">
                {pagination.hasPreviousPage && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/tasks?page=${pagination.currentPage - 1}${filters.status !== 'all' ? `&status=${filters.status}` : ''}${filters.search ? `&search=${filters.search}` : ''}`)}
                  >
                    Previous
                  </Button>
                )}
                {pagination.hasNextPage && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/tasks?page=${pagination.currentPage + 1}${filters.status !== 'all' ? `&status=${filters.status}` : ''}${filters.search ? `&search=${filters.search}` : ''}`)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Create Task Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Task"
        >
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Customer
              </label>
              <select name="customerId" required className="input-text">
                <option value="">Select a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.firstName} {customer.lastName} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
            
            <Textarea
              name="description"
              label="Task Description"
              placeholder="Describe what needs to be done..."
              required
            />
            
            <Input
              name="dueDate"
              label="Due Date (Optional)"
              type="date"
            />

            <ModalFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Task
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Automation Rules Modal */}
        <Modal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          title="Task Automation Rules"
          className="max-w-2xl"
        >
          <ModalContent>
            <div className="space-y-4">
              <p className="text-[var(--color-text-secondary)]">
                Configure automatic task creation rules based on customer events.
              </p>
              
              {taskRules.map((rule) => (
                <div key={rule.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-[var(--radius-sm)]">
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--color-text-primary)]">
                      {rule.name}
                    </h4>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {rule.description}
                    </p>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-2">
                      Trigger: {rule.trigger.type}
                      {rule.trigger.schedule && ` (${rule.trigger.schedule})`}
                    </div>
                  </div>
                  <Form method="post" className="ml-4">
                    <input type="hidden" name="intent" value="toggle-rule" />
                    <input type="hidden" name="ruleId" value={rule.id} />
                    <input type="hidden" name="enabled" value={(!rule.enabled).toString()} />
                    <Button
                      type="submit"
                      size="sm"
                      variant={rule.enabled ? "primary" : "secondary"}
                    >
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Button>
                  </Form>
                </div>
              ))}
            </div>
          </ModalContent>
          <ModalFooter>
            <Button onClick={() => setShowRulesModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </AppShell>
  );
}

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = {};
__export(entry_server_node_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-WJEPQS5N.css";

// app/root.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default }
], meta = () => [
  { title: "ScribeSync - Automate your customer data pipeline" },
  { name: "description", content: "A web application for solo founders to automate customer data import, cleaning, and create unified customer profiles." }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx2(Outlet, {}),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {}),
      /* @__PURE__ */ jsx2(LiveReload, {})
    ] })
  ] });
}

// app/routes/customers._index.tsx
var customers_index_exports = {};
__export(customers_index_exports, {
  action: () => action,
  default: () => Customers,
  loader: () => loader,
  meta: () => meta2
});
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, Form } from "@remix-run/react";
import { useState } from "react";

// app/components/AppShell.tsx
import { NavLink } from "@remix-run/react";

// app/utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// app/components/AppShell.tsx
import {
  LayoutDashboard,
  Users,
  Upload,
  CheckSquare,
  BarChart3,
  Settings,
  Database
} from "lucide-react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function AppShell({ children, variant = "sidebarLeft" }) {
  return variant === "sidebarLeft" ? /* @__PURE__ */ jsx3("div", { className: "min-h-screen gradient-bg", children: /* @__PURE__ */ jsxs2("div", { className: "flex", children: [
    /* @__PURE__ */ jsx3(Sidebar, {}),
    /* @__PURE__ */ jsx3("main", { className: "flex-1 ml-64 p-6", children: /* @__PURE__ */ jsx3("div", { className: "container-fluid animate-fade-in", children }) })
  ] }) }) : /* @__PURE__ */ jsx3("div", { className: "min-h-screen gradient-bg", children: /* @__PURE__ */ jsx3("div", { className: "container-fluid py-6 animate-fade-in", children }) });
}
function Sidebar() {
  return /* @__PURE__ */ jsxs2("div", { className: "sidebar-left", children: [
    /* @__PURE__ */ jsxs2("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsx3("div", { className: "w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-sm)] flex items-center justify-center", children: /* @__PURE__ */ jsx3(Database, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs2("div", { children: [
          /* @__PURE__ */ jsx3("h1", { className: "text-xl font-bold text-[var(--color-text-primary)]", children: "ScribeSync" }),
          /* @__PURE__ */ jsx3("p", { className: "text-xs text-[var(--color-text-secondary)]", children: "Customer Data Pipeline" })
        ] })
      ] }),
      /* @__PURE__ */ jsx3("nav", { className: "space-y-2", children: [
        {
          name: "Dashboard",
          href: "/",
          icon: LayoutDashboard
        },
        {
          name: "Customers",
          href: "/customers",
          icon: Users
        },
        {
          name: "Data Import",
          href: "/import",
          icon: Upload
        },
        {
          name: "Tasks",
          href: "/tasks",
          icon: CheckSquare
        },
        {
          name: "Analytics",
          href: "/analytics",
          icon: BarChart3
        },
        {
          name: "Data Sources",
          href: "/data-sources",
          icon: Database
        },
        {
          name: "Settings",
          href: "/settings",
          icon: Settings
        }
      ].map((item) => /* @__PURE__ */ jsxs2(
        NavLink,
        {
          to: item.href,
          className: ({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-[var(--duration-fast)]",
            isActive ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-100"
          ),
          children: [
            /* @__PURE__ */ jsx3(item.icon, { className: "w-5 h-5" }),
            item.name
          ]
        },
        item.name
      )) })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200", children: /* @__PURE__ */ jsxs2("div", { className: "text-xs text-[var(--color-text-secondary)]", children: [
      /* @__PURE__ */ jsx3("p", { children: "\xA9 2024 ScribeSync" }),
      /* @__PURE__ */ jsx3("p", { children: "v1.0.0" })
    ] }) })
  ] });
}

// app/components/ui/Card.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function Card({ children, className, variant = "default" }) {
  return /* @__PURE__ */ jsx4(
    "div",
    {
      className: cn(
        variant === "elevated" ? "card-elevated" : "card",
        className
      ),
      children
    }
  );
}
function CardHeader({ children, className }) {
  return /* @__PURE__ */ jsx4("div", { className: cn("mb-4", className), children });
}
function CardTitle({ children, className }) {
  return /* @__PURE__ */ jsx4("h3", { className: cn("text-heading text-[var(--color-text-primary)]", className), children });
}
function CardContent({ children, className }) {
  return /* @__PURE__ */ jsx4("div", { className: cn("text-body", className), children });
}

// app/components/ui/Button.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  let baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-[var(--duration-base)] ease-[var(--easing)] disabled:opacity-50 disabled:cursor-not-allowed", variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    destructive: "btn-destructive"
  }, sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  return /* @__PURE__ */ jsx5(
    "button",
    {
      className: cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      ),
      ...props,
      children
    }
  );
}

// app/components/ui/Input.tsx
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
function Input({
  variant = "text",
  label,
  error,
  className,
  ...props
}) {
  let inputClasses = cn(
    "input-text",
    error && "border-red-500 ring-red-500/20",
    variant === "fileUpload" && "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:bg-[hsl(240,80%,45%)]",
    className
  );
  return /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
    label && /* @__PURE__ */ jsx6("label", { className: "block text-sm font-medium text-[var(--color-text-primary)]", children: label }),
    /* @__PURE__ */ jsx6(
      "input",
      {
        type: variant === "fileUpload" ? "file" : variant,
        className: inputClasses,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx6("p", { className: "text-sm text-red-600", children: error })
  ] });
}
function Textarea({
  label,
  error,
  className,
  ...props
}) {
  let textareaClasses = cn(
    "input-text min-h-[100px] resize-vertical",
    error && "border-red-500 ring-red-500/20",
    className
  );
  return /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
    label && /* @__PURE__ */ jsx6("label", { className: "block text-sm font-medium text-[var(--color-text-primary)]", children: label }),
    /* @__PURE__ */ jsx6(
      "textarea",
      {
        className: textareaClasses,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx6("p", { className: "text-sm text-red-600", children: error })
  ] });
}

// app/components/ui/DataTable.tsx
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
function DataTable({
  data,
  columns,
  variant = "default",
  className,
  onRowClick
}) {
  let tableClasses = cn(
    "data-table",
    variant === "zebra" && "data-table-zebra",
    variant === "hover" && "data-table-hover",
    className
  );
  return /* @__PURE__ */ jsxs4("div", { className: tableClasses, children: [
    /* @__PURE__ */ jsxs4("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx7("thead", { children: /* @__PURE__ */ jsx7("tr", { children: columns.map((column) => /* @__PURE__ */ jsx7("th", { className: column.className, children: column.header }, String(column.key))) }) }),
      /* @__PURE__ */ jsx7("tbody", { children: data.map((row, index) => /* @__PURE__ */ jsx7(
        "tr",
        {
          className: onRowClick ? "cursor-pointer" : "",
          onClick: () => onRowClick?.(row),
          children: columns.map((column) => /* @__PURE__ */ jsx7("td", { className: column.className, children: column.render ? column.render(row[column.key], row) : String(row[column.key] || "") }, String(column.key)))
        },
        index
      )) })
    ] }),
    data.length === 0 && /* @__PURE__ */ jsx7("div", { className: "p-8 text-center text-[var(--color-text-secondary)]", children: "No data available" })
  ] });
}
function DataTableHeader({ children, className }) {
  return /* @__PURE__ */ jsx7("div", { className: cn("mb-4 flex items-center justify-between", className), children });
}
function DataTableTitle({ children, className }) {
  return /* @__PURE__ */ jsx7("h2", { className: cn("text-heading", className), children });
}
function DataTableActions({ children, className }) {
  return /* @__PURE__ */ jsx7("div", { className: cn("flex items-center gap-2", className), children });
}

// app/components/ui/Modal.tsx
import { useEffect } from "react";
import { X } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
function Modal({
  isOpen,
  onClose,
  children,
  variant = "default",
  title,
  className
}) {
  return useEffect(() => {
    let handleEscape = (e) => {
      e.key === "Escape" && onClose();
    };
    return isOpen && (document.addEventListener("keydown", handleEscape), document.body.style.overflow = "hidden"), () => {
      document.removeEventListener("keydown", handleEscape), document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]), isOpen ? /* @__PURE__ */ jsx8("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxs5(
    "div",
    {
      className: cn("modal-content", className),
      onClick: (e) => e.stopPropagation(),
      children: [
        title && /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx8("h2", { className: "text-heading", children: title }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: onClose,
              className: "p-1 hover:bg-gray-100 rounded-[var(--radius-sm)] transition-colors",
              children: /* @__PURE__ */ jsx8(X, { size: 20 })
            }
          )
        ] }),
        children
      ]
    }
  ) }) : null;
}
function ModalContent({ children, className }) {
  return /* @__PURE__ */ jsx8("div", { className: cn("mb-6", className), children });
}
function ModalFooter({ children, className }) {
  return /* @__PURE__ */ jsx8("div", { className: cn("flex items-center justify-end gap-3", className), children });
}

// app/lib/db.server.ts
import { PrismaClient } from "@prisma/client";
var prisma;
prisma = new PrismaClient();

// app/utils/task-automation.server.ts
import * as cron from "node-cron";
var DEFAULT_TASK_RULES = [
  {
    id: "new-lead-followup",
    name: "New Lead Follow-up",
    description: "Create follow-up task for new leads from website",
    trigger: {
      type: "customer_created",
      conditions: { source: "Website" }
    },
    action: {
      type: "create_task",
      template: "Follow up with new lead from website - {customerName}",
      dueInDays: 1
    },
    enabled: !0
  },
  {
    id: "referral-welcome",
    name: "Referral Welcome",
    description: "Create welcome task for referral customers",
    trigger: {
      type: "customer_created",
      conditions: { source: "Referral" }
    },
    action: {
      type: "create_task",
      template: "Send welcome package to referral customer - {customerName}",
      dueInDays: 0
    },
    enabled: !0
  },
  {
    id: "purchase-followup",
    name: "Purchase Follow-up",
    description: "Create follow-up task after purchase interaction",
    trigger: {
      type: "interaction_added",
      conditions: { type: "purchase" }
    },
    action: {
      type: "create_task",
      template: "Follow up on recent purchase with {customerName}",
      dueInDays: 7
    },
    enabled: !0
  },
  {
    id: "inactivity-check",
    name: "Customer Inactivity Check",
    description: "Create task for customers with no recent interactions",
    trigger: {
      type: "scheduled",
      schedule: "0 9 * * 1"
      // Every Monday at 9 AM
    },
    action: {
      type: "create_task",
      template: "Check in with inactive customer - {customerName}",
      dueInDays: 3
    },
    enabled: !0
  }
];
async function processCustomerCreatedTasks(customerId) {
  let customer = await prisma.customer.findUnique({
    where: { customerId }
  });
  if (!customer)
    return;
  let applicableRules = DEFAULT_TASK_RULES.filter(
    (rule) => rule.enabled && rule.trigger.type === "customer_created" && matchesConditions(customer, rule.trigger.conditions)
  );
  for (let rule of applicableRules)
    await createTaskFromRule(rule, customer);
}
async function createTaskFromRule(rule, customer, interaction) {
  try {
    let dueDate = rule.action.dueInDays !== void 0 ? new Date(Date.now() + rule.action.dueInDays * 24 * 60 * 60 * 1e3) : void 0, description = rule.action.template.replace("{customerName}", `${customer.firstName} ${customer.lastName}`).replace("{customerEmail}", customer.email).replace("{customerSource}", customer.source || "Unknown");
    await prisma.task.create({
      data: {
        customerId: customer.customerId,
        description,
        dueDate,
        status: "open",
        assignedTo: rule.action.assignTo
      }
    }), console.log(`\u2705 Created task: ${description}`);
  } catch (error) {
    console.error(`Error creating task from rule ${rule.name}:`, error);
  }
}
function matchesConditions(obj, conditions) {
  return conditions ? Object.entries(conditions).every(([key, value]) => obj[key] === value) : !0;
}
function getTaskRules() {
  return DEFAULT_TASK_RULES;
}
function updateTaskRule(ruleId, enabled) {
  let rule = DEFAULT_TASK_RULES.find((r) => r.id === ruleId);
  return rule ? (rule.enabled = enabled, !0) : !1;
}
async function getTaskStats() {
  let [totalTasks, openTasks, completedTasks, overdueTasks] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "open" } }),
    prisma.task.count({ where: { status: "completed" } }),
    prisma.task.count({
      where: {
        status: "open",
        dueDate: { lt: /* @__PURE__ */ new Date() }
      }
    })
  ]);
  return {
    total: totalTasks,
    open: openTasks,
    completed: completedTasks,
    overdue: overdueTasks
  };
}

// app/routes/customers._index.tsx
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Mail,
  Phone,
  DollarSign
} from "lucide-react";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var meta2 = () => [
  { title: "Customers - ScribeSync" },
  { name: "description", content: "Manage your customer database" }
];
async function loader({ request }) {
  let url = new URL(request.url), search = url.searchParams.get("search") || "", page = parseInt(url.searchParams.get("page") || "1"), limit = 20, offset = (page - 1) * limit, where = search ? {
    OR: [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ]
  } : {}, [customers, totalCount] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        _count: {
          select: {
            interactions: !0,
            tasks: !0
          }
        }
      }
    }),
    prisma.customer.count({ where })
  ]), totalPages = Math.ceil(totalCount / limit);
  return json({
    customers,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    search
  });
}
async function action({ request }) {
  let formData = await request.formData(), intent = formData.get("intent");
  if (intent === "create") {
    let firstName = formData.get("firstName"), lastName = formData.get("lastName"), email = formData.get("email"), phone = formData.get("phone"), source = formData.get("source"), totalSpend = parseFloat(formData.get("totalSpend")) || 0;
    if (!firstName || !lastName || !email)
      return json({ error: "First name, last name, and email are required" }, { status: 400 });
    try {
      let customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phone: phone || void 0,
          source: source || void 0,
          totalSpend
        }
      });
      return await processCustomerCreatedTasks(customer.customerId), redirect("/customers");
    } catch {
      return json({ error: "Failed to create customer" }, { status: 500 });
    }
  }
  if (intent === "delete") {
    let customerId = formData.get("customerId");
    try {
      return await prisma.customer.delete({
        where: { customerId }
      }), redirect("/customers");
    } catch {
      return json({ error: "Failed to delete customer" }, { status: 500 });
    }
  }
  return json({ error: "Invalid action" }, { status: 400 });
}
function Customers() {
  let { customers, pagination, search } = useLoaderData(), navigate = useNavigate(), [showCreateModal, setShowCreateModal] = useState(!1), [deleteCustomerId, setDeleteCustomerId] = useState(null), columns = [
    {
      key: "name",
      header: "Name",
      render: (_, customer) => /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs6("div", { className: "w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium", children: [
          customer.firstName[0],
          customer.lastName[0]
        ] }),
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsxs6("div", { className: "font-medium text-[var(--color-text-primary)]", children: [
            customer.firstName,
            " ",
            customer.lastName
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "text-sm text-[var(--color-text-secondary)] flex items-center gap-1", children: [
            /* @__PURE__ */ jsx9(Mail, { className: "w-3 h-3" }),
            customer.email
          ] })
        ] })
      ] })
    },
    {
      key: "phone",
      header: "Phone",
      render: (phone) => phone ? /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1 text-[var(--color-text-secondary)]", children: [
        /* @__PURE__ */ jsx9(Phone, { className: "w-3 h-3" }),
        phone
      ] }) : /* @__PURE__ */ jsx9("span", { className: "text-[var(--color-text-secondary)]", children: "\u2014" })
    },
    {
      key: "source",
      header: "Source",
      render: (source) => source ? /* @__PURE__ */ jsx9("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: source }) : /* @__PURE__ */ jsx9("span", { className: "text-[var(--color-text-secondary)]", children: "Unknown" })
    },
    {
      key: "totalSpend",
      header: "Total Spend",
      render: (totalSpend) => /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1 font-medium text-[var(--color-text-primary)]", children: [
        /* @__PURE__ */ jsx9(DollarSign, { className: "w-3 h-3" }),
        totalSpend.toLocaleString()
      ] })
    },
    {
      key: "stats",
      header: "Activity",
      render: (_, customer) => /* @__PURE__ */ jsxs6("div", { className: "text-sm text-[var(--color-text-secondary)]", children: [
        customer._count.interactions,
        " interactions \u2022 ",
        customer._count.tasks,
        " tasks"
      ] })
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, customer) => /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx9(
          Button,
          {
            size: "sm",
            variant: "secondary",
            onClick: () => navigate(`/customers/${customer.customerId}`),
            children: /* @__PURE__ */ jsx9(Eye, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsx9(
          Button,
          {
            size: "sm",
            variant: "destructive",
            onClick: () => setDeleteCustomerId(customer.customerId),
            children: /* @__PURE__ */ jsx9(Trash2, { className: "w-4 h-4" })
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ jsx9(AppShell, { children: /* @__PURE__ */ jsxs6("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs6("div", { children: [
      /* @__PURE__ */ jsx9("h1", { className: "text-display text-[var(--color-text-primary)]", children: "Customers" }),
      /* @__PURE__ */ jsx9("p", { className: "text-body text-[var(--color-text-secondary)] mt-2", children: "Manage your customer database and view unified customer profiles." })
    ] }),
    /* @__PURE__ */ jsxs6(Card, { children: [
      /* @__PURE__ */ jsxs6(DataTableHeader, { children: [
        /* @__PURE__ */ jsxs6(DataTableTitle, { children: [
          "All Customers (",
          pagination.totalCount,
          ")"
        ] }),
        /* @__PURE__ */ jsxs6(DataTableActions, { children: [
          /* @__PURE__ */ jsxs6(Form, { method: "get", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx9(
              Input,
              {
                name: "search",
                placeholder: "Search customers...",
                defaultValue: search,
                className: "w-64"
              }
            ),
            /* @__PURE__ */ jsx9(Button, { type: "submit", variant: "secondary", children: /* @__PURE__ */ jsx9(Search, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ jsxs6(Button, { onClick: () => setShowCreateModal(!0), children: [
            /* @__PURE__ */ jsx9(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Customer"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx9(
        DataTable,
        {
          data: customers,
          columns,
          variant: "hover"
        }
      ),
      pagination.totalPages > 1 && /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between px-6 py-4 border-t border-gray-200", children: [
        /* @__PURE__ */ jsxs6("div", { className: "text-sm text-[var(--color-text-secondary)]", children: [
          "Showing ",
          (pagination.currentPage - 1) * 20 + 1,
          " to ",
          Math.min(pagination.currentPage * 20, pagination.totalCount),
          " of ",
          pagination.totalCount,
          " customers"
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
          pagination.hasPreviousPage && /* @__PURE__ */ jsx9(
            Button,
            {
              variant: "secondary",
              onClick: () => navigate(`/customers?page=${pagination.currentPage - 1}${search ? `&search=${search}` : ""}`),
              children: "Previous"
            }
          ),
          pagination.hasNextPage && /* @__PURE__ */ jsx9(
            Button,
            {
              variant: "secondary",
              onClick: () => navigate(`/customers?page=${pagination.currentPage + 1}${search ? `&search=${search}` : ""}`),
              children: "Next"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx9(
      Modal,
      {
        isOpen: showCreateModal,
        onClose: () => setShowCreateModal(!1),
        title: "Add New Customer",
        children: /* @__PURE__ */ jsxs6(Form, { method: "post", className: "space-y-4", children: [
          /* @__PURE__ */ jsx9("input", { type: "hidden", name: "intent", value: "create" }),
          /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx9(
              Input,
              {
                name: "firstName",
                label: "First Name",
                required: !0
              }
            ),
            /* @__PURE__ */ jsx9(
              Input,
              {
                name: "lastName",
                label: "Last Name",
                required: !0
              }
            )
          ] }),
          /* @__PURE__ */ jsx9(
            Input,
            {
              name: "email",
              label: "Email",
              type: "email",
              required: !0
            }
          ),
          /* @__PURE__ */ jsx9(
            Input,
            {
              name: "phone",
              label: "Phone",
              type: "tel"
            }
          ),
          /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx9(
              Input,
              {
                name: "source",
                label: "Source",
                placeholder: "e.g., Website, Referral"
              }
            ),
            /* @__PURE__ */ jsx9(
              Input,
              {
                name: "totalSpend",
                label: "Total Spend",
                type: "number",
                step: "0.01",
                defaultValue: "0"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs6(ModalFooter, { children: [
            /* @__PURE__ */ jsx9(
              Button,
              {
                type: "button",
                variant: "secondary",
                onClick: () => setShowCreateModal(!1),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx9(Button, { type: "submit", children: "Create Customer" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs6(
      Modal,
      {
        isOpen: !!deleteCustomerId,
        onClose: () => setDeleteCustomerId(null),
        title: "Delete Customer",
        children: [
          /* @__PURE__ */ jsx9(ModalContent, { children: /* @__PURE__ */ jsx9("p", { className: "text-body text-[var(--color-text-secondary)]", children: "Are you sure you want to delete this customer? This action cannot be undone and will also delete all associated interactions and tasks." }) }),
          /* @__PURE__ */ jsxs6(ModalFooter, { children: [
            /* @__PURE__ */ jsx9(
              Button,
              {
                variant: "secondary",
                onClick: () => setDeleteCustomerId(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxs6(Form, { method: "post", children: [
              /* @__PURE__ */ jsx9("input", { type: "hidden", name: "intent", value: "delete" }),
              /* @__PURE__ */ jsx9("input", { type: "hidden", name: "customerId", value: deleteCustomerId || "" }),
              /* @__PURE__ */ jsx9(Button, { type: "submit", variant: "destructive", children: "Delete Customer" })
            ] })
          ] })
        ]
      }
    )
  ] }) });
}

// app/routes/api.customers.tsx
var api_customers_exports = {};
__export(api_customers_exports, {
  loader: () => loader2
});
import { json as json2 } from "@remix-run/node";
async function loader2({ request }) {
  try {
    let customers = await prisma.customer.findMany({
      select: {
        customerId: !0,
        firstName: !0,
        lastName: !0,
        email: !0
      },
      orderBy: [
        { firstName: "asc" },
        { lastName: "asc" }
      ]
    });
    return json2(customers);
  } catch {
    return json2({ error: "Failed to load customers" }, { status: 500 });
  }
}

// app/routes/import._index.tsx
var import_index_exports = {};
__export(import_index_exports, {
  action: () => action2,
  default: () => DataImport,
  loader: () => loader3,
  meta: () => meta3
});
import { json as json3, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { useActionData, useLoaderData as useLoaderData2, Form as Form2, useNavigation } from "@remix-run/react";
import { useState as useState2 } from "react";

// app/utils/data-cleaning.server.ts
import { parse } from "csv-parse/sync";
function parseCSV(content) {
  try {
    return parse(content, {
      columns: !0,
      skip_empty_lines: !0,
      trim: !0
    });
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function cleanCustomerData(rawData) {
  let cleaned = [], duplicates = [], errors = [], emailSet = /* @__PURE__ */ new Set();
  return rawData.forEach((row, index) => {
    try {
      let firstName = cleanName(row.firstName || row.first_name || row.fname || ""), lastName = cleanName(row.lastName || row.last_name || row.lname || ""), email = cleanEmail(row.email || row.emailAddress || row.email_address || ""), phone = cleanPhone(row.phone || row.phoneNumber || row.phone_number || "");
      if (!firstName || !lastName) {
        errors.push({
          row: index + 1,
          error: "Missing required fields: firstName and lastName",
          data: row
        });
        return;
      }
      if (!email || !isValidEmail(email)) {
        errors.push({
          row: index + 1,
          error: "Invalid or missing email address",
          data: row
        });
        return;
      }
      if (emailSet.has(email.toLowerCase())) {
        duplicates.push({
          firstName,
          lastName,
          email,
          phone,
          source: row.source || "CSV Import",
          totalSpend: parseFloat(row.totalSpend || row.total_spend || "0") || 0,
          customFields: extractCustomFields(row)
        });
        return;
      }
      emailSet.add(email.toLowerCase());
      let cleanedRecord = {
        firstName,
        lastName,
        email,
        phone: phone || void 0,
        source: row.source || "CSV Import",
        totalSpend: parseFloat(row.totalSpend || row.total_spend || "0") || 0,
        customFields: extractCustomFields(row)
      };
      cleaned.push(cleanedRecord);
    } catch (error) {
      errors.push({
        row: index + 1,
        error: error instanceof Error ? error.message : "Unknown processing error",
        data: row
      });
    }
  }), { cleaned, duplicates, errors };
}
function cleanName(name) {
  return name.trim().replace(/\s+/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
function cleanEmail(email) {
  return email.trim().toLowerCase();
}
function cleanPhone(phone) {
  if (!phone)
    return "";
  let cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.match(/^1\d{10}$/) ? cleaned = "+" + cleaned : cleaned.match(/^\d{10}$/) ? cleaned = "+1" + cleaned : cleaned.match(/^\d/) && !cleaned.startsWith("+") && (cleaned = "+" + cleaned), cleaned;
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function extractCustomFields(row) {
  let standardFields = /* @__PURE__ */ new Set([
    "firstName",
    "first_name",
    "fname",
    "lastName",
    "last_name",
    "lname",
    "email",
    "emailAddress",
    "email_address",
    "phone",
    "phoneNumber",
    "phone_number",
    "source",
    "totalSpend",
    "total_spend"
  ]), customFields = {};
  return Object.entries(row).forEach(([key, value]) => {
    !standardFields.has(key) && value !== null && value !== void 0 && value !== "" && (customFields[key] = value);
  }), Object.keys(customFields).length > 0 ? customFields : void 0;
}

// app/routes/import._index.tsx
import {
  Upload as Upload2,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users as Users2,
  AlertCircle
} from "lucide-react";
import { Fragment, jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
var meta3 = () => [
  { title: "Data Import - ScribeSync" },
  { name: "description", content: "Import and clean customer data from CSV files" }
];
async function loader3({ request }) {
  let recentImports = await prisma.customerImport.findMany({
    take: 10,
    orderBy: { importTimestamp: "desc" },
    include: {
      dataSource: {
        select: { name: !0, type: !0 }
      }
    }
  }), dataSources = await prisma.dataSource.findMany({
    orderBy: { createdAt: "desc" }
  });
  return json3({
    recentImports,
    dataSources
  });
}
async function action2({ request }) {
  let uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 1e7
    // 10MB
  });
  try {
    let formData = await unstable_parseMultipartFormData(request, uploadHandler), intent = formData.get("intent");
    if (intent === "upload") {
      let file = formData.get("csvFile"), sourceId = formData.get("sourceId");
      if (!file || file.size === 0)
        return json3({ error: "Please select a CSV file" }, { status: 400 });
      if (!file.name.endsWith(".csv"))
        return json3({ error: "Please upload a CSV file" }, { status: 400 });
      let content = await file.text(), rawData;
      try {
        rawData = parseCSV(content);
      } catch (error) {
        return json3({
          error: `CSV parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`
        }, { status: 400 });
      }
      if (rawData.length === 0)
        return json3({ error: "CSV file is empty" }, { status: 400 });
      let cleaningResult = cleanCustomerData(rawData), customerImport = await prisma.customerImport.create({
        data: {
          sourceId: sourceId || "default",
          status: "processing",
          recordsProcessed: rawData.length,
          recordsSucceeded: 0,
          recordsFailed: cleaningResult.errors.length + cleaningResult.duplicates.length
        }
      });
      return json3({
        success: !0,
        importId: customerImport.importId,
        preview: {
          total: rawData.length,
          cleaned: cleaningResult.cleaned,
          duplicates: cleaningResult.duplicates,
          errors: cleaningResult.errors,
          sample: cleaningResult.cleaned.slice(0, 5)
          // Show first 5 records
        }
      });
    }
    if (intent === "confirm") {
      let importId = formData.get("importId"), cleanedDataJson = formData.get("cleanedData");
      if (!cleanedDataJson)
        return json3({ error: "No data to import" }, { status: 400 });
      let cleanedData = JSON.parse(cleanedDataJson), successCount = 0, failCount = 0, createdCustomers = [];
      for (let record of cleanedData)
        try {
          let customer = await prisma.customer.create({
            data: {
              firstName: record.firstName,
              lastName: record.lastName,
              email: record.email,
              phone: record.phone,
              source: record.source,
              totalSpend: record.totalSpend || 0,
              customFields: record.customFields
            }
          });
          createdCustomers.push(customer.customerId), successCount++;
        } catch (error) {
          failCount++, console.error("Failed to create customer:", error);
        }
      await prisma.customerImport.update({
        where: { importId },
        data: {
          status: (failCount > 0, "completed"),
          recordsSucceeded: successCount,
          recordsFailed: failCount
        }
      });
      for (let customerId of createdCustomers)
        try {
          await processCustomerCreatedTasks(customerId);
        } catch (error) {
          console.error("Failed to process tasks for customer:", customerId, error);
        }
      return json3({
        success: !0,
        imported: {
          total: cleanedData.length,
          succeeded: successCount,
          failed: failCount
        }
      });
    }
    return json3({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return console.error("Import error:", error), json3({
      error: error instanceof Error ? error.message : "Import failed"
    }, { status: 500 });
  }
}
function DataImport() {
  let { recentImports, dataSources } = useLoaderData2(), actionData = useActionData(), navigation = useNavigation(), [showPreviewModal, setShowPreviewModal] = useState2(!1), [showResultModal, setShowResultModal] = useState2(!1), isUploading = navigation.state === "submitting" && navigation.formData?.get("intent") === "upload", isImporting = navigation.state === "submitting" && navigation.formData?.get("intent") === "confirm";
  actionData?.success && actionData?.preview && !showPreviewModal && setShowPreviewModal(!0), actionData?.success && actionData?.imported && !showResultModal && setShowResultModal(!0);
  let importColumns = [
    {
      key: "timestamp",
      header: "Date",
      render: (timestamp) => new Date(timestamp).toLocaleDateString()
    },
    {
      key: "dataSource",
      header: "Source",
      render: (_, importRecord) => /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx10(FileText, { className: "w-4 h-4 text-[var(--color-text-secondary)]" }),
        importRecord.dataSource?.name || "Unknown"
      ] })
    },
    {
      key: "status",
      header: "Status",
      render: (status) => {
        let statusConfig = {
          completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
          processing: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
          failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" }
        }, config = statusConfig[status] || statusConfig.failed, Icon = config.icon;
        return /* @__PURE__ */ jsxs7("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`, children: [
          /* @__PURE__ */ jsx10(Icon, { className: "w-3 h-3" }),
          status
        ] });
      }
    },
    {
      key: "records",
      header: "Records",
      render: (_, importRecord) => /* @__PURE__ */ jsxs7("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxs7("div", { className: "text-[var(--color-text-primary)]", children: [
          importRecord.recordsSucceeded,
          " succeeded"
        ] }),
        importRecord.recordsFailed > 0 && /* @__PURE__ */ jsxs7("div", { className: "text-red-600", children: [
          importRecord.recordsFailed,
          " failed"
        ] })
      ] })
    }
  ];
  return /* @__PURE__ */ jsx10(AppShell, { children: /* @__PURE__ */ jsxs7("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx10("h1", { className: "text-display text-[var(--color-text-primary)]", children: "Data Import" }),
      /* @__PURE__ */ jsx10("p", { className: "text-body text-[var(--color-text-secondary)] mt-2", children: "Import customer data from CSV files with automatic cleaning and validation." })
    ] }),
    /* @__PURE__ */ jsxs7(Card, { variant: "elevated", children: [
      /* @__PURE__ */ jsx10(CardHeader, { children: /* @__PURE__ */ jsx10(CardTitle, { children: "Upload CSV File" }) }),
      /* @__PURE__ */ jsxs7(CardContent, { children: [
        /* @__PURE__ */ jsxs7(Form2, { method: "post", encType: "multipart/form-data", className: "space-y-6", children: [
          /* @__PURE__ */ jsx10("input", { type: "hidden", name: "intent", value: "upload" }),
          /* @__PURE__ */ jsxs7("div", { className: "border-2 border-dashed border-gray-300 rounded-[var(--radius-lg)] p-8 text-center", children: [
            /* @__PURE__ */ jsx10(Upload2, { className: "w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-4" }),
            /* @__PURE__ */ jsxs7("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx10(
                Input,
                {
                  name: "csvFile",
                  variant: "fileUpload",
                  accept: ".csv",
                  required: !0,
                  disabled: isUploading
                }
              ),
              /* @__PURE__ */ jsx10("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Upload a CSV file with customer data. Maximum file size: 10MB" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx10("label", { className: "block text-sm font-medium text-[var(--color-text-primary)] mb-2", children: "Expected CSV Format" }),
              /* @__PURE__ */ jsxs7("div", { className: "bg-gray-50 rounded-[var(--radius-sm)] p-4 text-sm font-mono", children: [
                "firstName,lastName,email,phone,source,totalSpend",
                /* @__PURE__ */ jsx10("br", {}),
                "John,Doe,john@example.com,+1-555-0123,Website,1250.00"
              ] })
            ] }),
            /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs7("div", { className: "text-sm text-[var(--color-text-secondary)]", children: [
                /* @__PURE__ */ jsx10("p", { children: "\u2022 Automatic data cleaning and validation" }),
                /* @__PURE__ */ jsx10("p", { children: "\u2022 Duplicate detection and handling" }),
                /* @__PURE__ */ jsx10("p", { children: "\u2022 Preview before final import" })
              ] }),
              /* @__PURE__ */ jsx10(
                Button,
                {
                  type: "submit",
                  disabled: isUploading,
                  className: "min-w-[120px]",
                  children: isUploading ? "Processing..." : "Upload & Preview"
                }
              )
            ] })
          ] })
        ] }),
        actionData?.error && /* @__PURE__ */ jsxs7("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-[var(--radius-sm)] flex items-start gap-3", children: [
          /* @__PURE__ */ jsx10(AlertCircle, { className: "w-5 h-5 text-red-600 mt-0.5" }),
          /* @__PURE__ */ jsxs7("div", { children: [
            /* @__PURE__ */ jsx10("h4", { className: "font-medium text-red-800", children: "Upload Error" }),
            /* @__PURE__ */ jsx10("p", { className: "text-sm text-red-700 mt-1", children: actionData.error })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7(Card, { children: [
      /* @__PURE__ */ jsx10(CardHeader, { children: /* @__PURE__ */ jsx10(CardTitle, { children: "Recent Imports" }) }),
      /* @__PURE__ */ jsxs7(CardContent, { children: [
        /* @__PURE__ */ jsx10(
          DataTable,
          {
            data: recentImports,
            columns: importColumns,
            variant: "hover"
          }
        ),
        recentImports.length === 0 && /* @__PURE__ */ jsx10("div", { className: "text-center py-8 text-[var(--color-text-secondary)]", children: "No imports yet. Upload your first CSV file to get started." })
      ] })
    ] }),
    /* @__PURE__ */ jsx10(
      Modal,
      {
        isOpen: showPreviewModal,
        onClose: () => setShowPreviewModal(!1),
        title: "Import Preview",
        className: "max-w-4xl",
        children: actionData?.preview && /* @__PURE__ */ jsxs7(Fragment, { children: [
          /* @__PURE__ */ jsx10(ModalContent, { children: /* @__PURE__ */ jsxs7("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs7("div", { className: "text-center p-4 bg-green-50 rounded-[var(--radius-sm)]", children: [
                /* @__PURE__ */ jsx10("div", { className: "text-2xl font-bold text-green-600", children: actionData.preview.cleaned.length }),
                /* @__PURE__ */ jsx10("div", { className: "text-sm text-green-700", children: "Ready to Import" })
              ] }),
              /* @__PURE__ */ jsxs7("div", { className: "text-center p-4 bg-yellow-50 rounded-[var(--radius-sm)]", children: [
                /* @__PURE__ */ jsx10("div", { className: "text-2xl font-bold text-yellow-600", children: actionData.preview.duplicates.length }),
                /* @__PURE__ */ jsx10("div", { className: "text-sm text-yellow-700", children: "Duplicates" })
              ] }),
              /* @__PURE__ */ jsxs7("div", { className: "text-center p-4 bg-red-50 rounded-[var(--radius-sm)]", children: [
                /* @__PURE__ */ jsx10("div", { className: "text-2xl font-bold text-red-600", children: actionData.preview.errors.length }),
                /* @__PURE__ */ jsx10("div", { className: "text-sm text-red-700", children: "Errors" })
              ] })
            ] }),
            actionData.preview.sample.length > 0 && /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx10("h4", { className: "font-medium text-[var(--color-text-primary)] mb-3", children: "Sample Records (First 5)" }),
              /* @__PURE__ */ jsx10("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs7("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsx10("thead", { children: /* @__PURE__ */ jsxs7("tr", { className: "border-b border-gray-200", children: [
                  /* @__PURE__ */ jsx10("th", { className: "text-left py-2 px-3", children: "Name" }),
                  /* @__PURE__ */ jsx10("th", { className: "text-left py-2 px-3", children: "Email" }),
                  /* @__PURE__ */ jsx10("th", { className: "text-left py-2 px-3", children: "Phone" }),
                  /* @__PURE__ */ jsx10("th", { className: "text-left py-2 px-3", children: "Source" }),
                  /* @__PURE__ */ jsx10("th", { className: "text-left py-2 px-3", children: "Spend" })
                ] }) }),
                /* @__PURE__ */ jsx10("tbody", { children: actionData.preview.sample.map((record, index) => /* @__PURE__ */ jsxs7("tr", { className: "border-b border-gray-100", children: [
                  /* @__PURE__ */ jsxs7("td", { className: "py-2 px-3", children: [
                    record.firstName,
                    " ",
                    record.lastName
                  ] }),
                  /* @__PURE__ */ jsx10("td", { className: "py-2 px-3", children: record.email }),
                  /* @__PURE__ */ jsx10("td", { className: "py-2 px-3", children: record.phone || "\u2014" }),
                  /* @__PURE__ */ jsx10("td", { className: "py-2 px-3", children: record.source || "\u2014" }),
                  /* @__PURE__ */ jsxs7("td", { className: "py-2 px-3", children: [
                    "$",
                    record.totalSpend || 0
                  ] })
                ] }, index)) })
              ] }) })
            ] }),
            actionData.preview.errors.length > 0 && /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsxs7("h4", { className: "font-medium text-red-600 mb-3", children: [
                "Errors (",
                actionData.preview.errors.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxs7("div", { className: "max-h-32 overflow-y-auto space-y-2", children: [
                actionData.preview.errors.slice(0, 5).map((error, index) => /* @__PURE__ */ jsxs7("div", { className: "text-sm p-2 bg-red-50 rounded", children: [
                  /* @__PURE__ */ jsxs7("span", { className: "font-medium", children: [
                    "Row ",
                    error.row,
                    ":"
                  ] }),
                  " ",
                  error.error
                ] }, index)),
                actionData.preview.errors.length > 5 && /* @__PURE__ */ jsxs7("div", { className: "text-sm text-[var(--color-text-secondary)]", children: [
                  "... and ",
                  actionData.preview.errors.length - 5,
                  " more errors"
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs7(ModalFooter, { children: [
            /* @__PURE__ */ jsx10(
              Button,
              {
                variant: "secondary",
                onClick: () => setShowPreviewModal(!1),
                children: "Cancel"
              }
            ),
            actionData.preview.cleaned.length > 0 && /* @__PURE__ */ jsxs7(Form2, { method: "post", children: [
              /* @__PURE__ */ jsx10("input", { type: "hidden", name: "intent", value: "confirm" }),
              /* @__PURE__ */ jsx10("input", { type: "hidden", name: "importId", value: actionData.importId }),
              /* @__PURE__ */ jsx10(
                "input",
                {
                  type: "hidden",
                  name: "cleanedData",
                  value: JSON.stringify(actionData.preview.cleaned)
                }
              ),
              /* @__PURE__ */ jsx10(Button, { type: "submit", disabled: isImporting, children: isImporting ? "Importing..." : `Import ${actionData.preview.cleaned.length} Records` })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx10(
      Modal,
      {
        isOpen: showResultModal,
        onClose: () => setShowResultModal(!1),
        title: "Import Complete",
        children: actionData?.imported && /* @__PURE__ */ jsxs7(Fragment, { children: [
          /* @__PURE__ */ jsx10(ModalContent, { children: /* @__PURE__ */ jsxs7("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx10(CheckCircle, { className: "w-16 h-16 text-green-600 mx-auto" }),
            /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx10("h3", { className: "text-lg font-medium text-[var(--color-text-primary)]", children: "Import Successful!" }),
              /* @__PURE__ */ jsxs7("p", { className: "text-[var(--color-text-secondary)] mt-2", children: [
                actionData.imported.succeeded,
                " customers imported successfully",
                actionData.imported.failed > 0 && `, ${actionData.imported.failed} failed`
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs7(ModalFooter, { children: [
            /* @__PURE__ */ jsx10(
              Button,
              {
                variant: "secondary",
                onClick: () => setShowResultModal(!1),
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsxs7(
              Button,
              {
                onClick: () => {
                  setShowResultModal(!1), window.location.href = "/customers";
                },
                children: [
                  /* @__PURE__ */ jsx10(Users2, { className: "w-4 h-4 mr-2" }),
                  "View Customers"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] }) });
}

// app/routes/tasks._index.tsx
var tasks_index_exports = {};
__export(tasks_index_exports, {
  action: () => action3,
  default: () => Tasks,
  loader: () => loader4,
  meta: () => meta4
});
import { json as json4, redirect as redirect2 } from "@remix-run/node";
import { useLoaderData as useLoaderData3, Form as Form3, useNavigate as useNavigate2 } from "@remix-run/react";
import { useState as useState3 } from "react";
import {
  Plus as Plus2,
  Search as Search2,
  CheckSquare as CheckSquare2,
  Clock,
  AlertCircle as AlertCircle2,
  User,
  Calendar,
  Settings as Settings2,
  Check,
  X as X2
} from "lucide-react";
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var meta4 = () => [
  { title: "Tasks - ScribeSync" },
  { name: "description", content: "Manage customer tasks and automation rules" }
];
async function loader4({ request }) {
  let url = new URL(request.url), status = url.searchParams.get("status") || "all", search = url.searchParams.get("search") || "", page = parseInt(url.searchParams.get("page") || "1"), limit = 20, offset = (page - 1) * limit, where = {};
  status !== "all" && (where.status = status), search && (where.OR = [
    { description: { contains: search, mode: "insensitive" } },
    { customer: {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    } }
  ]);
  let [tasks, totalCount, taskStats, taskRules] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [
        { status: "asc" },
        // Open tasks first
        { dueDate: "asc" },
        // Then by due date
        { createdAt: "desc" }
      ],
      skip: offset,
      take: limit,
      include: {
        customer: {
          select: {
            customerId: !0,
            firstName: !0,
            lastName: !0,
            email: !0
          }
        }
      }
    }),
    prisma.task.count({ where }),
    getTaskStats(),
    getTaskRules()
  ]), totalPages = Math.ceil(totalCount / limit);
  return json4({
    tasks,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    },
    filters: { status, search },
    taskStats,
    taskRules
  });
}
async function action3({ request }) {
  let formData = await request.formData(), intent = formData.get("intent");
  if (intent === "create") {
    let customerId = formData.get("customerId"), description = formData.get("description"), dueDate = formData.get("dueDate");
    if (!customerId || !description)
      return json4({ error: "Customer and description are required" }, { status: 400 });
    try {
      return await prisma.task.create({
        data: {
          customerId,
          description,
          dueDate: dueDate ? new Date(dueDate) : void 0,
          status: "open"
        }
      }), redirect2("/tasks");
    } catch {
      return json4({ error: "Failed to create task" }, { status: 500 });
    }
  }
  if (intent === "complete") {
    let taskId = formData.get("taskId");
    try {
      return await prisma.task.update({
        where: { taskId },
        data: {
          status: "completed",
          completedAt: /* @__PURE__ */ new Date()
        }
      }), redirect2("/tasks");
    } catch {
      return json4({ error: "Failed to complete task" }, { status: 500 });
    }
  }
  if (intent === "delete") {
    let taskId = formData.get("taskId");
    try {
      return await prisma.task.delete({
        where: { taskId }
      }), redirect2("/tasks");
    } catch {
      return json4({ error: "Failed to delete task" }, { status: 500 });
    }
  }
  if (intent === "toggle-rule") {
    let ruleId = formData.get("ruleId"), enabled = formData.get("enabled") === "true";
    return updateTaskRule(ruleId, enabled), redirect2("/tasks");
  }
  return json4({ error: "Invalid action" }, { status: 400 });
}
function Tasks() {
  let { tasks, pagination, filters, taskStats, taskRules } = useLoaderData3(), navigate = useNavigate2(), [showCreateModal, setShowCreateModal] = useState3(!1), [showRulesModal, setShowRulesModal] = useState3(!1), [customers, setCustomers] = useState3([]), loadCustomers = async () => {
    try {
      let data = await (await fetch("/api/customers")).json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    }
  }, taskColumns = [
    {
      key: "status",
      header: "Status",
      render: (status, task) => {
        let isOverdue = task.dueDate && new Date(task.dueDate) < /* @__PURE__ */ new Date() && status === "open";
        return status === "completed" ? /* @__PURE__ */ jsxs8("span", { className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", children: [
          /* @__PURE__ */ jsx11(CheckSquare2, { className: "w-3 h-3" }),
          "Completed"
        ] }) : /* @__PURE__ */ jsxs8("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${isOverdue ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`, children: [
          isOverdue ? /* @__PURE__ */ jsx11(AlertCircle2, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx11(Clock, { className: "w-3 h-3" }),
          isOverdue ? "Overdue" : "Open"
        ] });
      }
    },
    {
      key: "description",
      header: "Task",
      render: (description, task) => /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx11("div", { className: "font-medium text-[var(--color-text-primary)]", children: description }),
        /* @__PURE__ */ jsxs8("div", { className: "text-sm text-[var(--color-text-secondary)] flex items-center gap-1 mt-1", children: [
          /* @__PURE__ */ jsx11(User, { className: "w-3 h-3" }),
          task.customer.firstName,
          " ",
          task.customer.lastName
        ] })
      ] })
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (dueDate) => dueDate ? /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-1 text-[var(--color-text-secondary)]", children: [
        /* @__PURE__ */ jsx11(Calendar, { className: "w-3 h-3" }),
        new Date(dueDate).toLocaleDateString()
      ] }) : /* @__PURE__ */ jsx11("span", { className: "text-[var(--color-text-secondary)]", children: "\u2014" })
    },
    {
      key: "createdAt",
      header: "Created",
      render: (createdAt) => /* @__PURE__ */ jsx11("span", { className: "text-[var(--color-text-secondary)]", children: new Date(createdAt).toLocaleDateString() })
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, task) => /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
        task.status === "open" && /* @__PURE__ */ jsxs8(Form3, { method: "post", className: "inline", children: [
          /* @__PURE__ */ jsx11("input", { type: "hidden", name: "intent", value: "complete" }),
          /* @__PURE__ */ jsx11("input", { type: "hidden", name: "taskId", value: task.taskId }),
          /* @__PURE__ */ jsx11(Button, { size: "sm", variant: "secondary", type: "submit", children: /* @__PURE__ */ jsx11(Check, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxs8(Form3, { method: "post", className: "inline", children: [
          /* @__PURE__ */ jsx11("input", { type: "hidden", name: "intent", value: "delete" }),
          /* @__PURE__ */ jsx11("input", { type: "hidden", name: "taskId", value: task.taskId }),
          /* @__PURE__ */ jsx11(Button, { size: "sm", variant: "destructive", type: "submit", children: /* @__PURE__ */ jsx11(X2, { className: "w-4 h-4" }) })
        ] })
      ] })
    }
  ];
  return /* @__PURE__ */ jsx11(AppShell, { children: /* @__PURE__ */ jsxs8("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs8("div", { children: [
      /* @__PURE__ */ jsx11("h1", { className: "text-display text-[var(--color-text-primary)]", children: "Tasks" }),
      /* @__PURE__ */ jsx11("p", { className: "text-body text-[var(--color-text-secondary)] mt-2", children: "Manage customer tasks and configure automation rules." })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx11(Card, { children: /* @__PURE__ */ jsx11(CardContent, { children: /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx11("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Total Tasks" }),
          /* @__PURE__ */ jsx11("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: taskStats.total })
        ] }),
        /* @__PURE__ */ jsx11(CheckSquare2, { className: "w-8 h-8 text-[var(--color-primary)]" })
      ] }) }) }),
      /* @__PURE__ */ jsx11(Card, { children: /* @__PURE__ */ jsx11(CardContent, { children: /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx11("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Open Tasks" }),
          /* @__PURE__ */ jsx11("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: taskStats.open })
        ] }),
        /* @__PURE__ */ jsx11(Clock, { className: "w-8 h-8 text-yellow-600" })
      ] }) }) }),
      /* @__PURE__ */ jsx11(Card, { children: /* @__PURE__ */ jsx11(CardContent, { children: /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx11("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Completed" }),
          /* @__PURE__ */ jsx11("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: taskStats.completed })
        ] }),
        /* @__PURE__ */ jsx11(CheckSquare2, { className: "w-8 h-8 text-green-600" })
      ] }) }) }),
      /* @__PURE__ */ jsx11(Card, { children: /* @__PURE__ */ jsx11(CardContent, { children: /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx11("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Overdue" }),
          /* @__PURE__ */ jsx11("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: taskStats.overdue }),
          taskStats.overdue > 0 && /* @__PURE__ */ jsx11("p", { className: "text-xs text-red-600 mt-1", children: "Needs attention" })
        ] }),
        /* @__PURE__ */ jsx11(AlertCircle2, { className: "w-8 h-8 text-red-600" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs8(Card, { children: [
      /* @__PURE__ */ jsxs8(DataTableHeader, { children: [
        /* @__PURE__ */ jsxs8(DataTableTitle, { children: [
          "All Tasks (",
          pagination.totalCount,
          ")"
        ] }),
        /* @__PURE__ */ jsxs8(DataTableActions, { children: [
          /* @__PURE__ */ jsxs8(Form3, { method: "get", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs8(
              "select",
              {
                name: "status",
                defaultValue: filters.status,
                className: "input-text w-32",
                children: [
                  /* @__PURE__ */ jsx11("option", { value: "all", children: "All Status" }),
                  /* @__PURE__ */ jsx11("option", { value: "open", children: "Open" }),
                  /* @__PURE__ */ jsx11("option", { value: "completed", children: "Completed" })
                ]
              }
            ),
            /* @__PURE__ */ jsx11(
              Input,
              {
                name: "search",
                placeholder: "Search tasks...",
                defaultValue: filters.search,
                className: "w-64"
              }
            ),
            /* @__PURE__ */ jsx11(Button, { type: "submit", variant: "secondary", children: /* @__PURE__ */ jsx11(Search2, { className: "w-4 h-4" }) })
          ] }),
          /* @__PURE__ */ jsxs8(Button, { onClick: () => setShowRulesModal(!0), variant: "secondary", children: [
            /* @__PURE__ */ jsx11(Settings2, { className: "w-4 h-4 mr-2" }),
            "Automation Rules"
          ] }),
          /* @__PURE__ */ jsxs8(Button, { onClick: () => {
            loadCustomers(), setShowCreateModal(!0);
          }, children: [
            /* @__PURE__ */ jsx11(Plus2, { className: "w-4 h-4 mr-2" }),
            "Add Task"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx11(
        DataTable,
        {
          data: tasks,
          columns: taskColumns,
          variant: "hover"
        }
      ),
      pagination.totalPages > 1 && /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between px-6 py-4 border-t border-gray-200", children: [
        /* @__PURE__ */ jsxs8("div", { className: "text-sm text-[var(--color-text-secondary)]", children: [
          "Showing ",
          (pagination.currentPage - 1) * 20 + 1,
          " to ",
          Math.min(pagination.currentPage * 20, pagination.totalCount),
          " of ",
          pagination.totalCount,
          " tasks"
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          pagination.hasPreviousPage && /* @__PURE__ */ jsx11(
            Button,
            {
              variant: "secondary",
              onClick: () => navigate(`/tasks?page=${pagination.currentPage - 1}${filters.status !== "all" ? `&status=${filters.status}` : ""}${filters.search ? `&search=${filters.search}` : ""}`),
              children: "Previous"
            }
          ),
          pagination.hasNextPage && /* @__PURE__ */ jsx11(
            Button,
            {
              variant: "secondary",
              onClick: () => navigate(`/tasks?page=${pagination.currentPage + 1}${filters.status !== "all" ? `&status=${filters.status}` : ""}${filters.search ? `&search=${filters.search}` : ""}`),
              children: "Next"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx11(
      Modal,
      {
        isOpen: showCreateModal,
        onClose: () => setShowCreateModal(!1),
        title: "Create New Task",
        children: /* @__PURE__ */ jsxs8(Form3, { method: "post", className: "space-y-4", children: [
          /* @__PURE__ */ jsx11("input", { type: "hidden", name: "intent", value: "create" }),
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx11("label", { className: "block text-sm font-medium text-[var(--color-text-primary)] mb-2", children: "Customer" }),
            /* @__PURE__ */ jsxs8("select", { name: "customerId", required: !0, className: "input-text", children: [
              /* @__PURE__ */ jsx11("option", { value: "", children: "Select a customer..." }),
              customers.map((customer) => /* @__PURE__ */ jsxs8("option", { value: customer.customerId, children: [
                customer.firstName,
                " ",
                customer.lastName,
                " (",
                customer.email,
                ")"
              ] }, customer.customerId))
            ] })
          ] }),
          /* @__PURE__ */ jsx11(
            Textarea,
            {
              name: "description",
              label: "Task Description",
              placeholder: "Describe what needs to be done...",
              required: !0
            }
          ),
          /* @__PURE__ */ jsx11(
            Input,
            {
              name: "dueDate",
              label: "Due Date (Optional)",
              type: "date"
            }
          ),
          /* @__PURE__ */ jsxs8(ModalFooter, { children: [
            /* @__PURE__ */ jsx11(
              Button,
              {
                type: "button",
                variant: "secondary",
                onClick: () => setShowCreateModal(!1),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx11(Button, { type: "submit", children: "Create Task" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs8(
      Modal,
      {
        isOpen: showRulesModal,
        onClose: () => setShowRulesModal(!1),
        title: "Task Automation Rules",
        className: "max-w-2xl",
        children: [
          /* @__PURE__ */ jsx11(ModalContent, { children: /* @__PURE__ */ jsxs8("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx11("p", { className: "text-[var(--color-text-secondary)]", children: "Configure automatic task creation rules based on customer events." }),
            taskRules.map((rule) => /* @__PURE__ */ jsxs8("div", { className: "flex items-start justify-between p-4 border border-gray-200 rounded-[var(--radius-sm)]", children: [
              /* @__PURE__ */ jsxs8("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx11("h4", { className: "font-medium text-[var(--color-text-primary)]", children: rule.name }),
                /* @__PURE__ */ jsx11("p", { className: "text-sm text-[var(--color-text-secondary)] mt-1", children: rule.description }),
                /* @__PURE__ */ jsxs8("div", { className: "text-xs text-[var(--color-text-secondary)] mt-2", children: [
                  "Trigger: ",
                  rule.trigger.type,
                  rule.trigger.schedule && ` (${rule.trigger.schedule})`
                ] })
              ] }),
              /* @__PURE__ */ jsxs8(Form3, { method: "post", className: "ml-4", children: [
                /* @__PURE__ */ jsx11("input", { type: "hidden", name: "intent", value: "toggle-rule" }),
                /* @__PURE__ */ jsx11("input", { type: "hidden", name: "ruleId", value: rule.id }),
                /* @__PURE__ */ jsx11("input", { type: "hidden", name: "enabled", value: (!rule.enabled).toString() }),
                /* @__PURE__ */ jsx11(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    variant: rule.enabled ? "primary" : "secondary",
                    children: rule.enabled ? "Enabled" : "Disabled"
                  }
                )
              ] })
            ] }, rule.id))
          ] }) }),
          /* @__PURE__ */ jsx11(ModalFooter, { children: /* @__PURE__ */ jsx11(Button, { onClick: () => setShowRulesModal(!1), children: "Close" }) })
        ]
      }
    )
  ] }) });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Dashboard,
  loader: () => loader5,
  meta: () => meta5
});
import { json as json5 } from "@remix-run/node";
import { useLoaderData as useLoaderData4 } from "@remix-run/react";
import {
  Users as Users3,
  CheckSquare as CheckSquare3,
  Upload as Upload3,
  TrendingUp,
  AlertCircle as AlertCircle3,
  Calendar as Calendar2
} from "lucide-react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
var meta5 = () => [
  { title: "Dashboard - ScribeSync" },
  { name: "description", content: "Overview of your customer data pipeline" }
];
async function loader5({ request }) {
  let [
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
      orderBy: { createdAt: "desc" },
      select: {
        customerId: !0,
        firstName: !0,
        lastName: !0,
        email: !0,
        source: !0,
        totalSpend: !0,
        createdAt: !0
      }
    }),
    getTaskStats(),
    prisma.customerImport.findMany({
      take: 5,
      orderBy: { importTimestamp: "desc" },
      include: {
        dataSource: {
          select: { name: !0, type: !0 }
        }
      }
    }),
    prisma.customer.groupBy({
      by: ["source"],
      _count: { source: !0 },
      orderBy: { _count: { source: "desc" } }
    }),
    prisma.interaction.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        customer: {
          select: {
            firstName: !0,
            lastName: !0,
            email: !0
          }
        }
      }
    })
  ]), totalRevenue = await prisma.customer.aggregate({
    _sum: { totalSpend: !0 }
  });
  return json5({
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
function Dashboard() {
  let { stats, recentCustomers, recentImports, customersBySource, recentInteractions } = useLoaderData4(), pieColors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
  return /* @__PURE__ */ jsx12(AppShell, { children: /* @__PURE__ */ jsxs9("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsx12("h1", { className: "text-display text-[var(--color-text-primary)]", children: "Dashboard" }),
      /* @__PURE__ */ jsx12("p", { className: "text-body text-[var(--color-text-secondary)] mt-2", children: "Welcome to ScribeSync. Here's an overview of your customer data pipeline." })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx12(Card, { children: /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Total Customers" }),
          /* @__PURE__ */ jsx12("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: stats.totalCustomers.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsx12(Users3, { className: "w-8 h-8 text-[var(--color-primary)]" })
      ] }) }) }),
      /* @__PURE__ */ jsx12(Card, { children: /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Total Revenue" }),
          /* @__PURE__ */ jsxs9("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: [
            "$",
            stats.totalRevenue.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsx12(TrendingUp, { className: "w-8 h-8 text-[var(--color-accent)]" })
      ] }) }) }),
      /* @__PURE__ */ jsx12(Card, { children: /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Open Tasks" }),
          /* @__PURE__ */ jsx12("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: stats.open }),
          stats.overdue > 0 && /* @__PURE__ */ jsxs9("p", { className: "text-xs text-red-600 flex items-center gap-1 mt-1", children: [
            /* @__PURE__ */ jsx12(AlertCircle3, { className: "w-3 h-3" }),
            stats.overdue,
            " overdue"
          ] })
        ] }),
        /* @__PURE__ */ jsx12(CheckSquare3, { className: "w-8 h-8 text-[var(--color-primary)]" })
      ] }) }) }),
      /* @__PURE__ */ jsx12(Card, { children: /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx12("p", { className: "text-sm text-[var(--color-text-secondary)]", children: "Recent Imports" }),
          /* @__PURE__ */ jsx12("p", { className: "text-2xl font-bold text-[var(--color-text-primary)]", children: recentImports.length })
        ] }),
        /* @__PURE__ */ jsx12(Upload3, { className: "w-8 h-8 text-[var(--color-primary)]" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs9(Card, { children: [
        /* @__PURE__ */ jsx12(CardHeader, { children: /* @__PURE__ */ jsx12(CardTitle, { children: "Customers by Source" }) }),
        /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsx12("div", { className: "h-64", children: /* @__PURE__ */ jsx12(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs9(PieChart, { children: [
          /* @__PURE__ */ jsx12(
            Pie,
            {
              data: customersBySource.map((item) => ({
                name: item.source || "Unknown",
                value: item._count.source
              })),
              cx: "50%",
              cy: "50%",
              outerRadius: 80,
              dataKey: "value",
              children: customersBySource.map((entry2, index) => /* @__PURE__ */ jsx12(Cell, { fill: pieColors[index % pieColors.length] }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsx12(Tooltip, {})
        ] }) }) }) })
      ] }),
      /* @__PURE__ */ jsxs9(Card, { children: [
        /* @__PURE__ */ jsx12(CardHeader, { children: /* @__PURE__ */ jsx12(CardTitle, { children: "Recent Activity" }) }),
        /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsxs9("div", { className: "space-y-4 max-h-64 overflow-y-auto", children: [
          recentInteractions.map((interaction) => /* @__PURE__ */ jsxs9("div", { className: "flex items-start gap-3 p-3 bg-gray-50 rounded-[var(--radius-sm)]", children: [
            /* @__PURE__ */ jsx12(Calendar2, { className: "w-4 h-4 text-[var(--color-text-secondary)] mt-0.5" }),
            /* @__PURE__ */ jsxs9("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs9("p", { className: "text-sm font-medium text-[var(--color-text-primary)]", children: [
                interaction.customer.firstName,
                " ",
                interaction.customer.lastName
              ] }),
              /* @__PURE__ */ jsxs9("p", { className: "text-xs text-[var(--color-text-secondary)]", children: [
                interaction.type,
                " \u2022 ",
                new Date(interaction.timestamp).toLocaleDateString()
              ] }),
              interaction.notes && /* @__PURE__ */ jsx12("p", { className: "text-xs text-[var(--color-text-secondary)] mt-1 truncate", children: interaction.notes })
            ] })
          ] }, interaction.interactionId)),
          recentInteractions.length === 0 && /* @__PURE__ */ jsx12("p", { className: "text-center text-[var(--color-text-secondary)] py-8", children: "No recent interactions" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs9(Card, { children: [
      /* @__PURE__ */ jsx12(CardHeader, { children: /* @__PURE__ */ jsx12(CardTitle, { children: "Recent Customers" }) }),
      /* @__PURE__ */ jsx12(CardContent, { children: /* @__PURE__ */ jsxs9("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxs9("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx12("thead", { children: /* @__PURE__ */ jsxs9("tr", { className: "border-b border-gray-200", children: [
            /* @__PURE__ */ jsx12("th", { className: "text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]", children: "Name" }),
            /* @__PURE__ */ jsx12("th", { className: "text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]", children: "Email" }),
            /* @__PURE__ */ jsx12("th", { className: "text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]", children: "Source" }),
            /* @__PURE__ */ jsx12("th", { className: "text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]", children: "Total Spend" }),
            /* @__PURE__ */ jsx12("th", { className: "text-left py-3 px-4 font-medium text-[var(--color-text-secondary)]", children: "Added" })
          ] }) }),
          /* @__PURE__ */ jsx12("tbody", { children: recentCustomers.map((customer) => /* @__PURE__ */ jsxs9("tr", { className: "border-b border-gray-100", children: [
            /* @__PURE__ */ jsx12("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs9("div", { className: "font-medium text-[var(--color-text-primary)]", children: [
              customer.firstName,
              " ",
              customer.lastName
            ] }) }),
            /* @__PURE__ */ jsx12("td", { className: "py-3 px-4 text-[var(--color-text-secondary)]", children: customer.email }),
            /* @__PURE__ */ jsx12("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsx12("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: customer.source || "Unknown" }) }),
            /* @__PURE__ */ jsxs9("td", { className: "py-3 px-4 text-[var(--color-text-primary)]", children: [
              "$",
              customer.totalSpend.toLocaleString()
            ] }),
            /* @__PURE__ */ jsx12("td", { className: "py-3 px-4 text-[var(--color-text-secondary)]", children: new Date(customer.createdAt).toLocaleDateString() })
          ] }, customer.customerId)) })
        ] }),
        recentCustomers.length === 0 && /* @__PURE__ */ jsx12("div", { className: "text-center py-8 text-[var(--color-text-secondary)]", children: "No customers yet" })
      ] }) })
    ] })
  ] }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-S5SZC2OU.js", imports: ["/build/_shared/chunk-J3JQBE77.js", "/build/_shared/chunk-T36URGAI.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-ZKRMBLI5.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-OT5WFJEE.js", imports: ["/build/_shared/chunk-REULVTIU.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.customers": { id: "routes/api.customers", parentId: "root", path: "api/customers", index: void 0, caseSensitive: void 0, module: "/build/routes/api.customers-EG2OBAYR.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/customers._index": { id: "routes/customers._index", parentId: "root", path: "customers", index: !0, caseSensitive: void 0, module: "/build/routes/customers._index-I22G7BFV.js", imports: ["/build/_shared/chunk-MPRCW2QD.js", "/build/_shared/chunk-REULVTIU.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/import._index": { id: "routes/import._index", parentId: "root", path: "import", index: !0, caseSensitive: void 0, module: "/build/routes/import._index-UUFO2ETO.js", imports: ["/build/_shared/chunk-MPRCW2QD.js", "/build/_shared/chunk-REULVTIU.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/tasks._index": { id: "routes/tasks._index", parentId: "root", path: "tasks", index: !0, caseSensitive: void 0, module: "/build/routes/tasks._index-BMIQPUTR.js", imports: ["/build/_shared/chunk-MPRCW2QD.js", "/build/_shared/chunk-REULVTIU.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "56e54bfb", hmr: void 0, url: "/build/manifest-56E54BFB.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/customers._index": {
    id: "routes/customers._index",
    parentId: "root",
    path: "customers",
    index: !0,
    caseSensitive: void 0,
    module: customers_index_exports
  },
  "routes/api.customers": {
    id: "routes/api.customers",
    parentId: "root",
    path: "api/customers",
    index: void 0,
    caseSensitive: void 0,
    module: api_customers_exports
  },
  "routes/import._index": {
    id: "routes/import._index",
    parentId: "root",
    path: "import",
    index: !0,
    caseSensitive: void 0,
    module: import_index_exports
  },
  "routes/tasks._index": {
    id: "routes/tasks._index",
    parentId: "root",
    path: "tasks",
    index: !0,
    caseSensitive: void 0,
    module: tasks_index_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};

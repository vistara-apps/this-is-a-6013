import { prisma } from "~/lib/db.server";
import * as cron from "node-cron";

export interface TaskRule {
  id: string;
  name: string;
  description: string;
  trigger: TaskTrigger;
  action: TaskAction;
  enabled: boolean;
}

export interface TaskTrigger {
  type: 'customer_created' | 'interaction_added' | 'inactivity_detected' | 'scheduled';
  conditions?: Record<string, any>;
  schedule?: string; // cron expression for scheduled tasks
}

export interface TaskAction {
  type: 'create_task' | 'send_email' | 'update_customer';
  template: string;
  dueInDays?: number;
  assignTo?: string;
}

// Default task rules based on PRD requirements
const DEFAULT_TASK_RULES: TaskRule[] = [
  {
    id: 'new-lead-followup',
    name: 'New Lead Follow-up',
    description: 'Create follow-up task for new leads from website',
    trigger: {
      type: 'customer_created',
      conditions: { source: 'Website' }
    },
    action: {
      type: 'create_task',
      template: 'Follow up with new lead from website - {customerName}',
      dueInDays: 1
    },
    enabled: true
  },
  {
    id: 'referral-welcome',
    name: 'Referral Welcome',
    description: 'Create welcome task for referral customers',
    trigger: {
      type: 'customer_created',
      conditions: { source: 'Referral' }
    },
    action: {
      type: 'create_task',
      template: 'Send welcome package to referral customer - {customerName}',
      dueInDays: 0
    },
    enabled: true
  },
  {
    id: 'purchase-followup',
    name: 'Purchase Follow-up',
    description: 'Create follow-up task after purchase interaction',
    trigger: {
      type: 'interaction_added',
      conditions: { type: 'purchase' }
    },
    action: {
      type: 'create_task',
      template: 'Follow up on recent purchase with {customerName}',
      dueInDays: 7
    },
    enabled: true
  },
  {
    id: 'inactivity-check',
    name: 'Customer Inactivity Check',
    description: 'Create task for customers with no recent interactions',
    trigger: {
      type: 'scheduled',
      schedule: '0 9 * * 1' // Every Monday at 9 AM
    },
    action: {
      type: 'create_task',
      template: 'Check in with inactive customer - {customerName}',
      dueInDays: 3
    },
    enabled: true
  }
];

/**
 * Initialize task automation system
 */
export function initializeTaskAutomation() {
  console.log('🤖 Initializing task automation system...');
  
  // Set up scheduled task checks
  DEFAULT_TASK_RULES
    .filter(rule => rule.trigger.type === 'scheduled' && rule.enabled)
    .forEach(rule => {
      if (rule.trigger.schedule) {
        cron.schedule(rule.trigger.schedule, () => {
          handleScheduledTask(rule);
        });
        console.log(`📅 Scheduled task rule: ${rule.name} (${rule.trigger.schedule})`);
      }
    });
}

/**
 * Process task rules when a customer is created
 */
export async function processCustomerCreatedTasks(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { customerId }
  });

  if (!customer) return;

  const applicableRules = DEFAULT_TASK_RULES.filter(rule => 
    rule.enabled && 
    rule.trigger.type === 'customer_created' &&
    matchesConditions(customer, rule.trigger.conditions)
  );

  for (const rule of applicableRules) {
    await createTaskFromRule(rule, customer);
  }
}

/**
 * Process task rules when an interaction is added
 */
export async function processInteractionAddedTasks(interactionId: string) {
  const interaction = await prisma.interaction.findUnique({
    where: { interactionId },
    include: { customer: true }
  });

  if (!interaction) return;

  const applicableRules = DEFAULT_TASK_RULES.filter(rule => 
    rule.enabled && 
    rule.trigger.type === 'interaction_added' &&
    matchesConditions(interaction, rule.trigger.conditions)
  );

  for (const rule of applicableRules) {
    await createTaskFromRule(rule, interaction.customer, interaction);
  }
}

/**
 * Handle scheduled task execution
 */
async function handleScheduledTask(rule: TaskRule) {
  try {
    if (rule.id === 'inactivity-check') {
      await processInactiveCustomers(rule);
    }
    // Add other scheduled task handlers here
  } catch (error) {
    console.error(`Error processing scheduled task ${rule.name}:`, error);
  }
}

/**
 * Process inactive customers and create tasks
 */
async function processInactiveCustomers(rule: TaskRule) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Find customers with no recent interactions
  const inactiveCustomers = await prisma.customer.findMany({
    where: {
      OR: [
        { lastInteractionDate: { lt: thirtyDaysAgo } },
        { lastInteractionDate: null }
      ],
      // Don't create duplicate tasks for the same customer
      tasks: {
        none: {
          description: { contains: 'Check in with inactive customer' },
          status: 'open',
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // No task in last 7 days
        }
      }
    },
    take: 10 // Limit to prevent overwhelming
  });

  for (const customer of inactiveCustomers) {
    await createTaskFromRule(rule, customer);
  }

  console.log(`📋 Created inactivity check tasks for ${inactiveCustomers.length} customers`);
}

/**
 * Create a task based on a rule and customer data
 */
async function createTaskFromRule(
  rule: TaskRule, 
  customer: any, 
  interaction?: any
) {
  try {
    const dueDate = rule.action.dueInDays !== undefined 
      ? new Date(Date.now() + rule.action.dueInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const description = rule.action.template
      .replace('{customerName}', `${customer.firstName} ${customer.lastName}`)
      .replace('{customerEmail}', customer.email)
      .replace('{customerSource}', customer.source || 'Unknown');

    await prisma.task.create({
      data: {
        customerId: customer.customerId,
        description,
        dueDate,
        status: 'open',
        assignedTo: rule.action.assignTo
      }
    });

    console.log(`✅ Created task: ${description}`);
  } catch (error) {
    console.error(`Error creating task from rule ${rule.name}:`, error);
  }
}

/**
 * Check if an object matches the given conditions
 */
function matchesConditions(obj: any, conditions?: Record<string, any>): boolean {
  if (!conditions) return true;

  return Object.entries(conditions).every(([key, value]) => {
    return obj[key] === value;
  });
}

/**
 * Get all active task rules
 */
export function getTaskRules(): TaskRule[] {
  return DEFAULT_TASK_RULES;
}

/**
 * Update task rule status
 */
export function updateTaskRule(ruleId: string, enabled: boolean): boolean {
  const rule = DEFAULT_TASK_RULES.find(r => r.id === ruleId);
  if (rule) {
    rule.enabled = enabled;
    return true;
  }
  return false;
}

/**
 * Get task statistics
 */
export async function getTaskStats() {
  const [totalTasks, openTasks, completedTasks, overdueTasks] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: 'open' } }),
    prisma.task.count({ where: { status: 'completed' } }),
    prisma.task.count({ 
      where: { 
        status: 'open',
        dueDate: { lt: new Date() }
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

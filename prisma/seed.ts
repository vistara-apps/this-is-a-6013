import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding database...");

  // Create sample data sources
  const csvDataSource = await prisma.dataSource.create({
    data: {
      name: "CSV Upload",
      type: "csv",
      config: {
        allowedExtensions: [".csv"],
        maxFileSize: "10MB"
      }
    }
  });

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1-555-0123",
        source: "Website",
        totalSpend: 1250.00,
        customFields: {
          company: "Acme Corp",
          industry: "Technology"
        }
      }
    }),
    prisma.customer.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+1-555-0456",
        source: "Referral",
        totalSpend: 850.00,
        customFields: {
          company: "Beta Inc",
          industry: "Healthcare"
        }
      }
    }),
    prisma.customer.create({
      data: {
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob.johnson@example.com",
        phone: "+1-555-0789",
        source: "Social Media",
        totalSpend: 2100.00,
        customFields: {
          company: "Gamma LLC",
          industry: "Finance"
        }
      }
    })
  ]);

  // Create sample interactions
  await Promise.all([
    prisma.interaction.create({
      data: {
        customerId: customers[0].customerId,
        type: "email",
        notes: "Initial contact - interested in premium features",
        channel: "email",
        dataPayload: {
          subject: "Welcome to ScribeSync",
          campaign: "onboarding"
        }
      }
    }),
    prisma.interaction.create({
      data: {
        customerId: customers[0].customerId,
        type: "call",
        notes: "Follow-up call - discussed pricing options",
        channel: "phone",
        dataPayload: {
          duration: "15 minutes",
          outcome: "interested"
        }
      }
    }),
    prisma.interaction.create({
      data: {
        customerId: customers[1].customerId,
        type: "purchase",
        notes: "Purchased Pro plan",
        channel: "website",
        dataPayload: {
          amount: 850.00,
          plan: "pro"
        }
      }
    })
  ]);

  // Create sample tasks
  await Promise.all([
    prisma.task.create({
      data: {
        customerId: customers[0].customerId,
        description: "Follow up on pricing discussion",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "open"
      }
    }),
    prisma.task.create({
      data: {
        customerId: customers[1].customerId,
        description: "Send onboarding materials",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: "open"
      }
    }),
    prisma.task.create({
      data: {
        customerId: customers[2].customerId,
        description: "Schedule demo call",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: "open"
      }
    })
  ]);

  // Create sample import record
  await prisma.customerImport.create({
    data: {
      sourceId: csvDataSource.sourceId,
      status: "completed",
      recordsProcessed: 3,
      recordsSucceeded: 3,
      recordsFailed: 0
    }
  });

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

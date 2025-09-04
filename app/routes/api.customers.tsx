import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/lib/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        customerId: true,
        firstName: true,
        lastName: true,
        email: true
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    });

    return json(customers);
  } catch (error) {
    return json({ error: "Failed to load customers" }, { status: 500 });
  }
}

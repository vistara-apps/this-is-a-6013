import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import { useActionData, useLoaderData, Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { AppShell } from "~/components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { DataTable } from "~/components/ui/DataTable";
import { Modal, ModalContent, ModalFooter } from "~/components/ui/Modal";
import { prisma } from "~/lib/db.server";
import { parseCSV, cleanCustomerData, type CustomerRecord } from "~/utils/data-cleaning.server";
import { processCustomerCreatedTasks } from "~/utils/task-automation.server";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Users,
  AlertCircle
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Data Import - ScribeSync" },
    { name: "description", content: "Import and clean customer data from CSV files" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Get recent imports
  const recentImports = await prisma.customerImport.findMany({
    take: 10,
    orderBy: { importTimestamp: 'desc' },
    include: {
      dataSource: {
        select: { name: true, type: true }
      }
    }
  });

  // Get data sources
  const dataSources = await prisma.dataSource.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return json({
    recentImports,
    dataSources
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 10_000_000, // 10MB
  });

  try {
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const intent = formData.get("intent");

    if (intent === "upload") {
      const file = formData.get("csvFile") as File;
      const sourceId = formData.get("sourceId") as string;

      if (!file || file.size === 0) {
        return json({ error: "Please select a CSV file" }, { status: 400 });
      }

      if (!file.name.endsWith('.csv')) {
        return json({ error: "Please upload a CSV file" }, { status: 400 });
      }

      // Read file content
      const content = await file.text();
      
      // Parse CSV
      let rawData;
      try {
        rawData = parseCSV(content);
      } catch (error) {
        return json({ 
          error: `CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 400 });
      }

      if (rawData.length === 0) {
        return json({ error: "CSV file is empty" }, { status: 400 });
      }

      // Clean and validate data
      const cleaningResult = cleanCustomerData(rawData);

      // Create import record
      const customerImport = await prisma.customerImport.create({
        data: {
          sourceId: sourceId || 'default',
          status: 'processing',
          recordsProcessed: rawData.length,
          recordsSucceeded: 0,
          recordsFailed: cleaningResult.errors.length + cleaningResult.duplicates.length
        }
      });

      // Return preview data for user review
      return json({
        success: true,
        importId: customerImport.importId,
        preview: {
          total: rawData.length,
          cleaned: cleaningResult.cleaned,
          duplicates: cleaningResult.duplicates,
          errors: cleaningResult.errors,
          sample: cleaningResult.cleaned.slice(0, 5) // Show first 5 records
        }
      });
    }

    if (intent === "confirm") {
      const importId = formData.get("importId") as string;
      const cleanedDataJson = formData.get("cleanedData") as string;
      
      if (!cleanedDataJson) {
        return json({ error: "No data to import" }, { status: 400 });
      }

      const cleanedData: CustomerRecord[] = JSON.parse(cleanedDataJson);
      let successCount = 0;
      let failCount = 0;
      const createdCustomers: string[] = [];

      // Import customers
      for (const record of cleanedData) {
        try {
          const customer = await prisma.customer.create({
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
          
          createdCustomers.push(customer.customerId);
          successCount++;
        } catch (error) {
          failCount++;
          console.error('Failed to create customer:', error);
        }
      }

      // Update import record
      await prisma.customerImport.update({
        where: { importId },
        data: {
          status: failCount > 0 ? 'completed' : 'completed',
          recordsSucceeded: successCount,
          recordsFailed: failCount
        }
      });

      // Trigger task automation for new customers
      for (const customerId of createdCustomers) {
        try {
          await processCustomerCreatedTasks(customerId);
        } catch (error) {
          console.error('Failed to process tasks for customer:', customerId, error);
        }
      }

      return json({
        success: true,
        imported: {
          total: cleanedData.length,
          succeeded: successCount,
          failed: failCount
        }
      });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error('Import error:', error);
    return json({ 
      error: error instanceof Error ? error.message : "Import failed" 
    }, { status: 500 });
  }
}

export default function DataImport() {
  const { recentImports, dataSources } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const isUploading = navigation.state === "submitting" && navigation.formData?.get("intent") === "upload";
  const isImporting = navigation.state === "submitting" && navigation.formData?.get("intent") === "confirm";

  // Show preview modal when upload is successful
  if (actionData && 'success' in actionData && actionData.success && 'preview' in actionData && actionData.preview && !showPreviewModal) {
    setShowPreviewModal(true);
  }

  // Show result modal when import is complete
  if (actionData && 'success' in actionData && actionData.success && 'imported' in actionData && actionData.imported && !showResultModal) {
    setShowResultModal(true);
  }

  const importColumns = [
    {
      key: "timestamp" as const,
      header: "Date",
      render: (timestamp: string) => new Date(timestamp).toLocaleDateString(),
    },
    {
      key: "dataSource" as const,
      header: "Source",
      render: (_: any, importRecord: any) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--color-text-secondary)]" />
          {importRecord.dataSource?.name || 'Unknown'}
        </div>
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (status: string) => {
        const statusConfig = {
          completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
          processing: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
          failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.failed;
        const Icon = config.icon;
        
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
            <Icon className="w-3 h-3" />
            {status}
          </span>
        );
      },
    },
    {
      key: "records" as const,
      header: "Records",
      render: (_: any, importRecord: any) => (
        <div className="text-sm">
          <div className="text-[var(--color-text-primary)]">
            {importRecord.recordsSucceeded} succeeded
          </div>
          {importRecord.recordsFailed > 0 && (
            <div className="text-red-600">
              {importRecord.recordsFailed} failed
            </div>
          )}
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
            Data Import
          </h1>
          <p className="text-body text-[var(--color-text-secondary)] mt-2">
            Import customer data from CSV files with automatic cleaning and validation.
          </p>
        </div>

        {/* Upload Section */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post" encType="multipart/form-data" className="space-y-6">
              <input type="hidden" name="intent" value="upload" />
              
              <div className="border-2 border-dashed border-gray-300 rounded-[var(--radius-lg)] p-8 text-center">
                <Upload className="w-12 h-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
                <div className="space-y-2">
                  <Input
                    name="csvFile"
                    variant="fileUpload"
                    accept=".csv"
                    required
                    disabled={isUploading}
                  />
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Upload a CSV file with customer data. Maximum file size: 10MB
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Expected CSV Format
                  </label>
                  <div className="bg-gray-50 rounded-[var(--radius-sm)] p-4 text-sm font-mono">
                    firstName,lastName,email,phone,source,totalSpend<br/>
                    John,Doe,john@example.com,+1-555-0123,Website,1250.00
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    <p>• Automatic data cleaning and validation</p>
                    <p>• Duplicate detection and handling</p>
                    <p>• Preview before final import</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isUploading}
                    className="min-w-[120px]"
                  >
                    {isUploading ? "Processing..." : "Upload & Preview"}
                  </Button>
                </div>
              </div>
            </Form>

            {actionData && 'error' in actionData && actionData.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-[var(--radius-sm)] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Upload Error</h4>
                  <p className="text-sm text-red-700 mt-1">{actionData.error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Imports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentImports}
              columns={importColumns}
              variant="hover"
            />
            {recentImports.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                No imports yet. Upload your first CSV file to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title="Import Preview"
          className="max-w-4xl"
        >
          {actionData && 'success' in actionData && actionData.success && 'preview' in actionData && actionData.preview && (
            <>
              <ModalContent>
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-[var(--radius-sm)]">
                      <div className="text-2xl font-bold text-green-600">
                        {actionData.preview.cleaned.length}
                      </div>
                      <div className="text-sm text-green-700">Ready to Import</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-[var(--radius-sm)]">
                      <div className="text-2xl font-bold text-yellow-600">
                        {actionData.preview.duplicates.length}
                      </div>
                      <div className="text-sm text-yellow-700">Duplicates</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-[var(--radius-sm)]">
                      <div className="text-2xl font-bold text-red-600">
                        {actionData.preview.errors.length}
                      </div>
                      <div className="text-sm text-red-700">Errors</div>
                    </div>
                  </div>

                  {/* Sample Data Preview */}
                  {actionData.preview.sample.length > 0 && (
                    <div>
                      <h4 className="font-medium text-[var(--color-text-primary)] mb-3">
                        Sample Records (First 5)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3">Name</th>
                              <th className="text-left py-2 px-3">Email</th>
                              <th className="text-left py-2 px-3">Phone</th>
                              <th className="text-left py-2 px-3">Source</th>
                              <th className="text-left py-2 px-3">Spend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {actionData.preview.sample.map((record, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-2 px-3">{record.firstName} {record.lastName}</td>
                                <td className="py-2 px-3">{record.email}</td>
                                <td className="py-2 px-3">{record.phone || '—'}</td>
                                <td className="py-2 px-3">{record.source || '—'}</td>
                                <td className="py-2 px-3">${record.totalSpend || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {actionData.preview.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-3">
                        Errors ({actionData.preview.errors.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {actionData.preview.errors.slice(0, 5).map((error, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                            <span className="font-medium">Row {error.row}:</span> {error.error}
                          </div>
                        ))}
                        {actionData.preview.errors.length > 5 && (
                          <div className="text-sm text-[var(--color-text-secondary)]">
                            ... and {actionData.preview.errors.length - 5} more errors
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ModalContent>
              
              <ModalFooter>
                <Button
                  variant="secondary"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Cancel
                </Button>
                {actionData.preview.cleaned.length > 0 && (
                  <Form method="post">
                    <input type="hidden" name="intent" value="confirm" />
                    <input type="hidden" name="importId" value={actionData.importId} />
                    <input 
                      type="hidden" 
                      name="cleanedData" 
                      value={JSON.stringify(actionData.preview.cleaned)} 
                    />
                    <Button type="submit" disabled={isImporting}>
                      {isImporting ? "Importing..." : `Import ${actionData.preview.cleaned.length} Records`}
                    </Button>
                  </Form>
                )}
              </ModalFooter>
            </>
          )}
        </Modal>

        {/* Result Modal */}
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Import Complete"
        >
          {actionData && 'success' in actionData && actionData.success && 'imported' in actionData && actionData.imported && (
            <>
              <ModalContent>
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                      Import Successful!
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mt-2">
                      {actionData.imported.succeeded} customers imported successfully
                      {actionData.imported.failed > 0 && `, ${actionData.imported.failed} failed`}
                    </p>
                  </div>
                </div>
              </ModalContent>
              <ModalFooter>
                <Button
                  variant="secondary"
                  onClick={() => setShowResultModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowResultModal(false);
                    window.location.href = '/customers';
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Customers
                </Button>
              </ModalFooter>
            </>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}

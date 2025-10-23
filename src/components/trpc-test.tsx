"use client";

import { api } from "~/trpc/react";

export function TRPCTestComponent() {
  // Example query that will show up in logs
  const { data: partners, isLoading } = api.partner.getById.useQuery({
    id: "test-id", // This will likely fail and show error logs
  });

  const createPartner = api.partner.create.useMutation({
    onSuccess: () => {
      console.log("Partner created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create partner:", error);
    },
  });

  const handleCreatePartner = () => {
    createPartner.mutate({
      name: "Test Partner",
      domain: "test.com",
      shopify_secret: "test-secret",
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold">tRPC Test Component</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Query Test:</h4>
          <p className="text-sm text-gray-600">
            {isLoading
              ? "Loading..."
              : "Query completed (check console for logs)"}
          </p>
        </div>

        <div>
          <h4 className="font-medium">Mutation Test:</h4>
          <button
            onClick={handleCreatePartner}
            disabled={createPartner.isPending}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {createPartner.isPending ? "Creating..." : "Create Test Partner"}
          </button>
        </div>

        <div className="text-xs text-gray-500">
          <p>Check your terminal/console for detailed tRPC logs:</p>
          <ul className="mt-1 list-inside list-disc">
            <li>Request details (path, input, timestamp)</li>
            <li>Execution duration</li>
            <li>Success/failure status</li>
            <li>Error details (if any)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

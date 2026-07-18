"use client";

import { createGCOAuthClient } from "@/actions/auth/create-gc-oauth-client";
import { useState, useTransition } from "react";

type OAuthClientResult =
  | {
      success: true;
      clientId: string;
      clientSecret: string;
      redirectUris?: string[];
    }
  | {
      success: false;
      message: string;
    };

export default function CreateGCOAuthClientButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<OAuthClientResult | null>(null);

  function handleCreateClient() {
    setResult(null);

    startTransition(async () => {
      const response = await createGCOAuthClient();
      setResult(response as OAuthClientResult);
    });
  }

  async function copyToClipboard(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="max-w-2xl space-y-6 rounded-xl border bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">
          Gift Cart OAuth Client
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Create a new OAuth client for the deployed Gift Cart application.
        </p>
      </div>

      <button
        type="button"
        onClick={handleCreateClient}
        disabled={isPending}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Creating OAuth Client..."
          : "Create Gift Cart OAuth Client"}
      </button>

      {result && !result.success && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {result.message}
        </div>
      )}

      {result?.success && (
        <div className="space-y-5 rounded-lg border border-green-300 bg-green-50 p-5">
          <div>
            <p className="font-semibold text-green-800">
              OAuth client created successfully
            </p>

            <p className="mt-1 text-sm text-green-700">
              Copy the client secret now. You may not be able to view it again.
            </p>
          </div>

          <CredentialField
            label="Client ID"
            value={result.clientId}
            onCopy={copyToClipboard}
          />

          <CredentialField
            label="Client Secret"
            value={result.clientSecret}
            onCopy={copyToClipboard}
          />

          {result.redirectUris &&
            result.redirectUris.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-medium">
                  Registered Redirect URI
                </p>

                {result.redirectUris.map((uri) => (
                  <code
                    key={uri}
                    className="block overflow-x-auto rounded bg-white p-3 text-sm"
                  >
                    {uri}
                  </code>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

function CredentialField({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string) => Promise<void>;
}) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium">{label}</p>

      <div className="flex gap-2">
        <code className="min-w-0 flex-1 overflow-x-auto rounded border bg-white p-3 text-sm">
          {value}
        </code>

        <button
          type="button"
          onClick={() => onCopy(value)}
          className="rounded border bg-white px-4 py-2 text-sm hover:bg-gray-100"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
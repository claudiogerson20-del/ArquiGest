"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui";
import { getDocumentUrl } from "../../actions";

export function DownloadButton({ documentId }: { documentId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={pending}
      aria-label="Descarregar"
      onClick={() =>
        start(async () => {
          const url = await getDocumentUrl(documentId);
          if (url) window.location.assign(url);
        })
      }
    >
      <Download className="size-4" aria-hidden />
    </Button>
  );
}

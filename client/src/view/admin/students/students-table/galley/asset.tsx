import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { Download, FileText, X } from "lucide-react";
import Link from "next/link";
import React from "react";

const Asset = ({ asset, onDelete }: { asset: Asset; onDelete: () => void }) => {
  const { apiClient } = useAuth();
  const deleting = useLoading();
  const downloading = useLoading();

  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${asset.id}`;

  const deleteFromGalleryHandler = () => {
    deleting.asyncWrapper(async () => {
      await apiClient.delete(`/api/student/assets/${asset.id}`);
      onDelete();
    });
  };

  const downloadHandler = () => {
    downloading.asyncWrapper(async () => {
      const response = await fetch(fileUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download =
        asset.path.split("/").at(-1) || asset.type.replaceAll("/", ".");
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    });
  };

  const renderPreview = () => {
    if (asset.type.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt={asset.id}
          className="w-auto h-48 object-contain"
        />
      );
    } else if (asset.type.startsWith("video/")) {
      return (
        <video
          src={fileUrl}
          controls
          className="w-auto h-48 object-contain bg-black"
        />
      );
    } else if (asset.type === "application/pdf") {
      return (
        <embed src={fileUrl} type="application/pdf" className="w-auto h-48" />
      );
    } else {
      return (
        <div className="flex items-center justify-center w-48 h-48 border bg-gray-50 text-sm text-gray-600">
          <FileText className="w-6 h-6 mr-2" />
          <span>{asset.path.split("/").at(-1)}</span>
        </div>
      );
    }
  };

  return (
    <div key={asset.id} className="w-auto h-48 relative">
      <Link href={fileUrl} target="_blank">
        {renderPreview()}
      </Link>
      <div
        className="flex gap-2 items-center absolute top-0 right-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Button onClick={downloadHandler} size="sm">
          {downloading.loader || <Download />}
        </Button>
        <Button onClick={deleteFromGalleryHandler} size="sm">
          {deleting.loader || <X />}
        </Button>
      </div>
    </div>
  );
};

export default Asset;

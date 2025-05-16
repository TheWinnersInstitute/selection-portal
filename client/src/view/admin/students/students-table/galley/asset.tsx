import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { Download, X } from "lucide-react";
import Link from "next/link";
import React from "react";

const Asset = ({ asset, onDelete }: { asset: Asset; onDelete: () => void }) => {
  const { apiClient } = useAuth();
  const deleting = useLoading();
  const downloading = useLoading();

  const deleteFromGalleryHandler = () => {
    deleting.asyncWrapper(async () => {
      await apiClient.delete(`/api/student/assets/${asset.id}`);
      onDelete();
    });
  };

  const downloadHandler = () => {
    downloading.asyncWrapper(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${asset.id}`,
        { mode: "cors" }
      );
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

  const isVideo = asset.type.startsWith("video");

  return (
    <div key={asset.id} className="w-auto h-48 relative">
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${asset.id}`}
        target="_blank"
      >
        {isVideo ? (
          <video
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${asset.id}`}
            className="w-auto h-48"
            controls
          />
        ) : (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${asset.id}`}
            alt={asset.id}
            className="w-auto h-48"
          />
        )}
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

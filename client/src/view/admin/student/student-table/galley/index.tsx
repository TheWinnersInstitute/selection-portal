import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import React, { useEffect, useState } from "react";
import Asset from "./asset";

export default function Gallery({ open, currentStudent, toggle }: Props) {
  const [gallery, setGallery] = useState<{ [key: string]: Asset[] }>({});
  const [files, setFiles] = useState<File[]>([]);

  const { apiClient } = useAuth();

  const fetchingGallery = useLoading();
  const processingGallery = useLoading();

  const fetchGallery = () => {
    if (!currentStudent?.id) return;
    fetchingGallery.asyncWrapper(async () => {
      const { data } = await apiClient.get(
        `/api/student/assets/${currentStudent?.id}`
      );
      setGallery((prev) => ({
        ...prev,
        [currentStudent.id]: data.data,
      }));
    });
  };

  useEffect(() => {
    if (open && currentStudent?.id && !gallery[currentStudent.id]) {
      fetchGallery();
    }

    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const uploadToGallery = () => {
    processingGallery.asyncWrapper(async () => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("userId", currentStudent?.id || "");
      await apiClient.post(`/api/student/assets`, formData);
      setFiles([]);
      fetchGallery();
      toggle();
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {fetchingGallery.loader ||
          (currentStudent?.id &&
            gallery[currentStudent.id]?.map((asset) => (
              <Asset
                onDelete={() => {
                  setGallery((prev) => {
                    return {
                      ...prev,
                      [currentStudent.id]: prev[currentStudent.id].filter(
                        (a) => a.id !== asset.id
                      ),
                    };
                  });
                }}
                asset={asset}
                key={asset.id}
              />
            )))}
      </div>
      <FileUpload multiple showPreview onChange={setFiles} />
      {files.length > 0 && (
        <Button onClick={uploadToGallery}>
          {processingGallery.loader || "Upload"}
        </Button>
      )}
    </>
  );
}

type Props = {
  open: boolean;
  toggle: () => void;
  currentStudent: Student | null;
};

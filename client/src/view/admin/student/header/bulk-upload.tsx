import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  triggerRefetchStudents: () => void;
};

export default function BulkUpload({ triggerRefetchStudents }: Props) {
  const bulkUploadInputRef = useRef<HTMLInputElement>(null);
  // const [total, setTotal] = useState(0);
  const [underProcess, setUnderProcess] = useState(0);
  const [pooling, setPooling] = useState(true);
  const { apiClient, isAuthenticated } = useAuth();

  const downloadingStudentData = useLoading();
  const uploadingFile = useLoading();

  const downloadingErroredData = useLoading();

  useEffect(() => {
    if (pooling && isAuthenticated) {
      const interval = setInterval(async () => {
        const { data } = await apiClient.get("/api/student/bulk/status");
        setUnderProcess(data.data[0]);
        if (data.data[0] === 0) {
          triggerRefetchStudents();
          setPooling(false);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
    return () => {};
  }, [pooling, isAuthenticated]);

  const bulkUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadingFile.asyncWrapper(async () => {
      try {
        const file = e.target?.files?.[0];
        if (!file) {
          toast("Please attach file");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await apiClient.post("/api/student/bulk", formData, {
          timeout: 600000,
        });
        setPooling(true);
        setUnderProcess(data.data[0]);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast(error.response?.data?.message || "Something went wrong");
        }
      }
    });
  };

  const downloadErroredDataHandler = () => {
    downloadingErroredData.asyncWrapper(async () => {
      try {
        const response = await apiClient.get("/api/student/bulk-error", {
          responseType: "blob",
        });

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "errored-data.xlsx");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast(error.response?.data?.message || "No error data available");
        }
      }
    });
  };

  const downloadStudentsDataHandler = () => {
    downloadingStudentData.asyncWrapper(async () => {
      try {
        const response = await apiClient.get("/api/student/bulk", {
          responseType: "blob",
        });

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "students-data.xlsx");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast(error.response?.data?.message || "No error data available");
        }
      }
    });
  };

  return (
    <>
      <Button onClick={downloadErroredDataHandler}>
        {downloadingErroredData.loader || "Download errored data"}
      </Button>
      <Button onClick={downloadStudentsDataHandler}>
        {downloadingStudentData.loader || "Download students data"}
      </Button>
      <input
        multiple={false}
        accept=".xlsx"
        onChange={bulkUploadHandler}
        type="file"
        className="hidden"
        ref={bulkUploadInputRef}
      />
      <Button
        disabled={pooling || uploadingFile.loading}
        onClick={() => bulkUploadInputRef.current?.click()}
      >
        {uploadingFile.loader ||
          (pooling ? `Processing ${underProcess}` : "Bulk upload")}
      </Button>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLoading } from "@/hooks/use-loading";
import { studentPdf } from "@/lib/utils";
import { AxiosError } from "axios";
import { Delete, Download, Trash2, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  triggerRefetchStudents: () => void;
  studentsToDelete: string[];
};

export default function BulkUpload({
  triggerRefetchStudents,
  studentsToDelete,
}: Props) {
  const firstRender = useRef(true);
  const bulkUploadInputRef = useRef<HTMLInputElement>(null);
  // const [total, setTotal] = useState(0);
  const [underProcess, setUnderProcess] = useState(0);
  const [pooling, setPooling] = useState(true);
  const { apiClient, isAuthenticated } = useAuth();
  const { setStudents } = useData();

  const downloadingStudentData = useLoading();
  const uploadingFile = useLoading();
  const downloadingPdf = useLoading();
  const downloadingErroredData = useLoading();
  const deleting = useLoading();

  useEffect(() => {
    if (pooling && isAuthenticated) {
      const interval = setInterval(async () => {
        const { data } = await apiClient.get("/api/student/bulk/status");
        setUnderProcess(data.data[0]);
        if (data.data[0] === 0) {
          if (!firstRender) {
            triggerRefetchStudents();
          }
          firstRender.current = false;
          setPooling(false);
        }
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
    return () => {};
  }, [pooling, isAuthenticated]);

  const bulkDeleteHandler = () => {
    deleting.asyncWrapper(async () => {
      if (studentsToDelete.length === 0) {
        toast("Please select students to delete");
        return;
      }
      await Promise.all(
        studentsToDelete.map((id) => {
          return (async () => {
            await apiClient.delete(`/api/student/${id}`);
            setStudents((prev) => prev.filter((student) => student.id !== id));
          })();
        })
      );
    });
  };

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

  const downloadPfdHandler = () => {
    downloadingPdf.asyncWrapper(async () => {
      const { data } = await apiClient.get("/api/student", {
        params: {
          take: 10000,
        },
      });
      await studentPdf(data.data);
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
      <Button onClick={bulkDeleteHandler}>
        <Trash2 /> {deleting.loader || " Students"}
      </Button>
      <Button onClick={downloadPfdHandler}>
        <Download /> {" PDF"}
      </Button>
      <Button onClick={downloadStudentsDataHandler}>
        <Download /> {downloadingStudentData.loader || " Excel"}
      </Button>
      <Button onClick={downloadErroredDataHandler}>
        <Download /> {downloadingErroredData.loader || " Errored data"}
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
        <Upload />
        {uploadingFile.loader || (pooling ? ` ${underProcess}` : " Bulk")}
      </Button>
    </>
  );
}

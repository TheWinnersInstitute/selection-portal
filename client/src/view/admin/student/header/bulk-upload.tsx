import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLoading } from "@/hooks/use-loading";
import { useModel } from "@/hooks/use-model";
import { studentPdf } from "@/lib/utils";
import { AxiosError } from "axios";
import { Download, Trash2, Upload } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  triggerRefetchStudents: () => void;
  studentsToDelete: BooleanMap;
};

export default function BulkUpload({
  triggerRefetchStudents,
  studentsToDelete,
}: Props) {
  const firstRender = useRef(true);
  const bulkUploadInputRef = useRef<HTMLInputElement>(null);
  const [underProcess, setUnderProcess] = useState(0);
  const [pooling, setPooling] = useState(true);
  const { apiClient, isAuthenticated } = useAuth();
  const { setStudents } = useData();

  const uploadingFile = useLoading();
  const deleting = useLoading();

  const deleteStudentsModel = useModel(
    "Are you sure you want to delete this student ??"
  );
  const downloadErroredData = useModel(
    "Are you sure you want to download errored data ??"
  );
  const downloadStudentsExcelData = useModel(
    "Are you sure you want to download students data excel ??"
  );

  const downloadStudentsPDFData = useModel(
    "Are you sure you want to download students data pdf ??"
  );

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

  const studentsListToDelete = useMemo(() => {
    return Object.keys(studentsToDelete).filter((key) => studentsToDelete[key]);
  }, [studentsToDelete]);

  const bulkDeleteHandler = () => {
    deleting.asyncWrapper(async () => {
      if (studentsListToDelete.length === 0) {
        toast("Please select students to delete");
        return;
      }
      await Promise.all(
        studentsListToDelete.map((id) => {
          return (async () => {
            await apiClient.delete(`/api/student/${id}`);
            setStudents((prev) => prev.filter((student) => student.id !== id));
          })();
        })
      );
      deleteStudentsModel.toggleModel();
      toast("Students deleted successfully");
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

  const downloadPfdHandler = async () => {
    const { data } = await apiClient.get("/api/student", {
      params: {
        take: 10000,
      },
    });
    if (data.data.length === 0) {
      toast("No students found");
      return;
    }
    await studentPdf(data.data);
  };

  const downloadErroredDataHandler = async () => {
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
    downloadErroredData.toggleModel();
  };

  const downloadStudentsDataHandler = async () => {
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
  };

  return (
    <>
      {studentsListToDelete.length > 0 && (
        <>
          <Button
            className="fixed bottom-10 right-10 z-50"
            onClick={deleteStudentsModel.toggleModel}
          >
            <Trash2 /> {studentsListToDelete.length} students
          </Button>

          {deleteStudentsModel.content(
            <div className="flex justify-end items-center gap-2">
              <Button
                variant="outline"
                onClick={deleteStudentsModel.toggleModel}
              >
                Cancel
              </Button>
              <Button onClick={bulkDeleteHandler}>
                {deleting.loader || "Delete"}
              </Button>
            </div>
          )}
        </>
      )}
      <Button onClick={downloadStudentsPDFData.toggleModel}>
        <Download /> {" PDF"}
      </Button>
      <Button onClick={downloadStudentsExcelData.toggleModel}>
        <Download /> Excel
      </Button>
      <Button onClick={downloadErroredData.toggleModel}>
        <Download /> Errored data
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
      {downloadErroredData.confirmationModel(
        "Download",
        downloadErroredDataHandler
      )}
      {downloadStudentsExcelData.confirmationModel(
        "Download",
        downloadStudentsDataHandler
      )}
      {downloadStudentsPDFData.confirmationModel(
        "Download",
        downloadPfdHandler
      )}
    </>
  );
}

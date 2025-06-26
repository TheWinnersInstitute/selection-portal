import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import LuckyDrawParticipantForm, {
  LuckyDrawParticipantFormSchema,
  LuckyDrawParticipantFormType,
} from "./form";
import { Button } from "@/components/ui/button";
import LuckyDrawParticipantsTable from "./table";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function LuckyDrawParticipants({ winners }: Props) {
  const bulkUploadInputRef = useRef<HTMLInputElement>(null);
  const [participants, setLuckyDrawParticipants] = useState<
    LuckyDrawParticipant[]
  >([]);
  const [editData, setEditData] = useState<null | LuckyDrawParticipant>(null);
  const [openLuckyDrawParticipantForm, setOpenLuckyDrawParticipantForm] =
    useState(false);

  const params = useParams();

  const { apiClient, isAuthenticated } = useAuth();

  const fetchingLuckyDrawParticipants = useLoading();
  const uploadingFile = useLoading();

  const form = useForm<LuckyDrawParticipantFormType>({
    resolver: zodResolver(LuckyDrawParticipantFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchingLuckyDrawParticipants.asyncWrapper(async () => {
        const { data } = await apiClient.get(
          `/api/lucky-draw/participant/${params.luckyDrawId}`,
          {
            params: {
              winners: winners || false,
            },
          }
        );
        setLuckyDrawParticipants(data.data);
      });
    }
  }, [isAuthenticated]);

  const toggleLuckyDrawParticipantForm = () =>
    setOpenLuckyDrawParticipantForm((prev) => !prev);

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
        const { data } = await apiClient.post(
          `/api/lucky-draw/participants/${params.luckyDrawId}`,
          formData,
          {
            timeout: 600000,
          }
        );
        setLuckyDrawParticipants((prev) => [...prev, ...data.data]);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast(error.response?.data?.message || "Something went wrong");
        }
      }
    });
  };

  if (fetchingLuckyDrawParticipants.unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <h2 className="font-bold opacity-55">
          You are not authorized to access this screen
        </h2>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-3 pt-3 mb-3">
        <h2 className="font-semibold">Lucky draw participants</h2>
        <div className="flex items-center gap-1">
          <input
            multiple={false}
            accept=".xlsx"
            onChange={bulkUploadHandler}
            type="file"
            className="hidden"
            ref={bulkUploadInputRef}
          />
          <Button
            disabled={uploadingFile.loading}
            onClick={() => bulkUploadInputRef.current?.click()}
          >
            <Upload />
            {uploadingFile.loader || " Bulk"}
          </Button>
          <Button onClick={toggleLuckyDrawParticipantForm}>Participate</Button>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {fetchingLuckyDrawParticipants.loader}
      </div>

      {!fetchingLuckyDrawParticipants.loading && (
        <LuckyDrawParticipantsTable
          form={form}
          participants={participants}
          setEditData={setEditData}
          toggleLuckyDrawParticipantForm={toggleLuckyDrawParticipantForm}
          setLuckyDrawParticipants={setLuckyDrawParticipants}
        />
      )}
      <LuckyDrawParticipantForm
        editData={editData}
        setLuckyDrawParticipants={setLuckyDrawParticipants}
        openLuckyDrawParticipantForm={openLuckyDrawParticipantForm}
        toggleLuckyDrawParticipantForm={toggleLuckyDrawParticipantForm}
        setEditData={setEditData}
        form={form}
      />
    </div>
  );
}

type Props = {
  winners?: boolean;
};

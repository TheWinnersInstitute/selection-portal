import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LuckyDrawParticipantForm, {
  LuckyDrawParticipantFormSchema,
  LuckyDrawParticipantFormType,
} from "./form";
import { Button } from "@/components/ui/button";
import LuckyDrawParticipantsTable from "./table";

export default function LuckyDrawParticipants({ winners }: Props) {
  const [participants, setLuckyDrawParticipants] = useState<
    LuckyDrawParticipant[]
  >([]);
  const [editData, setEditData] = useState<null | LuckyDrawParticipant>(null);
  const [openLuckyDrawParticipantForm, setOpenLuckyDrawParticipantForm] =
    useState(false);

  const params = useParams();

  const { apiClient, isAuthenticated } = useAuth();
  const fetchingLuckyDrawParticipants = useLoading();

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
        <h2 className="font-semibold">LuckyDrawParticipants</h2>
        <Button onClick={toggleLuckyDrawParticipantForm}>Participate</Button>
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

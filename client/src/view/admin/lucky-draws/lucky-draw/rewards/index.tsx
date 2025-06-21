import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LuckyDrawRewardForm, {
  LuckyDrawRewardFormSchema,
  LuckyDrawRewardFormType,
} from "./form";
import { useParams } from "next/navigation";
import LuckyDrawRewardsTable from "./table";

export default function Rewards() {
  const [luckyDrawRewards, setLuckyDrawRewards] = useState<LuckyDrawReward[]>(
    []
  );
  const [editData, setEditData] = useState<null | LuckyDrawReward>(null);
  const [openLuckyDrawForm, setOpenLuckyDrawForm] = useState(false);

  const params = useParams();

  const { apiClient, isAuthenticated } = useAuth();
  const fetchingLuckyDrawRewards = useLoading();

  const form = useForm<LuckyDrawRewardFormType>({
    resolver: zodResolver(LuckyDrawRewardFormSchema),
    defaultValues: {
      name: "",
      count: 1,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchingLuckyDrawRewards.asyncWrapper(async () => {
        const { data } = await apiClient.get(
          `/api/lucky-draw/reward/${params.luckyDrawId}`
        );
        setLuckyDrawRewards(data.data);
      });
    }
  }, [isAuthenticated]);

  const toggleLuckyDrawRewardForm = () => setOpenLuckyDrawForm((prev) => !prev);

  if (fetchingLuckyDrawRewards.unauthorized) {
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
        <h2 className="font-semibold">Lucky draw</h2>
        <Button onClick={toggleLuckyDrawRewardForm}>
          Add Lucky draw reward
        </Button>
      </div>
      <div className="flex justify-center items-center">
        {fetchingLuckyDrawRewards.loader}
      </div>

      {!fetchingLuckyDrawRewards.loading && (
        <LuckyDrawRewardsTable
          form={form}
          luckyDrawRewards={luckyDrawRewards}
          setEditData={setEditData}
          toggleLuckyDrawRewardForm={toggleLuckyDrawRewardForm}
          setLuckyDrawRewards={setLuckyDrawRewards}
        />
      )}
      <LuckyDrawRewardForm
        editData={editData}
        setLuckyDrawRewards={setLuckyDrawRewards}
        openLuckyDrawRewardForm={openLuckyDrawForm}
        toggleLuckyDrawRewardForm={toggleLuckyDrawRewardForm}
        setEditData={setEditData}
        form={form}
      />
    </div>
  );
}

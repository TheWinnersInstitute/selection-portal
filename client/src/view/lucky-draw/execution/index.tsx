import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ParticipantsTable from "./participants-table";
import WinnersTable from "./winners-table";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";

const delay = (time: number) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res("");
    }, time);
  });
};

export default function LuckyDrawExecution({
  luckyDraw,
  luckyDrawRewards,
}: Props) {
  const [winners, setWinners] = useState<null | LuckyDrawParticipant[]>(null);

  const submitting = useLoading();
  const { apiClient } = useAuth();

  const form = useForm<LuckyDrawExecutionType>({
    resolver: zodResolver(LuckyDrawExecutionSchema),
    defaultValues: {
      luckyDrawRewardId: "",
      count: 0,
    },
  });

  const onSubmit = (values: LuckyDrawExecutionType) => {
    submitting.asyncWrapper(async () => {
      if (winners) {
        await apiClient.post(
          `/api/lucky-draw/${luckyDraw.id}/${values.luckyDrawRewardId}`,
          { winners }
        );
        setWinners(null);
      } else {
        if (!values.luckyDrawRewardId) {
          toast("Please select reward", {});
          return;
        }
        const { data } = await apiClient.get(
          `/api/lucky-draw/${luckyDraw.id}/${values.luckyDrawRewardId}`,
          {
            params: !!values.count ? { count: values.count } : {},
          }
        );
        await delay(10000);
        setWinners(data.data);
      }
    });
  };

  return (
    <div className="relative h-screen w-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10 px-[5%] py-[2%]">
            <div className="flex justify-between">
              <h1 className=" mb-2 md:mb-4 font-bold text-md md:text-xl lg:text-2xl">
                {luckyDraw.name}
              </h1>
              <div className="flex gap-2">
                {winners ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setWinners(null)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {submitting.loader || "Confirm"}
                    </Button>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="luckyDrawRewardId"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Reward" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {luckyDrawRewards.map((reward) => {
                                  return (
                                    <SelectItem
                                      value={reward.id}
                                      key={reward.id}
                                    >
                                      {reward.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="100"
                              {...field}
                              onChange={(e) => {
                                field.onChange({
                                  ...e,
                                  target: {
                                    ...e.target,
                                    value: parseInt(e.target.value) || 0,
                                  },
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">
                      {submitting.loader || "Execute"}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 min-h-[90vh] gap-10">
              <div className="col-span-2">
                {submitting.loading && (
                  <Loader
                    variant="danger"
                    message="Choosing winners... this might take a while"
                  />
                )}
                {!winners && !submitting.loading && luckyDraw.bannerId && (
                  <Image
                    alt={luckyDraw.id}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${luckyDraw.bannerId}`}
                    width={500}
                    height={500}
                    className="w-full rounded-md"
                    quality={100}
                    priority
                  />
                )}
                {winners && <WinnersTable winners={winners} />}
              </div>
              <ParticipantsTable />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

type Props = {
  luckyDraw: LuckyDraw;
  luckyDrawRewards: LuckyDrawReward[];
};

type LuckyDrawExecutionType = z.infer<typeof LuckyDrawExecutionSchema>;

const LuckyDrawExecutionSchema = z.object({
  luckyDrawRewardId: z.string(),
  count: z.number().optional(),
});

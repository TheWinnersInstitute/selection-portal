import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        const { data } = await apiClient.get(
          `/api/lucky-draw/${luckyDraw.id}/${values.luckyDrawRewardId}`,
          {
            params: { count: values.count },
          }
        );
        setWinners(data.data);
      }
    });
  };

  return (
    <div className="relative h-screen w-screen">
      <Image
        alt={luckyDraw.id}
        src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${luckyDraw.bannerId}`}
        width={500}
        height={500}
        className="absolute top-0 left-0 right-0 bottom-0 w-screen h-auto object-cover opacity-30"
        quality={100}
        priority
      />
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
                                <SelectTrigger className="w-full bg-primary">
                                  <SelectValue placeholder="Select state" />
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
                  </>
                )}
              </div>
            </div>
            {!winners && (
              <div className="flex justify-center items-center h-[90vh]">
                <Button type="submit">{submitting.loader || "Start"}</Button>
              </div>
            )}

            {winners && (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile no.</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {winners.map((winner, index) => {
                        return (
                          <TableRow key={winner.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{winner.name}</TableCell>
                            <TableCell>{winner.phone}</TableCell>
                            <TableCell>{winner.email}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
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

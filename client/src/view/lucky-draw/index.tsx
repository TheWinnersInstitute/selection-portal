"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import LuckyDrawParticipantForm, {
  LuckyDrawParticipantFormSchema,
  LuckyDrawParticipantFormType,
} from "../admin/lucky-draws/lucky-draw/participants/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import LuckyDrawExecution from "./execution";

export default function PublicLuckyDrawPage({
  luckyDraw,
  luckyDrawRewards,
}: Props) {
  const [openLuckyDrawParticipantForm, setOpenLuckyDrawParticipantForm] =
    useState(false);
  const { isAuthenticated } = useAuth();

  const form = useForm<LuckyDrawParticipantFormType>({
    resolver: zodResolver(LuckyDrawParticipantFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const isParticipationEnded = useMemo(() => {
    const endDate = new Date(luckyDraw.participationEndDate).getTime();
    const currentDate = new Date().getTime();
    return currentDate > endDate;
  }, []);

  const toggleLuckyDrawParticipantForm = () =>
    setOpenLuckyDrawParticipantForm((prev) => !prev);

  return isAuthenticated ? (
    <LuckyDrawExecution
      luckyDraw={luckyDraw}
      luckyDrawRewards={luckyDrawRewards}
    />
  ) : (
    <div>
      <Image
        alt={luckyDraw.id}
        src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${luckyDraw.bannerId}`}
        width={500}
        height={500}
        className="w-full h-auto"
        quality={100}
        priority
      />
      <div className="px-[5%] mt-4">
        <div className="flex justify-between items-center">
          <h1 className="mb-2 md:mb-4 font-bold text-md md:text-xl lg:text-2xl">
            {luckyDraw.name}{" "}
            {luckyDraw.participantsCount
              ? `(${luckyDraw.participantsCount})`
              : null}
          </h1>
          <div className="flex gap-2">
            {/* {isAuthenticated && <Button onClick={() => setShowDrawScreen(true)}>Start</Button>} */}
            {!isParticipationEnded && !isAuthenticated && (
              <Button onClick={toggleLuckyDrawParticipantForm}>
                Participate
              </Button>
            )}
          </div>
        </div>
        {/* <h2 className="font-bold text-sm md:text-md lg:text-lg">Rewards</h2> */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.no.</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {luckyDrawRewards.map((reward, index) => (
              <TableRow key={reward.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar>
                    {reward.assetId && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${reward.assetId}`}
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell>{reward.name}</TableCell>
                <TableCell>{reward.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <LuckyDrawParticipantForm
          toggleLuckyDrawParticipantForm={toggleLuckyDrawParticipantForm}
          openLuckyDrawParticipantForm={openLuckyDrawParticipantForm}
          form={form}
        />
      </div>
    </div>
  );
}

type Props = {
  luckyDraw: LuckyDraw;
  luckyDrawRewards: LuckyDrawReward[];
};

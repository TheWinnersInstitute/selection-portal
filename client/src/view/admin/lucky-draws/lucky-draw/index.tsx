"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import React, { useState } from "react";
import Rewards from "./rewards";
import Participants from "./participants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LuckyDrawClientPage({ luckyDraw }: Props) {
  const [currentTab, setCurrentTab] = useState("banner");
  return (
    <div className="">
      <Tabs defaultValue="banner">
        <div className="flex gap-2 items-center">
          <Link href="/admin/lucky-draw">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <TabsList>
            <TabsTrigger onClick={() => setCurrentTab("banner")} value="banner">
              Banner
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setCurrentTab("rewards")}
              value="rewards"
            >
              Rewards
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setCurrentTab("participants")}
              value="participants"
            >
              Participants
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setCurrentTab("participants")}
              value="winners"
            >
              Winners
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="banner">
          <Image
            alt={luckyDraw.id}
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/admin/assets/${luckyDraw.bannerId}`}
            width={500}
            height={500}
            className="w-full h-auto rounded-md mb-3"
            quality={100}
            priority
          />
        </TabsContent>
        <TabsContent value="rewards">
          <Rewards />
        </TabsContent>
        <TabsContent value="participants">
          <Participants />
        </TabsContent>
        <TabsContent value="winners">
          <Participants winners />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type Props = {
  luckyDraw: LuckyDraw;
};

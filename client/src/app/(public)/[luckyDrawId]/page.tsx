import PublicLuckyDrawPage from "@/view/lucky-draw";
import React from "react";

export default async function ServerLuckyDrawPage(props: ServerProps) {
  try {
    const { luckyDrawId } = await props.params;
    const luckyDraw = await fetchLuckyDraw(luckyDrawId);
    const luckyDrawRewards = await fetchLuckyDrawRewards(luckyDrawId);
    return (
      <PublicLuckyDrawPage
        luckyDraw={luckyDraw}
        luckyDrawRewards={luckyDrawRewards}
      />
    );
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <h2 className="font-bold">Oops! Something went wrong.</h2>
    </div>
  );
}

type ServerProps = { params: Promise<{ luckyDrawId: string }> };

async function fetchLuckyDraw(id: string): Promise<LuckyDraw> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lucky-draw/${id}`,
    {
      // next: {revalidate: ""}
    }
  );
  const data = await response.json();
  return data.data[0];
}

async function fetchLuckyDrawRewards(id: string): Promise<LuckyDrawReward[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lucky-draw/reward/${id}`,
    {
      // next: {revalidate: ""}
    }
  );
  const data = await response.json();
  return data.data;
}

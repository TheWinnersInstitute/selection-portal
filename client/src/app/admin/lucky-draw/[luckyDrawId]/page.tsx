import LuckyDrawClientPage from "@/view/admin/lucky-draws/lucky-draw";
import React from "react";

export default async function ServerLuckyDrawPage(props: ServerProps) {
  const { luckyDrawId } = await props.params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lucky-draw/${luckyDrawId}`
  );
  const data = await res.json();
  const luckyDraw: LuckyDraw = data.data[0];

  return <LuckyDrawClientPage luckyDraw={luckyDraw} />;
}

type ServerProps = { params: Promise<{ luckyDrawId: string }> };

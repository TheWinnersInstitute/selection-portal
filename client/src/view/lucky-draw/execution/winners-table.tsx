import React, { useEffect, useRef, useState } from "react";

export default function WinnersTable({ winners }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollInterval = setInterval(() => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += 1;
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="max-h-[85vh]">
      <div className="font-bold text-lg mb-2">Winners</div>

      <div className="flex bg-secondary px-3 py-2 font-semibold rounded-md rounded-b-none">
        <p className="flex-1">S.No.</p>
        <p className="flex-2">Name</p>
        <p className="flex-2">Phone</p>
        <p className="flex-2">Email</p>
      </div>
      <div
        ref={containerRef}
        className="max-h-[80vh] overflow-y-scroll border-[1px] rounded-md rounded-t-none"
      >
        {winners.map((winner, index) => {
          return (
            <div
              className="flex px-3 py-2 font-semibold border-b-[1px] text-sm"
              key={`${index}-${winner.id}`}
            >
              <p className="flex-1">{index + 1}</p>
              <p className="flex-2">{winner.name}</p>
              <p className="flex-2">{hideMobileNumber(winner.phone)}</p>
              <p className="flex-2">{hideEmail(winner.email)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  winners: LuckyDrawParticipant[];
};

function hideMobileNumber(number: string) {
  if (number.length < 4) return number;

  const start = number.slice(0, 2);
  const end = number.slice(-2);
  const masked = "*".repeat(number.length - 4);
  return `${start}${masked}${end}`;
}

function hideEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain || local.length < 3) return email;

  const start = local.slice(0, 2);
  const end = local.slice(-1);
  const masked = "*".repeat(local.length - 3);
  return `${start}${masked}${end}@${domain}`;
}

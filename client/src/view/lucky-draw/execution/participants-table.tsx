import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function ParticipantsTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<LuckyDrawParticipant[]>([]);

  const { luckyDrawId } = useParams();

  const { apiClient } = useAuth();

  const fetchingParticipants = useLoading();
  useEffect(() => {
    fetchingParticipants.asyncWrapper(async () => {
      const { data } = await apiClient.get(
        `/api/lucky-draw/participant/${luckyDrawId}`
      );
      setParticipants(data.data);
    });
  }, []);

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
      <div className="font-bold text-lg mb-2">
        Total Participants - {participants.length}
      </div>

      <div className="flex bg-secondary px-3 py-2 font-semibold rounded-md rounded-b-none">
        <p className="flex-1">S.No.</p>
        <p className="flex-3">Name</p>
      </div>
      <div
        ref={containerRef}
        className="max-h-[80vh] overflow-y-scroll border-[1px] rounded-md rounded-t-none"
      >
        {participants.map((participant, index) => {
          return (
            <div
              className="flex px-3 py-2 font-semibold border-b-[1px] text-sm"
              key={`${index}-${participant.id}`}
            >
              <p className="flex-1">{index + 1}</p>
              <p className="flex-3">{participant.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

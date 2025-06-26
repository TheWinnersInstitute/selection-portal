import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/hooks/use-loading";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ParticipantsTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<LuckyDrawParticipant[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [total, setTotal] = useState<null | number>(null);
  const [refetch, setRefetch] = useState(true);
  const [page, setPage] = useState(0);

  const { luckyDrawId } = useParams();

  const { apiClient } = useAuth();

  const fetchingParticipants = useLoading();

  const fetchParticipants = (cursor?: string) => {
    fetchingParticipants.asyncWrapper(async () => {
      // const cursor = ;
      const { data } = await apiClient.get(
        `/api/lucky-draw/participant/${luckyDrawId}`,
        {
          params: {
            cursor,
          },
        }
      );
      setTotal(data.total);
      setCursor(data.cursor);
      setParticipants(data.data);
      setRefetch(false);
      setPage((prev) => {
        if (!data.cursor) {
          return 1;
        }
        return prev + 1;
      });
    });
  };

  // const cursor = useMemo(() => {
  //   return participants[participants.length - 1]?.id;
  // }, [participants]);

  useEffect(() => {
    if (refetch && !fetchingParticipants.loading) {
      fetchParticipants(cursor);
    }
  }, [refetch]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || (total && total <= participants.length)) {
      console.log("Returning effect", {
        as: total && total <= participants.length,
      });
      return;
    }

    const scrollInterval = setInterval(() => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        container.scrollTop = 0;
        setRefetch(true);
      } else {
        container.scrollTop += 1;
      }
    }, 10);

    return () => clearInterval(scrollInterval);
  }, [cursor, total, participants.length]);

  return (
    <div className="max-h-[85vh]">
      <div className="font-bold text-lg mb-2">Total Participants - {total}</div>

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
              <p className="flex-1">{index + 1 + (page - 1) * 100}</p>
              <p className="flex-3">{participant.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

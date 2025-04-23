import ClientExamsPage from "@/view/admin/exams";
import { Suspense } from "react";

export default function ServerExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center my-5">Loading...</div>
      }
    >
      <ClientExamsPage />
    </Suspense>
  );
}

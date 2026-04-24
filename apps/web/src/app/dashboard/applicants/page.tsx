import { Suspense } from "react";
import { ApplicantsList } from "@/features/applicants/components";

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div>Loading talent pool...</div>}>
      <ApplicantsList />
    </Suspense>
  );
}

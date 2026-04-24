import { use } from "react";
import { PublicJobView } from "@/features/jobs/components/public-job-view";

export default function PublicJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <PublicJobView jobId={id} />;
}

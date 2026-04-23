import { PublicJobView } from "@/features/jobs/components/public-job-view";
import { use } from "react";

export default function PublicJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return <PublicJobView jobId={id} />;
}

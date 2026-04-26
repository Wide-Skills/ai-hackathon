"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { CreateJobForm } from "@/features/jobs/components/create-job-form";
import { trpc } from "@/utils/trpc";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;

  const jobQuery = useQuery(trpc.jobs.getById.queryOptions({ id }));

  if (jobQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl pt-12">
        <div className="h-8 w-40 animate-pulse rounded-standard bg-bg2" />
        <div className="mt-8 h-[600px] animate-pulse rounded-card bg-bg2" />
      </div>
    );
  }

  if (!jobQuery.data) {
    return <div>Job not found</div>;
  }

  return (
    <div className="py-section-padding">
      <CreateJobForm initialData={jobQuery.data} />
    </div>
  );
}

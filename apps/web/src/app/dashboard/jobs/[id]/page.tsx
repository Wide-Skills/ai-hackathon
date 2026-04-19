"use client";

import * as React from "react";
import { JobDetail } from "@/features/jobs/components/job-detail";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return <JobDetail id={id} />;
}

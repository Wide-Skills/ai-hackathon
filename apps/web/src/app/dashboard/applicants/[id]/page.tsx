"use client";

import { ApplicantDetail } from "@/features/applicants/components";
import * as React from "react";

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return <ApplicantDetail id={id} />;
}

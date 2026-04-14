"use client";

import * as React from "react";
import { ApplicantDetail } from "@/features/applicants/components";

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return <ApplicantDetail id={id} />;
}

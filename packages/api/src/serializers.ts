import type {
  ApplicantDocument,
  JobDocument,
  ScreeningResultDocument,
} from "@ai-hackathon/db";
import {
  ApplicantSchema,
  JobSchema,
  ScreeningResultSchema,
} from "@ai-hackathon/shared";
import { Types } from "mongoose";

type MongoDocument<T> = T & {
  _id: Types.ObjectId;
  toObject(): T & { _id: Types.ObjectId };
};

function stringifyId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  return String(value);
}

export function serializeApplicant(doc: MongoDocument<ApplicantDocument>) {
  const applicant = doc.toObject();

  return ApplicantSchema.parse({
    ...applicant,
    id: stringifyId(applicant._id),
    jobId: stringifyId(applicant.jobId),
    screening: applicant.screening
      ? {
          ...applicant.screening,
          strengths: applicant.screening.strengths ?? [],
          gaps: applicant.screening.gaps ?? [],
          skillBreakdown: applicant.screening.skillBreakdown ?? [],
        }
      : undefined,
  });
}

export function serializeJob(doc: MongoDocument<JobDocument>) {
  const job = doc.toObject();

  return JobSchema.parse({
    ...job,
    id: stringifyId(job._id),
  });
}

export function serializeScreening(
  doc: MongoDocument<ScreeningResultDocument>,
) {
  const screening = doc.toObject();

  return ScreeningResultSchema.parse({
    ...screening,
    id: stringifyId(screening._id),
    applicantId: stringifyId(screening.applicantId),
    jobId: stringifyId(screening.jobId),
    strengths: screening.strengths ?? [],
    gaps: screening.gaps ?? [],
    skillBreakdown: screening.skillBreakdown ?? [],
  });
}

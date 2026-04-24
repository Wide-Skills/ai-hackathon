import { z } from "zod";
import { ScreeningResultSchema } from "./screening.schema";

export const SKILL_LEVELS = [
  "Basic",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;
export const LANGUAGE_PROFICIENCIES = [
  "Basic",
  "Intermediate",
  "Conversational",
  "Fluent",
  "Native",
] as const;

export const SkillSchema = z.object({
  name: z.string(),
  level: z.enum(SKILL_LEVELS),
  yearsOfExperience: z.number(),
});

export const LanguageSchema = z.object({
  name: z.string(),
  proficiency: z.enum(LANGUAGE_PROFICIENCIES),
});

export const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  isCurrent: z.boolean(),
});

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startYear: z.number(),
  endYear: z.number(),
});

export const CertificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  role: z.string(),
  link: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const ApplicationStatusSchema = z.enum([
  "pending",
  "screening",
  "shortlisted",
  "rejected",
  "hired",
  "failed",
]);

export const AVAILABILITY_STATUSES = [
  "Available",
  "Open to Opportunities",
  "Not Available",
] as const;
export const AVAILABILITY_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
] as const;

export const CreateApplicantSchema = z.object({
  jobId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  resumeText: z.string().optional(),
  resumeUrl: z.string().url().optional(),
  headline: z.string().default("Applicant"),
  bio: z.string().optional(),
  location: z.string().default("Remote"),
  avatarUrl: z.string().url().optional(),
  skills: z.array(SkillSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  availability: z
    .object({
      status: z.enum(AVAILABILITY_STATUSES),
      type: z.enum(AVAILABILITY_TYPES),
      startDate: z.string().optional(),
    })
    .default({
      status: "Available",
      type: "Full-time",
    }),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      github: z.string().optional(),
      portfolio: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional()
    .default({}),
});

export const PublicApplySchema = z.object({
  jobId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  resumeText: z.string().optional(),
  resumeUrl: z.string().url().optional(),
});

export type PublicApplyInput = z.infer<typeof PublicApplySchema>;

export type CreateApplicantInput = z.infer<typeof CreateApplicantSchema>;

export const ApplicantScreeningSchema = ScreeningResultSchema.omit({
  id: true,
  applicantId: true,
  jobId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(SkillSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
});

export type ApplicantScreening = z.infer<typeof ApplicantScreeningSchema>;

export const ApplicantSchema = CreateApplicantSchema.extend({
  id: z.string(),
  name: z.string().optional(), // Derived or convenience
  appliedAt: z.string().or(z.date()),
  status: ApplicationStatusSchema.default("pending"),
  screening: ApplicantScreeningSchema.optional(),
  createdAt: z.date().optional().or(z.string()),
  updatedAt: z.date().optional().or(z.string()),
});

export type Skill = z.infer<typeof SkillSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export type Applicant = z.infer<typeof ApplicantSchema>;
export type SkillLevel = (typeof SKILL_LEVELS)[number];
export type LanguageProficiency = (typeof LANGUAGE_PROFICIENCIES)[number];
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
export type AvailabilityType = (typeof AVAILABILITY_TYPES)[number];
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

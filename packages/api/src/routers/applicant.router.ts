import { sendApplicationReceivedEmail } from "@ai-hackathon/auth/email";
import { Applicant, ScreeningResult } from "@ai-hackathon/db";
import { enqueueScreening } from "@ai-hackathon/queue";
import {
  ApplicantSchema,
  ApplicationStatusSchema,
  CreateApplicantSchema,
  createPaginatedResponseSchema,
  PaginationInputSchema,
  PublicApplySchema,
} from "@ai-hackathon/shared";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ensureJobExists, syncJobMetrics } from "../router-helpers/job-metrics";
import { serializeApplicant } from "../serializers";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  buildApplicantStatus,
  createOrUpdateScreening,
  evaluateAndExtractProfile,
  SYSTEM_USER_ID,
} from "./screening.router";

export const applicantRouter = router({
  publicApply: publicProcedure
    .input(PublicApplySchema)
    .output(ApplicantSchema)
    .mutation(async ({ input }) => {
      const job = await ensureJobExists(input.jobId);

      let extractedData: any = null;
      if (input.resumeText) {
        try {
          extractedData = await evaluateAndExtractProfile(job as any, {
            firstName: input.firstName,
            lastName: input.lastName,
            resumeText: input.resumeText,
          });
        } catch (e) {
          console.error("AI extraction failed during public apply:", e);
        }
      }

      const applicant = new Applicant({
        jobId: input.jobId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        name: `${input.firstName} ${input.lastName}`,
        resumeText: input.resumeText,
        resumeUrl: input.resumeUrl,
        appliedAt: new Date().toISOString(),
        headline: extractedData?.headline || "Applicant",
        bio: extractedData?.bio || "",
        location: extractedData?.location || "Unknown",
        skills:
          extractedData?.skills && extractedData.skills.length > 0
            ? extractedData.skills
            : [
                {
                  name: "General Professional",
                  level: "Intermediate",
                  yearsOfExperience: 0,
                },
              ],
        experience:
          extractedData?.experience && extractedData.experience.length > 0
            ? extractedData.experience
            : [
                {
                  company: "Unknown",
                  role: "Applicant",
                  startDate: "N/A",
                  endDate: "N/A",
                  description: "Not specified",
                  technologies: [],
                  isCurrent: false,
                },
              ],
        education:
          extractedData?.education && extractedData.education.length > 0
            ? extractedData.education
            : [
                {
                  institution: "Unknown",
                  degree: "Unknown",
                  fieldOfStudy: "Unknown",
                  startYear: 0,
                  endYear: 0,
                },
              ],
        languages: extractedData?.languages || [],
        certifications: extractedData?.certifications || [],
        projects:
          extractedData?.projects && extractedData.projects.length > 0
            ? extractedData.projects
            : [
                {
                  name: "Unknown",
                  description: "Unknown",
                  technologies: [],
                  role: "Unknown",
                },
              ],
        availability: { status: "Available", type: "Full-time" },
        status: extractedData
          ? buildApplicantStatus(extractedData.matchScore, {
              autoReject: job.autoRejectThreshold,
              needsReview: job.needsReviewThreshold,
            })
          : "pending",
        screening: extractedData
          ? {
              ...extractedData,
              languages: extractedData.languages || [],
              experience: extractedData.experience || [],
              education: extractedData.education || [],
              skills: extractedData.skills || [],
              certifications: extractedData.certifications || [],
              projects: extractedData.projects || [],
            }
          : undefined,
      });

      await applicant.save();
      await syncJobMetrics(input.jobId);

      if (extractedData) {
        const screeningPayload = {
          ...extractedData,
          applicantId: applicant.id,
          jobId: input.jobId,
        };
        await createOrUpdateScreening(
          applicant.id,
          input.jobId,
          SYSTEM_USER_ID,
          screeningPayload as any,
        );
      }

      sendApplicationReceivedEmail({
        email: input.email,
        firstName: input.firstName,
        jobTitle: job.title,
      }).catch((err) => console.error("Email error:", err));

      if (!extractedData && input.resumeText) {
        enqueueScreening({
          applicantId: applicant.id,
          jobId: job.id,
          triggeredByUserId: SYSTEM_USER_ID,
        }).catch((err) => console.error("Auto-screening enqueue error:", err));
      }

      return serializeApplicant(applicant);
    }),

  create: protectedProcedure
    .input(CreateApplicantSchema)
    .output(ApplicantSchema)
    .mutation(async ({ input, ctx }) => {
      await ensureJobExists(input.jobId);

      const applicant = new Applicant({
        ...input,
        userId: ctx.session.user.id,
        name: `${input.firstName} ${input.lastName}`,
        appliedAt: new Date().toISOString(),
      });
      await applicant.save();
      await syncJobMetrics(input.jobId);
      return serializeApplicant(applicant);
    }),

  ingestFromResume: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        resumeText: z.string(),
      }),
    )
    .output(ApplicantSchema)
    .mutation(async ({ input, ctx }) => {
      const job = await ensureJobExists(input.jobId);

      const validatedData = await evaluateAndExtractProfile(job as any, {
        firstName: input.firstName,
        lastName: input.lastName,
        bio: "",
        skills: [],
        resumeText: input.resumeText,
      });

      const applicant = new Applicant({
        jobId: input.jobId,
        userId: ctx.session.user.id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        name: `${input.firstName} ${input.lastName}`,
        resumeText: input.resumeText,
        appliedAt: new Date().toISOString(),
        headline: validatedData.headline || "Applicant",
        bio: validatedData.bio || "",
        location: validatedData.location || "Unknown",
        skills:
          validatedData.skills && validatedData.skills.length > 0
            ? validatedData.skills
            : [
                {
                  name: "General Professional",
                  level: "Intermediate",
                  yearsOfExperience: 0,
                },
              ],
        experience:
          validatedData.experience && validatedData.experience.length > 0
            ? validatedData.experience
            : [
                {
                  company: "Unknown",
                  role: "Applicant",
                  startDate: "N/A",
                  endDate: "N/A",
                  description: "Not specified",
                  technologies: [],
                  isCurrent: false,
                },
              ],
        education:
          validatedData.education && validatedData.education.length > 0
            ? validatedData.education
            : [
                {
                  institution: "Unknown",
                  degree: "Unknown",
                  fieldOfStudy: "Unknown",
                  startYear: 0,
                  endYear: 0,
                },
              ],
        languages: validatedData.languages || [],
        certifications: validatedData.certifications || [],
        projects:
          validatedData.projects && validatedData.projects.length > 0
            ? validatedData.projects
            : [
                {
                  name: "Unknown",
                  description: "Unknown",
                  technologies: [],
                  role: "Unknown",
                },
              ],
        status: buildApplicantStatus(validatedData.matchScore, {
          autoReject: job.autoRejectThreshold,
          needsReview: job.needsReviewThreshold,
        }),
        availability: { status: "Available", type: "Full-time" }, // default
        screening: {
          ...validatedData,
          languages: validatedData.languages || [],
          experience: validatedData.experience || [],
          education: validatedData.education || [],
          skills: validatedData.skills || [],
          certifications: validatedData.certifications || [],
          projects: validatedData.projects || [],
        },
      });
      await applicant.save();
      await syncJobMetrics(input.jobId);

      const screeningPayload = {
        ...validatedData,
        applicantId: applicant.id,
        jobId: input.jobId,
      };
      await createOrUpdateScreening(
        applicant.id,
        input.jobId,
        ctx.session.user.id,
        screeningPayload as any,
      );

      return serializeApplicant(applicant);
    }),

  ingestBatch: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        candidates: z.array(
          z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            headline: z.string().optional(),
            location: z.string().optional(),
            skills: z.array(z.string()).optional(),
            resumeText: z.string().optional(),
          }),
        ),
      }),
    )
    .output(z.object({ successCount: z.number(), failedCount: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const job = await ensureJobExists(input.jobId);

      let successCount = 0;
      let failedCount = 0;

      for (const candidate of input.candidates) {
        try {
          const applicant = new Applicant({
            jobId: input.jobId,
            userId: ctx.session.user.id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            name: `${candidate.firstName} ${candidate.lastName}`,
            resumeText: candidate.resumeText,
            appliedAt: new Date().toISOString(),
            headline: candidate.headline || "Applicant",
            location: candidate.location || "Unknown",
            skills:
              candidate.skills && candidate.skills.length > 0
                ? candidate.skills.map((s) => ({
                    name: s,
                    level: "Intermediate",
                    yearsOfExperience: 0,
                  }))
                : [
                    {
                      name: "General Professional",
                      level: "Intermediate",
                      yearsOfExperience: 0,
                    },
                  ],
            experience: [
              {
                company: "Unknown",
                role: "Applicant",
                startDate: "N/A",
                endDate: "N/A",
                description: "Not specified",
                technologies: [],
                isCurrent: false,
              },
            ],
            education: [
              {
                institution: "Unknown",
                degree: "Unknown",
                fieldOfStudy: "Unknown",
                startYear: 0,
                endYear: 0,
              },
            ],
            projects: [
              {
                name: "Unknown",
                description: "Unknown",
                technologies: [],
                role: "Unknown",
              },
            ],
            availability: { status: "Available", type: "Full-time" },
          });
          await applicant.save();
          successCount++;

          if (candidate.resumeText) {
            enqueueScreening({
              applicantId: applicant.id,
              jobId: job.id,
              triggeredByUserId: ctx.session.user.id,
            }).catch((err) =>
              console.error("Auto-screening enqueue error:", err),
            );
          }
        } catch (e) {
          console.error("Failed to ingest candidate:", e);
          failedCount++;
        }
      }

      if (successCount > 0) {
        await syncJobMetrics(input.jobId);
      }

      return { successCount, failedCount };
    }),

  list: protectedProcedure
    .input(PaginationInputSchema.optional())
    .output(createPaginatedResponseSchema(ApplicantSchema))
    .query(async ({ input }) => {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        jobId,
        sortBy,
        sortOrder = "desc",
      } = input || {};
      const skip = (page - 1) * limit;

      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { headline: { $regex: search, $options: "i" } },
        ];
      }
      if (status && status !== "all") {
        query.status = status;
      }
      if (jobId && jobId !== "all") {
        query.jobId = jobId;
      }

      const sort: any = {};
      if (sortBy) {
        if (sortBy === "score") {
          sort["screening.matchScore"] = sortOrder === "asc" ? 1 : -1;
        } else if (sortBy === "name") {
          sort.name = sortOrder === "asc" ? 1 : -1;
        } else if (sortBy === "applied") {
          sort.appliedAt = sortOrder === "asc" ? 1 : -1;
        } else {
          sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        }
      } else {
        sort.createdAt = -1;
      }

      const [applicants, totalCount] = await Promise.all([
        Applicant.find(query)
          .select("-resumeText")
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Applicant.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        items: applicants.map(serializeApplicant),
        totalCount,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      };
    }),

  listByJob: protectedProcedure
    .input(
      PaginationInputSchema.extend({
        jobId: z.string(),
      }),
    )
    .output(createPaginatedResponseSchema(ApplicantSchema))
    .query(async ({ input }) => {
      const { page, limit, search, jobId } = input;
      const skip = (page - 1) * limit;

      const query: any = { jobId };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { headline: { $regex: search, $options: "i" } },
        ];
      }

      const [applicants, totalCount] = await Promise.all([
        Applicant.find(query)
          .select("-resumeText")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Applicant.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        items: applicants.map(serializeApplicant),
        totalCount,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(ApplicantSchema.nullable())
    .query(async ({ input }) => {
      const applicant = await Applicant.findById(input.id);
      return applicant ? serializeApplicant(applicant) : null;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: CreateApplicantSchema.partial().extend({
          status: ApplicationStatusSchema.optional(),
        }),
      }),
    )
    .output(ApplicantSchema)
    .mutation(async ({ input }) => {
      const existing = await Applicant.findById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Applicant not found",
        });
      }

      const resumeChanged =
        input.data.resumeText && input.data.resumeText !== existing.resumeText;

      const applicant = await Applicant.findByIdAndUpdate(
        input.id,
        { $set: input.data },
        { new: true },
      );

      if (resumeChanged) {
        await ScreeningResult.updateOne(
          { applicantId: input.id },
          { $set: { isOutdated: true } },
        );
      }

      await syncJobMetrics(applicant!.jobId.toString());
      return serializeApplicant(applicant!);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const applicant = await Applicant.findById(input.id);
      if (!applicant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Applicant not found",
        });
      }

      const jobId = applicant.jobId.toString();

      await Promise.all([
        Applicant.findByIdAndDelete(input.id),
        ScreeningResult.deleteMany({ applicantId: input.id }),
      ]);

      await syncJobMetrics(jobId);
      return { success: true };
    }),

  generateDummy: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        count: z.number().min(1).max(20).default(5),
      }),
    )
    .output(z.object({ success: z.boolean(), count: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const job = await ensureJobExists(input.jobId);

      const firstNames = [
        "Jean",
        "Marie",
        "Alain",
        "Gisele",
        "Eric",
        "Divine",
        "Bosco",
        "Ange",
        "Patrick",
        "Clarisse",
      ];
      const lastNames = [
        "Nkurunziza",
        "Mugisha",
        "Umutoni",
        "Habimana",
        "Ishimwe",
        "Kanimba",
        "Rwigema",
        "Kayitesi",
        "Bizimana",
        "Tuyisenge",
      ];
      const headlines = [
        "Senior Cloud Engineer",
        "Frontend Architecture Specialist",
        "Full Stack Web Developer",
        "DevOps & Security Lead",
        "Technical Product Manager",
      ];
      const locations = [
        "Kigali, Rwanda",
        "Musanze, Rwanda",
        "Huye, Rwanda",
        "Remote",
        "Nairobi, Kenya",
      ];

      const resumeTemplates = [
        (name: string, title: string, loc: string, skills: string[]) => `
# ${name}
${title} | ${loc}

## Professional Summary
Experienced professional with a strong track record in software delivery and technical leadership. Specialized in building scalable systems using modern frameworks and cloud-native architectures.

## Core Expertise
${skills.map((s) => `- ${s}`).join("\n")}

## Professional Experience
### Senior Software Engineer | Global Tech Hub (2020 - Present)
- Led the migration of legacy monolith to microservices architecture.
- Improved system reliability by 40% through automated testing and CI/CD pipelines.
- Mentored junior developers and established code review standards.

### Full Stack Developer | Innovation Rwanda (2017 - 2020)
- Developed and maintained critical customer-facing web applications.
- Collaborated with design teams to implement accessible and performant UIs.
- Integrated multiple third-party APIs for payment and logistics.

## Education
- B.S. in Computer Science | University of Rwanda
- Advanced Certification in Distributed Systems
`,
      ];

      let generated = 0;
      for (let i = 0; i < input.count; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)]!;
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)]!;
        const name = `${firstName} ${lastName}`;
        const headline =
          headlines[Math.floor(Math.random() * headlines.length)]!;
        const location =
          locations[Math.floor(Math.random() * locations.length)]!;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Math.floor(Math.random() * 1000)}@example.com`;

        const template = resumeTemplates[0]!;
        const resumeText = template(name, headline, location, job.skills);

        const applicant = new Applicant({
          jobId: input.jobId,
          userId: ctx.session.user.id,
          firstName,
          lastName,
          name,
          email,
          headline,
          location,
          resumeText,
          status: "pending",
          skills: job.skills.map((s) => ({
            name: s,
            level: "Intermediate",
            yearsOfExperience: Math.floor(Math.random() * 5) + 2,
          })),
          experience: [
            {
              company: "Previous Tech Co",
              role: headline,
              startDate: "2020-01",
              description: "Developed various high-impact features.",
              technologies: job.techStack.slice(0, 3),
              isCurrent: true,
            },
          ],
          education: [
            {
              institution: "Local University",
              degree: "Bachelor's",
              fieldOfStudy: "Computer Science",
              startYear: 2013,
              endYear: 2017,
            },
          ],
          availability: { status: "Available", type: "Full-time" },
        });

        await applicant.save();
        generated++;

        // trigger ai screening in the background
        enqueueScreening({
          applicantId: applicant.id,
          jobId: job.id,
          triggeredByUserId: ctx.session.user.id,
        }).catch((err) =>
          console.error("Background AI screening enqueue failed:", err),
        );
      }

      await syncJobMetrics(input.jobId);
      return { success: true, count: generated };
    }),
});

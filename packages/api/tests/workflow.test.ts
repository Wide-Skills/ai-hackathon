import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Database Models
const applicantSaveMock = vi.fn();
const applicantFindByIdMock = vi.fn();
const applicantFindByIdAndUpdateMock = vi.fn();
const applicantCountDocumentsMock = vi.fn();

const jobFindByIdMock = vi.fn();
const jobFindByIdAndUpdateMock = vi.fn();

const screeningFindOneMock = vi.fn();
const screeningSaveMock = vi.fn();

const Applicant = Object.assign(
  vi.fn(function Applicant(this: any, input: any) {
    Object.assign(this, input);
    this.save = applicantSaveMock.mockImplementation(async () => {
      this.id = this._id?.toString() || new Types.ObjectId().toString();
      return this;
    });
    this.toObject = () => this;
  }),
  {
    findById: applicantFindByIdMock,
    findByIdAndUpdate: applicantFindByIdAndUpdateMock,
    countDocuments: applicantCountDocumentsMock,
  },
);

const Job = Object.assign(vi.fn(), {
  findById: jobFindByIdMock,
  findByIdAndUpdate: jobFindByIdAndUpdateMock,
});

const ScreeningResult = Object.assign(
  vi.fn(function ScreeningResult(this: any, input: any) {
    Object.assign(this, input);
    this.save = screeningSaveMock.mockResolvedValue(this);
    this.toObject = () => this;
  }),
  {
    findOne: screeningFindOneMock,
  },
);

// Mocks for External Services
vi.mock("@ai-hackathon/env/server", () => ({
  env: {
    GEMINI_API_KEY: "test-key",
    DATABASE_URL: "mongodb://localhost:27017/test",
  },
}));

vi.mock("@ai-hackathon/db", () => ({
  Applicant,
  Job,
  ScreeningResult,
}));

vi.mock("@ai-hackathon/auth/email", () => ({
  sendApplicationReceivedEmail: vi.fn().mockResolvedValue({ success: true }),
  sendScreeningCompletedEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock AI SDK
const aiOutput = {
  matchScore: 92,
  strengths: ["Expert TypeScript skills", "Deep architectural knowledge"],
  gaps: ["No direct experience with Rust"],
  recommendation: "Strongly Recommend",
  summary: "A top-tier candidate for the senior role.",
  skillBreakdown: [
    { skill: "TypeScript", score: 98 },
    { skill: "React", score: 95 },
  ],
  headline: "Senior Software Architect",
  bio: "Experienced engineer focused on distributed systems.",
  location: "Kigali, Rwanda",
  skills: [
    { name: "TypeScript", level: "Expert", yearsOfExperience: 8 },
    { name: "Node.js", level: "Expert", yearsOfExperience: 7 },
  ],
  experience: [
    {
      company: "Tech Corp",
      role: "Lead Engineer",
      startDate: "2020-01",
      endDate: "Present",
      description: "Leading the core platform team.",
      technologies: ["Node.js", "TypeScript"],
      isCurrent: true,
    },
  ],
  education: [
    {
      institution: "MIT",
      degree: "Bachelors",
      fieldOfStudy: "Computer Science",
      startYear: 2012,
      endYear: 2016,
    },
  ],
  languages: [{ name: "English", proficiency: "Native" }],
  certifications: [],
  projects: [
    {
      name: "Open Source DB",
      description: "A fast key-value store.",
      technologies: ["Go"],
      role: "Creator",
    },
  ],
};

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    output: aiOutput,
  }),
  Output: {
    object: vi.fn(),
  },
}));

// Import Routers
const { applicantRouter } = await import("../src/routers/applicant.router");
const { screeningRouter } = await import("../src/routers/screening.router");

// Auth Context
const authedContext = {
  session: {
    user: {
      id: "recruiter-1",
      email: "recruiter@umurava.com",
      name: "Senior Recruiter",
    },
  },
};

describe("End-to-End Recruitment Workflow", () => {
  const jobId = new Types.ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();

    jobFindByIdMock.mockResolvedValue({
      _id: jobId,
      title: "Senior Full Stack Engineer",
      description: "Build next-gen AI tools.",
      requirements: ["5+ years React", "Node.js mastery"],
      skills: ["React", "Node.js", "TypeScript"],
      toObject() { return this; }
    });

    applicantCountDocumentsMock.mockResolvedValue(1);
    applicantFindByIdAndUpdateMock.mockResolvedValue({});
  });

  it("Full Ingestion Path: Recruiter uploads resume -> AI processes -> Profile Created", async () => {
    const caller = applicantRouter.createCaller(authedContext as any);

    const result = await caller.ingestFromResume({
      jobId,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      resumeText: "Experienced React and Node.js developer from Kigali...",
    });

    // Verify AI was called with the right data
    expect(result.firstName).toBe("Jane");
    expect(result.status).toBe("shortlisted"); // 92 score >= 85
    expect(result.screening?.matchScore).toBe(92);
    
    // Verify Profile Extraction worked
    expect(result.headline).toBe("Senior Software Architect");
    expect(result.location).toBe("Kigali, Rwanda");
    expect(result.skills).toHaveLength(2);
    expect(result.experience[0].company).toBe("Tech Corp");

    // Verify Persistence
    expect(applicantSaveMock).toHaveBeenCalled();
    expect(screeningSaveMock).toHaveBeenCalled();
    expect(jobFindByIdAndUpdateMock).toHaveBeenCalled(); // For syncing metrics
  });

  it("Manual Trigger Path: Recruiter re-runs AI analysis on existing applicant", async () => {
    const applicantId = new Types.ObjectId().toString();
    applicantFindByIdMock.mockResolvedValue({
      _id: applicantId,
      jobId,
      firstName: "Jane",
      lastName: "Doe",
      resumeText: "Updated resume content...",
      skills: [],
    });

    const caller = screeningRouter.createCaller(authedContext as any);

    const result = await caller.generate({
      applicantId,
      jobId,
    });

    expect(result.matchScore).toBe(92);
    expect(applicantFindByIdAndUpdateMock).toHaveBeenCalledWith(
      applicantId,
      expect.objectContaining({
        status: "shortlisted"
      })
    );
  });

  it("Batch Ingestion Path: Recruiter imports CSV -> Applicants created -> AI triggered", async () => {
    const caller = applicantRouter.createCaller(authedContext as any);

    const result = await caller.ingestBatch({
      jobId,
      candidates: [
        {
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          resumeText: "Alice's resume text...",
        },
        {
          firstName: "Bob",
          lastName: "Jones",
          email: "bob@example.com",
          resumeText: "Bob's resume text...",
        }
      ],
    });

    expect(result.successCount).toBe(2);
    expect(applicantSaveMock).toHaveBeenCalledTimes(2);
    
    // In batch, AI runs in background (non-blocking)
    // We expect the syncJobMetrics to have been called
    expect(jobFindByIdAndUpdateMock).toHaveBeenCalled();
  });

  it("Public Path: Candidate applies directly -> Auto-screening triggered", async () => {
    const caller = applicantRouter.createCaller({ session: null } as any);

    const result = await caller.publicApply({
      jobId,
      firstName: "John",
      lastName: "Public",
      email: "john@public.com",
      resumeText: "My public application resume...",
    });

    expect(result.firstName).toBe("John");
    expect(applicantSaveMock).toHaveBeenCalled();
    // Since we mock generateText to return valid data, publicApply should have processed it
    expect(result.status).toBe("shortlisted");
    expect(screeningSaveMock).toHaveBeenCalled();
  });
});

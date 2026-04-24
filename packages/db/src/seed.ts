import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { env } from "@ai-hackathon/env/server";
import { DEMO_RECRUITER } from "@ai-hackathon/shared";
import mongoose from "mongoose";
import { Applicant } from "./models/applicant.model";
import { Account, Session, User, Verification } from "./models/auth.model";
import { Job } from "./models/job.model";
import { ScreeningResult } from "./models/screening.model";

const recruiterSeedUsers = [
  {
    id: "usr-system",
    name: "TalentAI System",
    email: "system@talentai.local",
    image:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=100",
    password: "SystemSeed123!",
  },
  {
    id: DEMO_RECRUITER.id,
    name: DEMO_RECRUITER.name,
    email: DEMO_RECRUITER.email,
    image:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100",
    password: DEMO_RECRUITER.password,
  },
  {
    id: "usr-recruiter-a",
    name: "Diane Uwase",
    email: "diane@talentai.africa",
    image:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=100",
    password: "Recruiter123!",
  },
  {
    id: "usr-recruiter-b",
    name: "Samuel Kibet",
    email: "samuel@talentai.africa",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100",
    password: "Recruiter123!",
  },
  {
    id: "usr-recruiter-c",
    name: "Amina Diallo",
    email: "amina@talentai.africa",
    image:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=100",
    password: "Recruiter123!",
  },
] as const;

function toDate(value: string) {
  return new Date(value);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password.normalize("NFKC"), salt, 64, {
    N: 16384,
    r: 16,
    p: 1,
    maxmem: 128 * 16384 * 16 * 2,
  }).toString("hex");
  return `${salt}:${hash}`;
}

function plusDays(value: string, days: number) {
  const date = new Date(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

const mockJobs = [
  {
    id: "job-1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Kigali, Rwanda",
    type: "Full-time",
    description:
      "We are seeking a Senior Backend Engineer to build scalable APIs and AI-powered services.",
    requirements: [
      "5+ years Node.js",
      "REST/GraphQL APIs",
      "MongoDB/PostgreSQL",
      "Cloud (AWS/GCP)",
    ],
    skills: ["Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
    salaryMin: 4000,
    salaryMax: 7000,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-01",
    closingDate: "2026-05-01",
    applicantsCount: 24,
    screenedCount: 18,
    shortlistedCount: 5,
  },
  {
    id: "job-2",
    title: "AI/ML Engineer",
    department: "AI Research",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our AI team to build intelligent screening and ranking models using Gemini.",
    requirements: [
      "Python proficiency",
      "LLM experience",
      "MLOps",
      "Data pipelines",
    ],
    skills: ["Python", "TensorFlow", "Gemini API", "MLflow", "FastAPI"],
    salaryMin: 5000,
    salaryMax: 9000,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-03",
    closingDate: "2026-05-10",
    applicantsCount: 31,
    screenedCount: 25,
    shortlistedCount: 7,
  },
  {
    id: "job-3",
    title: "Frontend Engineer",
    department: "Product",
    location: "Nairobi, Kenya",
    type: "Full-time",
    description:
      "Build stunning, performant UIs for our recruitment platform using Next.js.",
    requirements: [
      "React/Next.js expertise",
      "TypeScript",
      "Tailwind CSS",
      "State management",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
    salaryMin: 3500,
    salaryMax: 6000,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-05",
    closingDate: "2026-04-30",
    applicantsCount: 42,
    screenedCount: 38,
    shortlistedCount: 9,
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Contract",
    description:
      "Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.",
    requirements: ["Kubernetes", "Terraform", "CI/CD", "Linux administration"],
    skills: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "AWS"],
    salaryMin: 4500,
    salaryMax: 7500,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-06",
    applicantsCount: 17,
    screenedCount: 12,
    shortlistedCount: 3,
  },
  {
    id: "job-5",
    title: "Product Designer",
    department: "Design",
    location: "Lagos, Nigeria",
    type: "Full-time",
    description:
      "Design intuitive, accessible experiences for our AI recruitment platform.",
    requirements: [
      "Figma proficiency",
      "Design systems",
      "User research",
      "Prototyping",
    ],
    skills: [
      "Figma",
      "Framer",
      "User Research",
      "Design Systems",
      "Prototyping",
    ],
    salaryMin: 3000,
    salaryMax: 5500,
    currency: "USD",
    status: "draft",
    createdAt: "2026-04-08",
    applicantsCount: 0,
    screenedCount: 0,
    shortlistedCount: 0,
  },
  {
    id: "job-6",
    title: "Data Engineer",
    department: "Data",
    location: "Remote",
    type: "Full-time",
    description:
      "Build and maintain data pipelines for our analytics and AI training datasets.",
    requirements: ["Apache Spark", "dbt", "SQL mastery", "Python"],
    skills: ["Python", "Spark", "dbt", "Airflow", "BigQuery"],
    salaryMin: 4000,
    salaryMax: 6500,
    currency: "USD",
    status: "closed",
    createdAt: "2026-03-15",
    closingDate: "2026-04-05",
    applicantsCount: 28,
    screenedCount: 28,
    shortlistedCount: 4,
  },
];

const mockApplicants = [
  {
    id: "app-1",
    firstName: "Amara",
    lastName: "Osei",
    email: "amara.osei@email.com",
    headline: "Senior Backend Engineer – Node.js & AI Systems",
    bio: "Passionate backend engineer with 6 years of experience building scalable APIs and integrating AI models into production systems.",
    location: "Accra, Ghana",
    appliedAt: "2026-04-10",
    status: "shortlisted",
    jobId: "job-1",
    avatarUrl:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100",
    skills: [
      { name: "Node.js", level: "Expert", yearsOfExperience: 6 },
      { name: "TypeScript", level: "Expert", yearsOfExperience: 5 },
      { name: "MongoDB", level: "Advanced", yearsOfExperience: 4 },
      { name: "AWS", level: "Advanced", yearsOfExperience: 3 },
      { name: "Docker", level: "Intermediate", yearsOfExperience: 3 },
      { name: "GraphQL", level: "Advanced", yearsOfExperience: 3 },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "French", proficiency: "Conversational" },
    ],
    experience: [
      {
        company: "Andela",
        role: "Senior Backend Engineer",
        startDate: "2022-03",
        endDate: "Present",
        description:
          "Led backend architecture for 3 enterprise clients, built real-time APIs serving 50k+ users.",
        technologies: [
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "Redis",
          "Kubernetes",
        ],
        isCurrent: true,
      },
      {
        company: "Flutterwave",
        role: "Backend Engineer",
        startDate: "2020-01",
        endDate: "2022-02",
        description:
          "Developed payment processing microservices handling $2M+ daily transactions.",
        technologies: ["Node.js", "MongoDB", "RabbitMQ", "Docker"],
        isCurrent: false,
      },
    ],
    education: [
      {
        institution: "University of Ghana",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Science",
        startYear: 2015,
        endYear: 2019,
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon",
        issueDate: "2023-06",
      },
      {
        name: "MongoDB Professional",
        issuer: "MongoDB Inc.",
        issueDate: "2022-03",
      },
    ],
    projects: [
      {
        name: "AI Recruitment API",
        description:
          "Built a REST API integrating Gemini for automated candidate screening",
        technologies: ["Node.js", "Gemini API", "MongoDB"],
        role: "Lead Engineer",
        link: "https://github.com/amara/ai-recruit",
        startDate: "2024-01",
        endDate: "2024-06",
      },
    ],
    availability: {
      status: "Available",
      type: "Full-time",
      startDate: "2026-05-01",
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/amara-osei",
      github: "https://github.com/amaraosei",
    },
    screening: {
      matchScore: 92,
      strengths: [
        "Deep Node.js expertise",
        "Strong AWS experience",
        "AI integration background",
        "Proven at scale",
      ],
      gaps: ["Limited Kubernetes production experience", "No GraphQL at scale"],
      recommendation: "Strongly Recommend",
      summary:
        "Amara is an exceptional match for this role. Her 6 years of Node.js experience combined with AI integration work directly aligns with our requirements.",
      skillBreakdown: [
        { skill: "Node.js", score: 95 },
        { skill: "TypeScript", score: 90 },
        { skill: "MongoDB", score: 88 },
        { skill: "AWS", score: 82 },
        { skill: "Docker", score: 75 },
      ],
    },
  },
  {
    id: "app-2",
    firstName: "Kwame",
    lastName: "Mensah",
    email: "kwame.mensah@email.com",
    headline: "Full-Stack Engineer – React & Node.js",
    location: "Kumasi, Ghana",
    appliedAt: "2026-04-09",
    status: "screening",
    jobId: "job-1",
    avatarUrl:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100",
    skills: [
      { name: "Node.js", level: "Advanced", yearsOfExperience: 4 },
      { name: "React", level: "Expert", yearsOfExperience: 5 },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 4 },
      { name: "Docker", level: "Intermediate", yearsOfExperience: 2 },
    ],
    languages: [{ name: "English", proficiency: "Native" }],
    experience: [
      {
        company: "Paystack",
        role: "Full-Stack Engineer",
        startDate: "2021-06",
        endDate: "Present",
        description:
          "Built merchant dashboard and payment APIs for 200k+ businesses.",
        technologies: ["React", "Node.js", "PostgreSQL"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "KNUST",
        degree: "Bachelor's",
        fieldOfStudy: "Software Engineering",
        startYear: 2016,
        endYear: 2020,
      },
    ],
    certifications: [],
    projects: [
      {
        name: "Merchant Dashboard",
        description:
          "Built merchant dashboard and payment APIs for 200k+ businesses.",
        technologies: ["React", "Node.js", "PostgreSQL"],
        role: "Full-Stack Engineer",
        link: "https://github.com/kwame/merchant-dash",
      },
    ],
    availability: { status: "Open to Opportunities", type: "Full-time" },
    socialLinks: { github: "https://github.com/kwamemensah" },
    screening: {
      matchScore: 78,
      strengths: [
        "Strong PostgreSQL skills",
        "Payment systems experience",
        "Full-stack capability",
      ],
      gaps: [
        "Limited AWS experience",
        "No AI/ML integration",
        "Less backend specialization",
      ],
      recommendation: "Recommend",
      summary:
        "Kwame brings solid full-stack experience but lacks the backend depth and AI integration experience the role demands.",
      skillBreakdown: [
        { skill: "Node.js", score: 78 },
        { skill: "TypeScript", score: 70 },
        { skill: "MongoDB", score: 60 },
        { skill: "AWS", score: 45 },
        { skill: "Docker", score: 65 },
      ],
    },
  },
  {
    id: "app-3",
    firstName: "Fatima",
    lastName: "Al-Hassan",
    email: "fatima.alhassan@email.com",
    headline: "AI/ML Engineer – LLMs & Generative AI",
    location: "Cairo, Egypt",
    appliedAt: "2026-04-08",
    status: "shortlisted",
    jobId: "job-2",
    avatarUrl:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100",
    skills: [
      { name: "Python", level: "Expert", yearsOfExperience: 7 },
      { name: "TensorFlow", level: "Advanced", yearsOfExperience: 4 },
      { name: "Gemini API", level: "Advanced", yearsOfExperience: 2 },
      { name: "FastAPI", level: "Advanced", yearsOfExperience: 3 },
      { name: "MLflow", level: "Intermediate", yearsOfExperience: 2 },
    ],
    languages: [
      { name: "Arabic", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" },
    ],
    experience: [
      {
        company: "Google",
        role: "ML Engineer",
        startDate: "2021-09",
        endDate: "Present",
        description:
          "Built and deployed LLM-based applications for enterprise search and classification.",
        technologies: ["Python", "TensorFlow", "Vertex AI", "Gemini"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Cairo University",
        degree: "Master's",
        fieldOfStudy: "Artificial Intelligence",
        startYear: 2018,
        endYear: 2020,
      },
    ],
    certifications: [
      {
        name: "Google Cloud Professional ML Engineer",
        issuer: "Google",
        issueDate: "2023-01",
      },
    ],
    projects: [
      {
        name: "Vertex AI Search",
        description:
          "Built and deployed LLM-based applications for enterprise search.",
        technologies: ["Python", "TensorFlow", "Vertex AI"],
        role: "ML Engineer",
      },
    ],
    availability: {
      status: "Open to Opportunities",
      type: "Full-time",
      startDate: "2026-06-01",
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/fatima-alhassan",
      github: "https://github.com/fatimaalhassan",
    },
    screening: {
      matchScore: 96,
      strengths: [
        "Direct Gemini API experience",
        "Google ML background",
        "Strong Python mastery",
        "MLOps knowledge",
      ],
      gaps: ["Limited startup environment exposure"],
      recommendation: "Strongly Recommend",
      summary:
        "Fatima is an outstanding candidate with direct experience at Google on LLM systems. Her Gemini API expertise is exactly what we need.",
      skillBreakdown: [
        { skill: "Python", score: 98 },
        { skill: "TensorFlow", score: 92 },
        { skill: "Gemini API", score: 95 },
        { skill: "MLflow", score: 85 },
        { skill: "FastAPI", score: 88 },
      ],
    },
  },
  {
    id: "app-4",
    firstName: "Chidi",
    lastName: "Nwosu",
    email: "chidi.nwosu@email.com",
    headline: "Frontend Engineer – Next.js & Design Systems",
    location: "Lagos, Nigeria",
    appliedAt: "2026-04-11",
    status: "pending",
    jobId: "job-3",
    skills: [
      { name: "React", level: "Expert", yearsOfExperience: 5 },
      { name: "Next.js", level: "Expert", yearsOfExperience: 3 },
      { name: "TypeScript", level: "Advanced", yearsOfExperience: 4 },
      { name: "Tailwind CSS", level: "Expert", yearsOfExperience: 3 },
      { name: "Redux", level: "Advanced", yearsOfExperience: 3 },
    ],
    languages: [{ name: "English", proficiency: "Native" }],
    experience: [
      {
        company: "Cowrywise",
        role: "Senior Frontend Engineer",
        startDate: "2022-01",
        endDate: "Present",
        description:
          "Led frontend team building investment platform for 500k+ users.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Redux"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "University of Lagos",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Engineering",
        startYear: 2016,
        endYear: 2020,
      },
    ],
    certifications: [],
    projects: [
      {
        name: "Cowrywise Design System",
        description:
          "Led frontend team building investment platform design system.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
        role: "Senior Frontend Engineer",
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    socialLinks: {
      github: "https://github.com/chidinwosu",
      portfolio: "https://chidi.dev",
    },
    screening: {
      matchScore: 89,
      strengths: [
        "Expert Next.js skills",
        "Strong TypeScript",
        "Design systems experience",
        "Fintech background",
      ],
      gaps: ["Limited testing coverage", "No SSR optimization at scale"],
      recommendation: "Strongly Recommend",
      summary:
        "Chidi is a strong frontend candidate with proven experience building large-scale applications with the exact tech stack we use.",
      skillBreakdown: [
        { skill: "React", score: 92 },
        { skill: "Next.js", score: 90 },
        { skill: "TypeScript", score: 88 },
        { skill: "Tailwind CSS", score: 95 },
        { skill: "Redux", score: 85 },
      ],
    },
  },
  {
    id: "app-5",
    firstName: "Aisha",
    lastName: "Kamara",
    email: "aisha.kamara@email.com",
    headline: "DevOps Engineer – Kubernetes & Cloud Infrastructure",
    location: "Freetown, Sierra Leone",
    appliedAt: "2026-04-07",
    status: "rejected",
    jobId: "job-4",
    skills: [
      { name: "Kubernetes", level: "Intermediate", yearsOfExperience: 2 },
      { name: "Docker", level: "Advanced", yearsOfExperience: 3 },
      { name: "Terraform", level: "Beginner", yearsOfExperience: 1 },
      { name: "AWS", level: "Intermediate", yearsOfExperience: 2 },
    ],
    languages: [{ name: "English", proficiency: "Native" }],
    experience: [
      {
        company: "Orange Digital Center",
        role: "Junior DevOps Engineer",
        startDate: "2023-06",
        endDate: "Present",
        description: "Managed CI/CD pipelines and containerized deployments.",
        technologies: ["Docker", "GitHub Actions", "AWS EC2"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Fourah Bay College",
        degree: "Bachelor's",
        fieldOfStudy: "Information Technology",
        startYear: 2018,
        endYear: 2022,
      },
    ],
    certifications: [],
    projects: [
      {
        name: "CI/CD Pipeline Automation",
        description: "Managed CI/CD pipelines and containerized deployments.",
        technologies: ["Docker", "GitHub Actions", "AWS EC2"],
        role: "Junior DevOps Engineer",
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    socialLinks: {},
    screening: {
      matchScore: 54,
      strengths: ["Docker experience", "CI/CD pipelines", "AWS familiarity"],
      gaps: [
        "Insufficient Kubernetes depth",
        "No Terraform production experience",
        "Limited cloud scale experience",
      ],
      recommendation: "Not Recommended",
      summary:
        "Aisha shows potential but lacks the senior-level DevOps experience required for this role. We recommend revisiting in 18-24 months.",
      skillBreakdown: [
        { skill: "Kubernetes", score: 55 },
        { skill: "Docker", score: 72 },
        { skill: "Terraform", score: 35 },
        { skill: "GitHub Actions", score: 68 },
        { skill: "AWS", score: 58 },
      ],
    },
  },
  {
    id: "app-6",
    firstName: "Emmanuel",
    lastName: "Diallo",
    email: "emmanuel.diallo@email.com",
    headline: "Backend Engineer – Python & Microservices",
    location: "Dakar, Senegal",
    appliedAt: "2026-04-12",
    status: "screening",
    jobId: "job-1",
    skills: [
      { name: "Python", level: "Advanced", yearsOfExperience: 5 },
      { name: "FastAPI", level: "Advanced", yearsOfExperience: 3 },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 4 },
      { name: "Docker", level: "Advanced", yearsOfExperience: 3 },
      { name: "Node.js", level: "Intermediate", yearsOfExperience: 2 },
    ],
    languages: [
      { name: "French", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" },
      { name: "Wolof", proficiency: "Native" },
    ],
    experience: [
      {
        company: "Wave Mobile Money",
        role: "Backend Engineer",
        startDate: "2022-08",
        endDate: "Present",
        description:
          "Built microservices for mobile money platform serving West Africa.",
        technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Kafka"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Ecole Polytechnique de Thiès",
        degree: "Master's",
        fieldOfStudy: "Computer Science",
        startYear: 2017,
        endYear: 2022,
      },
    ],
    certifications: [],
    projects: [
      {
        name: "Mobile Money Microservices",
        description:
          "Built microservices for mobile money platform serving West Africa.",
        technologies: ["Python", "FastAPI", "PostgreSQL"],
        role: "Backend Engineer",
      },
    ],
    availability: { status: "Open to Opportunities", type: "Full-time" },
    socialLinks: { linkedin: "https://linkedin.com/in/emmanueldiallo" },
    screening: {
      matchScore: 71,
      strengths: [
        "Fintech microservices experience",
        "Strong PostgreSQL",
        "High-scale systems",
      ],
      gaps: [
        "Primary language is Python not Node.js",
        "Limited MongoDB experience",
        "No AWS certification",
      ],
      recommendation: "Consider",
      summary:
        "Emmanuel brings strong backend fundamentals but the tech stack mismatch (Python vs Node.js) is a concern for this specific role.",
      skillBreakdown: [
        { skill: "Node.js", score: 60 },
        { skill: "TypeScript", score: 55 },
        { skill: "MongoDB", score: 45 },
        { skill: "AWS", score: 50 },
        { skill: "Docker", score: 80 },
      ],
    },
  },
];

async function seed() {
  try {
    console.log("Connecting to database...");
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(env.DATABASE_URL);
    }
    console.log("Connected to database.");

    console.log("Clearing existing seeded data...");
    await Session.deleteMany({});
    await Account.deleteMany({});
    await Verification.deleteMany({});
    await ScreeningResult.deleteMany({});
    await Applicant.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data.");

    console.log("Creating auth users, accounts, and sessions...");
    const candidateSeedUsers = mockApplicants.map((applicant) => ({
      id: `usr-${applicant.id}`,
      name: `${applicant.firstName} ${applicant.lastName}`,
      email: applicant.email,
      image: applicant.avatarUrl,
      password: "Candidate123!",
      createdAt: toDate(applicant.appliedAt),
    }));

    const authUsers = [
      ...recruiterSeedUsers.map((user, index) => ({
        ...user,
        createdAt: plusDays("2026-03-01", index * 2),
      })),
      ...candidateSeedUsers,
    ];

    await User.insertMany(
      authUsers.map((user) => ({
        _id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: true,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.createdAt,
      })),
    );

    await Account.insertMany(
      authUsers.map((user) => ({
        _id: `acc-${user.id}`,
        accountId: user.email,
        providerId: "credential",
        userId: user.id,
        password: hashPassword(user.password),
        createdAt: user.createdAt,
        updatedAt: user.createdAt,
      })),
    );

    const recruiterSessions = recruiterSeedUsers.map((user, index) => ({
      _id: `ses-${user.id}`,
      token: randomUUID(),
      expiresAt: plusDays("2026-05-01", 30 + index),
      createdAt: plusDays("2026-04-12", index),
      updatedAt: plusDays("2026-04-12", index),
      ipAddress: `10.0.0.${index + 10}`,
      userAgent: "seed-script/recruiter-session",
      userId: user.id,
    }));

    await Session.insertMany(recruiterSessions);
    console.log(
      `Created ${authUsers.length} users, ${authUsers.length} accounts, and ${recruiterSessions.length} recruiter sessions.`,
    );

    console.log("Creating jobs...");
    const recruiterOwners = recruiterSeedUsers.filter(
      (user) => user.id !== "usr-system",
    );
    const jobMapping: Record<string, string> = {};

    for (const [index, mockJob] of mockJobs.entries()) {
      const {
        id,
        applicantsCount,
        screenedCount,
        shortlistedCount,
        ...jobData
      } = mockJob;
      const owner = recruiterOwners[index % recruiterOwners.length];
      if (!owner) {
        throw new Error(
          "No recruiter owner available for seeded job creation.",
        );
      }
      const job = await Job.create({
        ...jobData,
        createdByUserId: owner.id,
        createdAt: toDate(mockJob.createdAt),
        updatedAt: toDate(mockJob.createdAt),
        applicantsCount: 0,
        screenedCount: 0,
        shortlistedCount: 0,
      });
      jobMapping[id] = job._id.toString();
    }
    console.log(`Inserted ${mockJobs.length} jobs with recruiter ownership.`);

    console.log("Creating applicants and screening relationships...");
    const applicantStats = new Map<
      string,
      {
        applicantsCount: number;
        screenedCount: number;
        shortlistedCount: number;
      }
    >();

    for (const mockJob of mockJobs) {
      applicantStats.set(jobMapping[mockJob.id]!, {
        applicantsCount: 0,
        screenedCount: 0,
        shortlistedCount: 0,
      });
    }

    for (const mockApplicant of mockApplicants) {
      const { id, jobId, screening, ...applicantData } = mockApplicant;
      const realJobId = jobMapping[jobId];

      if (!realJobId) {
        console.warn(
          `Job ID ${jobId} not found for applicant ${mockApplicant.firstName}`,
        );
        continue;
      }

      const applicantUserId = `usr-${id}`;
      const appliedAt = toDate(mockApplicant.appliedAt);

      const applicant = await Applicant.create({
        ...applicantData,
        screening,
        name: `${mockApplicant.firstName} ${mockApplicant.lastName}`,
        jobId: realJobId,
        userId: applicantUserId,
        createdAt: appliedAt,
        updatedAt: appliedAt,
      });

      const stats = applicantStats.get(realJobId);
      if (stats) {
        stats.applicantsCount += 1;
        if (screening) {
          stats.screenedCount += 1;
        }
        if (
          mockApplicant.status === "shortlisted" ||
          mockApplicant.status === "hired"
        ) {
          stats.shortlistedCount += 1;
        }
      }

      if (screening) {
        await ScreeningResult.create({
          applicantId: applicant._id,
          jobId: realJobId,
          createdByUserId: "usr-system",
          matchScore: screening.matchScore,
          strengths: screening.strengths,
          gaps: screening.gaps,
          recommendation: screening.recommendation,
          createdAt: appliedAt,
          updatedAt: appliedAt,
        });
      }
    }

    for (const [jobObjectId, stats] of applicantStats.entries()) {
      await Job.findByIdAndUpdate(jobObjectId, {
        applicantsCount: stats.applicantsCount,
        screenedCount: stats.screenedCount,
        shortlistedCount: stats.shortlistedCount,
      });
    }

    console.log(`Inserted ${mockApplicants.length} applicants.`);
    console.log("Created linked screening records and refreshed job counters.");
    console.log("Seeded login credentials:");
    console.log(`  Demo recruiter: ${DEMO_RECRUITER.email}`);
    console.log("  Auth method: magic link, Google, or GitHub");
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();

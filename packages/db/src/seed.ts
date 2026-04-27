import { randomBytes, scryptSync } from "node:crypto";
import { env } from "@ai-hackathon/env/server";
import mongoose from "mongoose";
import { Applicant } from "./models/applicant.model";
import { Job } from "./models/job.model";
import { ScreeningResult } from "./models/screening.model";

const recruiterSeedUsers = [
  {
    id: "usr-recruiter",
    name: "Saddy Nkurunziza",
    email: "saddynkurunziza8@gmail.com",
    image: "https://i.pravatar.cc/150?u=saddy",
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
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Kigali, Rwanda",
    type: "Full-time",
    description:
      "Join Irembo's core engineering team to build high-performance public services. You will be responsible for technical architecture, mentoring junior devs, and ensuring 99.9% uptime for critical national infrastructure.",
    requirements: [
      "Expertise in Node.js and TypeScript",
      "Proven experience with React and Next.js",
      "Deep understanding of PostgreSQL and Redis",
      "Experience with Kubernetes in production",
    ],
    skills: ["Node.js", "TypeScript", "React", "PostgreSQL", "Docker"],
    salaryMin: 4500,
    salaryMax: 8000,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-01",
    closingDate: "2026-05-15",
  },
  {
    id: "job-2",
    title: "AI Product Designer",
    department: "Design",
    location: "Kigali (On-site)",
    type: "Full-time",
    description:
      "Mara is looking for a Product Designer who lives and breathes AI-driven interfaces. You will lead the design system for our next-gen fintech suite, focusing on high-fidelity user experiences and intuitive data viz.",
    requirements: [
      "Portfolio showcasing B2B SaaS products",
      "Expert Figma and Framer skills",
      "Strong understanding of design systems",
      "Experience designing for complex data states",
    ],
    skills: ["Figma", "Design Systems", "UX Research", "Prototyping"],
    salaryMin: 3000,
    salaryMax: 5500,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-05",
    closingDate: "2026-05-10",
  },
  {
    id: "job-3",
    title: "Cloud Infrastructure Lead",
    department: "Platform",
    location: "Remote (Rwanda TZ)",
    type: "Contract",
    description:
      "Manage and scale BK Group's digital banking infrastructure. We are moving towards a fully automated cloud-native stack and need an expert to lead the transition.",
    requirements: [
      "Advanced AWS or Azure certifications",
      "Expertise in Terraform and Ansible",
      "Strong background in FinTech security",
      "Experience managing massive data migrations",
    ],
    skills: ["AWS", "Terraform", "Kubernetes", "Security", "Python"],
    salaryMin: 5000,
    salaryMax: 9000,
    currency: "USD",
    status: "active",
    createdAt: "2026-04-08",
    closingDate: "2026-05-20",
  },
];

const mockApplicants = [
  {
    id: "app-1",
    firstName: "Marie-Claire",
    lastName: "Mugisha",
    email: "marie.claire@irembo.gov.rw",
    headline: "Senior Backend Specialist | Ex-Andela | Node.js Expert",
    bio: "Technical lead with 7 years of experience in the East African tech ecosystem. Focused on building highly available microservices and strategic AI integration.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-12",
    status: "shortlisted",
    jobId: "job-1",
    avatarUrl: "https://i.pravatar.cc/150?u=marie",
    skills: [
      { name: "Node.js", level: "Expert", yearsOfExperience: 7 },
      { name: "TypeScript", level: "Expert", yearsOfExperience: 5 },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 6 },
      { name: "Docker", level: "Advanced", yearsOfExperience: 4 },
      { name: "GraphQL", level: "Intermediate", yearsOfExperience: 2 },
    ],
    languages: [
      { name: "Kinyarwanda", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" },
      { name: "French", proficiency: "Fluent" },
    ],
    experience: [
      {
        company: "Irembo",
        role: "Senior Backend Engineer",
        startDate: "2021-01",
        endDate: "Present",
        description:
          "Leading the core services team, maintaining 50+ government endpoints with zero downtime.",
        technologies: ["Node.js", "TypeScript", "PostgreSQL", "Redis"],
        isCurrent: true,
      },
      {
        company: "Andela Rwanda",
        role: "Software Engineer",
        startDate: "2018-06",
        endDate: "2020-12",
        description:
          "Developed large-scale APIs for international clients in the healthcare and logistics sectors.",
        technologies: ["JavaScript", "Express", "MongoDB"],
        isCurrent: false,
      },
    ],
    education: [
      {
        institution: "Carnegie Mellon University Africa",
        degree: "Master's",
        fieldOfStudy: "Information Technology",
        startYear: 2016,
        endYear: 2018,
      },
    ],
    certifications: [
      {
        name: "AWS Solutions Architect",
        issuer: "Amazon",
        issueDate: "2023-05",
      },
    ],
    projects: [
      {
        name: "GovTech Gateway",
        description:
          "A centralized auth provider for all Rwandan public services.",
        technologies: ["OAuth 2.0", "Node.js", "Redis"],
        role: "Lead Architect",
        startDate: "2023-01",
        endDate: "2023-12",
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 94,
      scoreBreakdown: {
        technicalSkills: 98,
        experience: 92,
        education: 95,
        culturalFit: 88,
      },
      strengths: [
        "Deep local ecosystem context",
        "Exceptional Node.js architectural skills",
        "Top-tier education (CMU Africa)",
        "Proven experience with scale",
      ],
      gaps: ["Limited frontend experience for full-stack role"],
      recommendation: "Strongly Recommend",
      summary:
        "Marie-Claire is a phenomenal match. Her background at Irembo and academic rigor from CMU Africa makes her a high-authority candidate for this senior position.",
      skillBreakdown: [
        { skill: "Node.js", score: 98 },
        { skill: "TypeScript", score: 92 },
        { skill: "Architecture", score: 95 },
        { skill: "Leadership", score: 88 },
      ],
    },
  },
  {
    id: "app-2",
    firstName: "Samuel",
    lastName: "Kwizera",
    email: "samuel.k@ampersand.solar",
    headline: "Product Designer | Focus on Clean Tech & Mobility",
    bio: "User-centric designer with a focus on sustainable technology and streamlined logistics interfaces. Expert in Figma and collaborative research.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-14",
    status: "screening",
    jobId: "job-2",
    avatarUrl: "https://i.pravatar.cc/150?u=samuel",
    skills: [
      { name: "Figma", level: "Expert", yearsOfExperience: 5 },
      { name: "Prototyping", level: "Advanced", yearsOfExperience: 4 },
      { name: "User Research", level: "Advanced", yearsOfExperience: 3 },
    ],
    languages: [
      { name: "Kinyarwanda", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" },
    ],
    experience: [
      {
        company: "Ampersand",
        role: "Senior UX Designer",
        startDate: "2020-03",
        endDate: "Present",
        description:
          "Designing the driver dashboard and battery swapping management interface.",
        technologies: ["Figma", "User Interviews", "Flutter"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "African Leadership University",
        degree: "Bachelor's",
        fieldOfStudy: "Computing",
        startYear: 2016,
        endYear: 2020,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    socialLinks: { portfolio: "https://samuel.design" },
    screening: {
      matchScore: 82,
      scoreBreakdown: {
        technicalSkills: 85,
        experience: 80,
        education: 75,
        culturalFit: 88,
      },
      strengths: [
        "Strong B2B SaaS background",
        "Expert Figma skills",
        "Context with Rwandan tech startups",
      ],
      gaps: ["No direct AI/LLM interface experience", "Limited Framer skills"],
      recommendation: "Recommend",
      summary:
        "Samuel brings great operational design experience. While he lacks specific AI exposure, his work at Ampersand shows he can handle complex logistical interfaces.",
      skillBreakdown: [
        { skill: "Figma", score: 95 },
        { skill: "Systems", score: 80 },
        { skill: "UI Detail", score: 85 },
        { skill: "Strategy", score: 70 },
      ],
    },
  },
  {
    id: "app-3",
    firstName: "Aline",
    lastName: "Umutoni",
    email: "aline.umutoni@bk.rw",
    headline: "Cloud & DevSecOps Engineer | Security Advocate",
    bio: "Passionate Cloud Engineer specialized in automating infrastructure and enforcing security protocols within the Rwandan banking sector.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-15",
    status: "shortlisted",
    jobId: "job-3",
    avatarUrl: "https://i.pravatar.cc/150?u=aline",
    skills: [
      { name: "AWS", level: "Advanced", yearsOfExperience: 4 },
      { name: "Terraform", level: "Expert", yearsOfExperience: 3 },
      { name: "Kubernetes", level: "Advanced", yearsOfExperience: 3 },
    ],
    experience: [
      {
        company: "BK Group",
        role: "DevOps Engineer",
        startDate: "2021-08",
        endDate: "Present",
        description: "Automating cloud provisioning for digital banking apps.",
        technologies: ["AWS", "Terraform", "Jenkins"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Engineering",
        startYear: 2015,
        endYear: 2019,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 91,
      scoreBreakdown: {
        technicalSkills: 94,
        experience: 88,
        education: 85,
        culturalFit: 92,
      },
      strengths: [
        "Direct FinTech experience in Rwanda",
        "Expert-level Terraform skills",
        "Strong security mindset",
      ],
      gaps: ["Limited experience with Azure or GCP"],
      recommendation: "Strongly Recommend",
      summary:
        "Aline is a top-tier infrastructure candidate. Her current work at Bank of Kigali ensures she understands the exact regulatory and technical environment we operate in.",
      skillBreakdown: [
        { skill: "Cloud", score: 90 },
        { skill: "Automation", score: 95 },
        { skill: "Security", score: 88 },
        { skill: "Reliability", score: 92 },
      ],
    },
  },
  {
    id: "app-4",
    firstName: "Jean-Claude",
    lastName: "Habimana",
    email: "jc.habimana@gmail.com",
    headline: "Full-Stack Developer | React & Node.js",
    bio: "Middle-level developer with 4 years of experience building web applications for local startups.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-16",
    status: "pending",
    jobId: "job-1",
    avatarUrl: "https://i.pravatar.cc/150?u=jc",
    skills: [
      { name: "React", level: "Advanced", yearsOfExperience: 4 },
      { name: "Node.js", level: "Advanced", yearsOfExperience: 3 },
      { name: "PostgreSQL", level: "Intermediate", yearsOfExperience: 2 },
    ],
    experience: [
      {
        company: "HeHe Ltd",
        role: "Full-Stack Developer",
        startDate: "2020-05",
        endDate: "Present",
        description: "Building e-commerce and delivery platforms.",
        technologies: ["React", "Node.js", "PostgreSQL"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Science",
        startYear: 2016,
        endYear: 2020,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 76,
      scoreBreakdown: {
        technicalSkills: 80,
        experience: 70,
        education: 75,
        culturalFit: 85,
      },
      strengths: [
        "Solid React skills",
        "Local startup experience",
        "Good fundamentals",
      ],
      gaps: [
        "Lacks Kubernetes experience",
        "No Redis or large-scale architecture experience",
      ],
      recommendation: "Recommend",
      summary:
        "Jean-Claude is a competent developer but may need significant upskilling to handle the critical infrastructure scale of Irembo.",
      skillBreakdown: [
        { skill: "Node.js", score: 70 },
        { skill: "React", score: 85 },
        { skill: "Architecture", score: 60 },
        { skill: "Scale", score: 55 },
      ],
    },
  },
  {
    id: "app-5",
    firstName: "Esperance",
    lastName: "Uwanyirigira",
    email: "esp.uwanyirigira@yahoo.com",
    headline: "Frontend Engineer | UI/UX Enthusiast",
    bio: "Passionate about creating beautiful and responsive user interfaces using modern React frameworks.",
    location: "Musanze, Rwanda",
    appliedAt: "2026-04-18",
    status: "screening",
    jobId: "job-1",
    avatarUrl: "https://i.pravatar.cc/150?u=esp",
    skills: [
      { name: "React", level: "Advanced", yearsOfExperience: 3 },
      { name: "Tailwind CSS", level: "Expert", yearsOfExperience: 3 },
      { name: "Next.js", level: "Intermediate", yearsOfExperience: 1 },
    ],
    experience: [
      {
        company: "Zipline Rwanda",
        role: "Frontend Developer",
        startDate: "2022-01",
        endDate: "Present",
        description: "Developing internal dashboards for drone monitoring.",
        technologies: ["React", "Tailwind"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "INES-Ruhengeri",
        degree: "Bachelor's",
        fieldOfStudy: "IT",
        startYear: 2018,
        endYear: 2021,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 68,
      scoreBreakdown: {
        technicalSkills: 75,
        experience: 60,
        education: 65,
        culturalFit: 80,
      },
      strengths: [
        "Excellent Tailwind skills",
        "Clean UI implementation",
        "Good communication",
      ],
      gaps: [
        "Lacks backend depth",
        "No experience with PostgreSQL/Redis",
        "Limited Next.js",
      ],
      recommendation: "Consider",
      summary:
        "Esperance has strong frontend visual skills but her profile is too specialized in UI to meet the Senior Full-Stack requirements at this stage.",
      skillBreakdown: [
        { skill: "React", score: 75 },
        { skill: "Tailwind", score: 95 },
        { skill: "Backend", score: 40 },
        { skill: "DevOps", score: 30 },
      ],
    },
  },
  {
    id: "app-6",
    firstName: "Eric",
    lastName: "Mutangana",
    email: "eric.mutangana@gmail.com",
    headline: "DevOps Engineer | Cloud Security",
    bio: "Focusing on security and automation in cloud-native environments.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-19",
    status: "pending",
    jobId: "job-3",
    avatarUrl: "https://i.pravatar.cc/150?u=eric",
    skills: [
      { name: "AWS", level: "Advanced", yearsOfExperience: 3 },
      { name: "Terraform", level: "Advanced", yearsOfExperience: 2 },
      { name: "Kubernetes", level: "Intermediate", yearsOfExperience: 1 },
    ],
    experience: [
      {
        company: "Babyl Rwanda",
        role: "DevOps Specialist",
        startDate: "2021-11",
        endDate: "Present",
        description: "Managing AWS infrastructure and security audits.",
        technologies: ["AWS", "Ansible", "CloudWatch"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Adventist University of Central Africa",
        degree: "Bachelor's",
        fieldOfStudy: "Software Engineering",
        startYear: 2017,
        endYear: 2021,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 85,
      scoreBreakdown: {
        technicalSkills: 88,
        experience: 82,
        education: 80,
        culturalFit: 85,
      },
      strengths: [
        "Strong AWS foundation",
        "Focus on security",
        "Good Terraform skills",
      ],
      gaps: [
        "Limited Kubernetes production scale",
        "Needs more Ansible experience",
      ],
      recommendation: "Recommend",
      summary:
        "Eric is a strong candidate for the Cloud Lead role with a solid foundation in AWS and security, though he may need support on massive data migrations.",
      skillBreakdown: [
        { skill: "AWS", score: 90 },
        { skill: "Security", score: 85 },
        { skill: "Kubernetes", score: 70 },
        { skill: "Automation", score: 80 },
      ],
    },
  },
  {
    id: "app-7",
    firstName: "Grace",
    lastName: "Ingabire",
    email: "grace.ingabire@rdb.rw",
    headline: "UI/UX Designer | Fintech Specialist",
    bio: "Designing digital experiences that empower businesses across Rwanda.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-20",
    status: "screening",
    jobId: "job-2",
    avatarUrl: "https://i.pravatar.cc/150?u=grace",
    skills: [
      { name: "Figma", level: "Advanced", yearsOfExperience: 4 },
      { name: "User Research", level: "Advanced", yearsOfExperience: 3 },
      { name: "Illustrator", level: "Expert", yearsOfExperience: 6 },
    ],
    experience: [
      {
        company: "RDB",
        role: "Junior Designer",
        startDate: "2020-09",
        endDate: "Present",
        description: "Creating digital assets for public awareness campaigns.",
        technologies: ["Figma", "Illustrator"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Mt Kenya University",
        degree: "Bachelor's",
        fieldOfStudy: "Mass Communication",
        startYear: 2016,
        endYear: 2019,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 62,
      scoreBreakdown: {
        technicalSkills: 65,
        experience: 55,
        education: 60,
        culturalFit: 70,
      },
      strengths: ["Great visual design skills", "Public sector experience"],
      gaps: ["Lacks B2B SaaS experience", "Weak design system knowledge"],
      recommendation: "Not Recommended",
      summary:
        "Grace has strong graphic design skills but lacks the specific Product Design and Design Systems experience Mara requires for their fintech suite.",
      skillBreakdown: [
        { skill: "Figma", score: 70 },
        { skill: "UX Research", score: 50 },
        { skill: "Systems", score: 40 },
        { skill: "Product", score: 45 },
      ],
    },
  },
  {
    id: "app-8",
    firstName: "David",
    lastName: "Nizeyimana",
    email: "david.nize@gmail.com",
    headline: "Node.js Developer | Backend & APIs",
    bio: "Focusing on efficient server-side logic and database optimization.",
    location: "Huye, Rwanda",
    appliedAt: "2026-04-21",
    status: "shortlisted",
    jobId: "job-1",
    avatarUrl: "https://i.pravatar.cc/150?u=david",
    skills: [
      { name: "Node.js", level: "Advanced", yearsOfExperience: 5 },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 4 },
      { name: "TypeScript", level: "Intermediate", yearsOfExperience: 2 },
    ],
    experience: [
      {
        company: "CinePay",
        role: "Backend Engineer",
        startDate: "2019-11",
        endDate: "Present",
        description: "Built payment APIs for the Rwandan film industry.",
        technologies: ["Node.js", "PostgreSQL"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor's",
        fieldOfStudy: "CS",
        startYear: 2015,
        endYear: 2019,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 84,
      scoreBreakdown: {
        technicalSkills: 88,
        experience: 80,
        education: 78,
        culturalFit: 90,
      },
      strengths: [
        "Strong Node.js knowledge",
        "Payment systems context",
        "Reliable engineer",
      ],
      gaps: ["Needs more Next.js and Kubernetes experience"],
      recommendation: "Recommend",
      summary:
        "David is a solid backend engineer with relevant local experience. He is a very good cultural and technical fit for the Irembo team.",
      skillBreakdown: [
        { skill: "Node.js", score: 90 },
        { skill: "PostgreSQL", score: 85 },
        { skill: "Architecture", score: 75 },
        { skill: "Frontend", score: 60 },
      ],
    },
  },
  {
    id: "app-9",
    firstName: "Sophie",
    lastName: "Umulisa",
    email: "sophie.umulisa@outlook.com",
    headline: "Senior UX Researcher | Design Strategy",
    bio: "Dedicated to uncovering user needs and translating them into actionable design insights.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-22",
    status: "shortlisted",
    jobId: "job-2",
    avatarUrl: "https://i.pravatar.cc/150?u=sophie",
    skills: [
      { name: "UX Research", level: "Expert", yearsOfExperience: 6 },
      { name: "Figma", level: "Advanced", yearsOfExperience: 3 },
      { name: "User Testing", level: "Expert", yearsOfExperience: 5 },
    ],
    experience: [
      {
        company: "Amasangano",
        role: "UX Research Lead",
        startDate: "2020-01",
        endDate: "Present",
        description: "Leading research for local agriculture and health apps.",
        technologies: ["Lookback", "UserTesting", "Figma"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Kigali Independent University",
        degree: "Bachelor's",
        fieldOfStudy: "Psychology",
        startYear: 2015,
        endYear: 2018,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 88,
      scoreBreakdown: {
        technicalSkills: 80,
        experience: 90,
        education: 85,
        culturalFit: 95,
      },
      strengths: [
        "Exceptional research depth",
        "Strong psychology background",
        "Team leadership",
      ],
      gaps: ["Lacks UI/Framer design depth"],
      recommendation: "Recommend",
      summary:
        "Sophie is an excellent strategic researcher. While not a UI specialist, her research depth would be a massive asset for Mara's fintech suite.",
      skillBreakdown: [
        { skill: "UX Research", score: 98 },
        { skill: "Figma", score: 65 },
        { skill: "Testing", score: 95 },
        { skill: "Strategy", score: 90 },
      ],
    },
  },
  {
    id: "app-10",
    firstName: "Theophile",
    lastName: "Ndagijimana",
    email: "theophile.n@gmail.com",
    headline: "Cloud Architect | Kubernetes & Automation",
    bio: "Building robust and scalable cloud foundations for modern enterprises.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-23",
    status: "pending",
    jobId: "job-3",
    avatarUrl: "https://i.pravatar.cc/150?u=theo",
    skills: [
      { name: "Kubernetes", level: "Expert", yearsOfExperience: 4 },
      { name: "Terraform", level: "Advanced", yearsOfExperience: 3 },
      { name: "AWS", level: "Advanced", yearsOfExperience: 5 },
    ],
    experience: [
      {
        company: "MTN Rwanda",
        role: "Cloud Engineer",
        startDate: "2021-03",
        endDate: "Present",
        description: "Managing the shift to containerized core applications.",
        technologies: ["Kubernetes", "Helm", "GitLab CI"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Engineering",
        startYear: 2014,
        endYear: 2018,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 95,
      scoreBreakdown: {
        technicalSkills: 98,
        experience: 94,
        education: 90,
        culturalFit: 96,
      },
      strengths: [
        "Direct Kubernetes expertise",
        "MTN enterprise context",
        "Strong automation focus",
      ],
      gaps: ["None identified"],
      recommendation: "Strongly Recommend",
      summary:
        "Theophile is a perfect technical match. His experience at MTN handling enterprise scale with Kubernetes aligns 1:1 with BK Group's needs.",
      skillBreakdown: [
        { skill: "Kubernetes", score: 98 },
        { skill: "AWS", score: 92 },
        { skill: "Terraform", score: 90 },
        { skill: "Architecture", score: 95 },
      ],
    },
  },
  {
    id: "app-11",
    firstName: "Angelique",
    lastName: "Tuyisenge",
    email: "angie.t@irembo.rw",
    headline: "Junior Full-Stack Developer",
    bio: "Eager to learn and grow in a high-performance engineering environment.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-24",
    status: "pending",
    jobId: "job-1",
    avatarUrl: "https://i.pravatar.cc/150?u=angie",
    skills: [
      { name: "JavaScript", level: "Intermediate", yearsOfExperience: 2 },
      { name: "React", level: "Intermediate", yearsOfExperience: 1 },
    ],
    experience: [
      {
        company: "KLab",
        role: "Intern Developer",
        startDate: "2023-01",
        endDate: "2023-12",
        description: "Assisting in web development projects.",
        technologies: ["HTML", "CSS", "JS"],
        isCurrent: false,
      },
    ],
    education: [
      {
        institution: "Akilah Institute",
        degree: "Bachelor's",
        fieldOfStudy: "Information Systems",
        startYear: 2019,
        endYear: 2022,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 42,
      scoreBreakdown: {
        technicalSkills: 40,
        experience: 35,
        education: 50,
        culturalFit: 45,
      },
      strengths: ["High potential", "Local ecosystem familiarity"],
      gaps: [
        "Insufficient technical depth for senior role",
        "Limited experience with Node.js/PostgreSQL",
      ],
      recommendation: "Not Recommended",
      summary:
        "Angelique is a promising junior talent, but this senior role requires significantly more architectural and production experience.",
      skillBreakdown: [
        { skill: "Node.js", score: 30 },
        { skill: "TypeScript", score: 25 },
        { skill: "Architecture", score: 20 },
        { skill: "React", score: 55 },
      ],
    },
  },
  {
    id: "app-12",
    firstName: "Patrick",
    lastName: "Iradukunda",
    email: "patrick.ira@gmail.com",
    headline: "Security Analyst | Pentesting & Audits",
    bio: "Protecting digital assets through rigorous testing and strategic defense.",
    location: "Kigali, Rwanda",
    appliedAt: "2026-04-25",
    status: "screening",
    jobId: "job-3",
    avatarUrl: "https://i.pravatar.cc/150?u=patrick",
    skills: [
      { name: "Security", level: "Expert", yearsOfExperience: 4 },
      { name: "Python", level: "Advanced", yearsOfExperience: 3 },
    ],
    experience: [
      {
        company: "Cyber Security Authority",
        role: "Security Analyst",
        startDate: "2020-06",
        endDate: "Present",
        description:
          "Conducting vulnerability assessments for national systems.",
        technologies: ["Kali Linux", "Burp Suite", "Python"],
        isCurrent: true,
      },
    ],
    education: [
      {
        institution: "Tshwane University of Technology",
        degree: "Bachelor's",
        fieldOfStudy: "Cybersecurity",
        startYear: 2016,
        endYear: 2020,
      },
    ],
    availability: { status: "Available", type: "Full-time" },
    screening: {
      matchScore: 78,
      scoreBreakdown: {
        technicalSkills: 82,
        experience: 70,
        education: 75,
        culturalFit: 85,
      },
      strengths: [
        "Deep security expertise",
        "Government sector background",
        "Solid Python",
      ],
      gaps: ["Limited infrastructure automation (Terraform) experience"],
      recommendation: "Recommend",
      summary:
        "Patrick is an excellent security specialist. For a Cloud Lead role, he would need to pair with an automation expert, but his security depth is invaluable.",
      skillBreakdown: [
        { skill: "Security", score: 98 },
        { skill: "Python", score: 80 },
        { skill: "Cloud", score: 65 },
        { skill: "Automation", score: 45 },
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

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("MongoDB database connection is not initialized.");
    }

    console.log("Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("accounts").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("verifications").deleteMany({});
    await ScreeningResult.deleteMany({});
    await Applicant.deleteMany({});
    await Job.deleteMany({});
    console.log("Cleared existing data.");

    console.log("Creating auth user and account...");

    const recruiter = {
      ...recruiterSeedUsers[0],
      createdAt: plusDays("2026-03-01", 0),
    };

    await db.collection("users").insertOne({
      _id: recruiter.id,
      id: recruiter.id,
      name: recruiter.name,
      email: recruiter.email,
      emailVerified: true,
      image: recruiter.image,
      createdAt: recruiter.createdAt,
      updatedAt: recruiter.createdAt,
    });

    await db.collection("accounts").insertOne({
      _id: `acc-${recruiter.id}`,
      id: `acc-${recruiter.id}`,
      accountId: recruiter.email,
      providerId: "credential",
      userId: recruiter.id,
      password: hashPassword(recruiter.password),
      createdAt: recruiter.createdAt,
      updatedAt: recruiter.createdAt,
    });

    console.log("Created 1 auth user and 1 account.");

    console.log("Creating jobs...");
    const jobMapping: Record<string, string> = {};

    for (const mockJob of mockJobs) {
      const job = await Job.create({
        ...mockJob,
        createdByUserId: recruiter.id,
        createdAt: toDate(mockJob.createdAt),
        updatedAt: toDate(mockJob.createdAt),
        applicantsCount: 0,
        screenedCount: 0,
        shortlistedCount: 0,
      });
      jobMapping[mockJob.id] = job._id.toString();
    }
    console.log(`Inserted ${mockJobs.length} jobs.`);

    console.log("Creating applicants and screening results...");
    const applicantStats = new Map<string, { a: number; s: number; sl: number }>();

    for (const mockApplicant of mockApplicants) {
      const { id, jobId, screening } = mockApplicant;
      const realJobId = jobMapping[jobId];
      if (!realJobId) continue;

      const applicant = await Applicant.create({
        firstName: mockApplicant.firstName,
        lastName: mockApplicant.lastName,
        email: mockApplicant.email,
        headline: mockApplicant.headline,
        bio: mockApplicant.bio,
        location: mockApplicant.location,
        avatarUrl: mockApplicant.avatarUrl,
        skills: mockApplicant.skills,
        languages: mockApplicant.languages,
        experience: mockApplicant.experience,
        education: mockApplicant.education,
        certifications: mockApplicant.certifications,
        projects: mockApplicant.projects,
        availability: mockApplicant.availability,
        socialLinks: mockApplicant.socialLinks,
        status: mockApplicant.status,
        name: `${mockApplicant.firstName} ${mockApplicant.lastName}`,
        jobId: realJobId,
        userId: `usr-${id}`,
        screening,
        createdAt: toDate(mockApplicant.appliedAt),
        updatedAt: toDate(mockApplicant.appliedAt),
      });

      const current = applicantStats.get(realJobId) || { a: 0, s: 0, sl: 0 };
      current.a += 1;

      if (screening) {
        current.s += 1;
        if (["shortlisted", "hired"].includes(mockApplicant.status)) {
          current.sl += 1;
        }

        await ScreeningResult.create({
          applicantId: applicant._id,
          jobId: realJobId,
          createdByUserId: recruiter.id,
          matchScore: screening.matchScore,
          scoreBreakdown: (screening as any).scoreBreakdown,
          strengths: screening.strengths,
          gaps: screening.gaps,
          recommendation: screening.recommendation,
          skillBreakdown: screening.skillBreakdown,
          summary: screening.summary,
          createdAt: toDate(mockApplicant.appliedAt),
          updatedAt: toDate(mockApplicant.appliedAt),
        });
      }

      applicantStats.set(realJobId, current);
    }

    for (const [jobId, s] of applicantStats.entries()) {
      await Job.findByIdAndUpdate(jobId, {
        applicantsCount: s.a,
        screenedCount: s.s,
        shortlistedCount: s.sl,
      });
    }

    console.log(`Seeding complete. Inserted ${mockApplicants.length} applicants.`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
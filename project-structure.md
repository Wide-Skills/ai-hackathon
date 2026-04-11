# Project Description: AI-Powered Talent Screening Platform

## 1. Project Overview
This project is an AI-driven talent profile screening application developed for the Umurava AI Hackathon. It is designed to augment the recruitment process by automating the initial evaluation and shortlisting of candidates. The core objective is to drastically reduce time-to-hire while maintaining human oversight, ensuring that recruiters make the final hiring decisions based on transparent, AI-generated insights.

## 2. Problem Statement
Modern recruiters face significant bottlenecks in the hiring pipeline:
* **Overwhelming Volume:** High numbers of applicants make manual screening incredibly time-consuming.
* **Inconsistent Formats:** Comparing candidates is difficult when dealing with a mix of structured platform profiles and unstructured external resumes (PDFs, spreadsheets).
* **Subjectivity:** Ensuring objective, consistent evaluation across hundreds of diverse applications is nearly impossible for human screeners alone.

## 3. The Solution
We are building a full-stack, AI-powered platform that acts as an intelligent assistant for recruiters. By leveraging Advanced Large Language Models (LLMs), the system accurately parses, evaluates, and ranks candidates against specific job requirements. 

Critically, the platform is designed for **explainability**. It does not act as a "black box" that simply spits out a number. Instead, it provides a clear, natural-language breakdown of why a candidate was shortlisted, highlighting their specific strengths, potential skill gaps, and overall relevance to the role.

## 4. Core Features and Usage Scenarios

### Scenario A: Internal Platform Screening (Structured Data)
* **Ingestion:** Receives structured job details and applicant data directly from the Umurava platform database (adhering to a strict schema).
* **AI Evaluation:** Analyzes all applicants simultaneously against the specific job requirements.
* **Output:** Generates a ranked Top 10 or Top 20 shortlist with detailed, component-level reasoning for each applicant.

### Scenario B: External Job Board Screening (Unstructured Data)
* **Ingestion:** Allows recruiters to manually create jobs and upload external applicant data via CSV/Excel spreadsheets, PDF resumes, or direct links.
* **Parsing & Normalization:** Extracts relevant skills and experience from varying unstructured formats.
* **AI Evaluation:** Matches the normalized data against the job criteria to generate a ranked shortlist.

### Recruiter Dashboard
A user-friendly web interface that allows recruiters to:
* Create, edit, and manage job postings.
* Upload candidate data or trigger internal database scans.
* Initiate the AI screening process.
* View interactive data visualizations of the ranked shortlists.
* Read the detailed AI justifications for every ranked candidate.

## 5. Technical Architecture and Stack

The application is built using a modern, scalable JavaScript/TypeScript ecosystem.

* **Frontend Layer:**
  * **Framework:** Next.js (React)
  * **Language:** TypeScript
  * **State Management:** Redux + Redux Toolkit
  * **Styling:** Tailwind CSS
* **Backend Layer:**
  * **Environment:** Node.js
  * **Language:** TypeScript
  * **Architecture:** RESTful API design handling business logic and data pipelines.
* **Database Layer:**
  * **Database:** MongoDB (handling Jobs, Applicants, and Screening Results)
* **AI Orchestration Layer (Mandatory):**
  * **Core Model:** Gemini API
  * **Function:** Handles prompt execution, multi-candidate evaluation, weighted scoring algorithms, and natural-language reasoning generation.

## 6. AI Implementation Details
The integration of the Gemini API is the focal point of the application. The AI logic relies on advanced prompt engineering to ensure outputs are clean, structured, and recruiter-friendly. 

**Expected AI Output per Candidate:**
* **Candidate Rank:** Position in the shortlist.
* **Match Score:** A weighted percentage (0 to 100) based on skills, experience, and education.
* **Strengths:** Bulleted list of highly relevant qualifications.
* **Gaps/Risks:** Identification of missing skills or experience mismatches.
* **Final Recommendation:** A brief, human-readable summary for the recruiter.
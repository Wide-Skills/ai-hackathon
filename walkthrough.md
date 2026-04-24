# Umurava AI Hackathon | An Innovation Challenge to build AI Products for Human Resources Industry.

### **1\. Overview**

This technical guide defines the problem statement, system requirements, technical expectations, and delivery standards for the Umurava AI Hackathon with the theme “An innovation challenge to build AI Products for Human Resources Industry. It is intended to guide participating teams in building a production-ready prototype aligned with Umurava’s AI roadmap.

The challenge focuses on designing and deploying an AI-powered talent profile screening tool that augments recruiters’ decision-making while keeping humans in control of final hiring decisions. Please find [HERE](https://docs.google.com/document/d/1ZAMX5zEGu1wkcKRaBLNXvGvN2YFYbFlg8PLXfAA6V38/edit?tab=t.0) the full Technical guide document of the Umurava AI Hackathon.

### **2\. Problem Statement**

Recruiters today face two major challenges:

* High application volumes that significantly increase time-to-hire  
* Difficulty objectively comparing candidates across diverse profiles and formats

The problem to solve is:

How can AI be used to accurately, transparently, and efficiently screen and shortlist job applicants across both structured talent profiles and unstructured resumes while preserving human-led hiring decisions?

Teams must build a system that:

* Understands job requirements and ideal candidate profiles  
* Analyzes multiple applicants at once  
* Produces a ranked shortlist (Top 10 or Top 20\)  
* Clearly explains *why* candidates were shortlisted

### **3\. Product Scope & Usage Scenarios**

### **Scenario 1: Screening Applicants from the Umurava Platform**

Input

* Job details (role, requirements, skills, experience)  
* Structured talent profiles (provided schema)

AI Responsibilities

* Analyze all applicants against the job criteria  
* Score and rank candidates  
* Generate a shortlist of the Top 10 or 20 candidates

Constraints

* Teams will receive a Talent Profile Schema from Umurava  
* Dummy data must strictly follow this schema  
* AI output must be explainable. Each shortlisted candidate must include clear reasoning covering strengths, gaps, and relevance to the role.

### **Scenario 2: Screening Applicants from External Job Boards**

Input

* Manually entered job details  
* Uploaded spreadsheet (CSV / Excel)  
* Resume links or PDF uploads

AI Responsibilities

* Parse resumes and applicant data  
* Match applicants to job requirements  
* Rank and shortlist the Top 10 or 20 candidates

Design Freedom

Teams are free to design:

* Resume parsing approach  
* Spreadsheet ingestion logic  
* Matching and scoring methodology

### **4\. Functional Requirements**

The application must provide a recruiter-facing interface that supports:

* Job creation and editing  
* Applicant ingestion (profiles or uploads)  
* Triggering AI-based screening  
* Viewing ranked shortlists  
* Viewing AI-generated reasoning per candidate

### **5\. System Architecture (Expected)**

A typical high-level architecture may include:

* Frontend (Next.js)  
  * Recruiter dashboard  
  * Job input forms  
  * Applicant upload interfaces  
  * Shortlist visualization  
* Backend (Node.js \+ TypeScript)  
  * API layer  
  * Job & applicant processing  
  * AI orchestration logic  
* AI Layer (Gemini API – Mandatory)  
  * Job-to-candidate matching  
  * Candidate scoring and ranking  
  * Natural-language reasoning generation  
* Database (MongoDB)  
  * Jobs  
  * Applicants  
  * Screening results

### **6\. AI & LLM Requirements**

### **Mandatory Requirements**

* Gemini API must be used as the underlying LLM  
* Prompt engineering must be intentional and documented  
* AI outputs must be clean, structured, and recruiter-friendly

### **Recommended AI Capabilities**

* Multi-candidate evaluation in a single prompt  
* Weighted scoring (skills, experience, education, relevance)  
* Natural-language explanation for each shortlisted candidate

### **Example AI Output (Simplified)**

* Candidate Rank  
* Match Score (0–100)  
* Strengths  
* Gaps / Risks  
* Final Recommendation

### **7\. Technology Stack**

Teams are strongly encouraged to use the following stack:

* Language: TypeScript  
* Frontend: Next.js  
* State Management: Redux \+ Redux Toolkit  
* Styling: Tailwind CSS  
* Backend: Node.js  
* Database: MongoDB  
* AI / LLM: Gemini API

Alternative tools are allowed if justified, but Gemini remains mandatory.


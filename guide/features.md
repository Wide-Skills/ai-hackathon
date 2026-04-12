# Features

This document holds the core feature epics defining our project scope.

## 1. Resume Extraction 
- Accepts PDF or raw text.
- Extracts standard entities (Name, Email, Skills, Experience) cleanly via Edge function or Server logic before handing off to the AI ranker.

## 2. Gemini AI Applicant Matcher
- Core feature block mapping Jobs to Applicants.
- Feeds Job requirements + Applicant data to Gemini `gemini-2.5-pro`.
- Returns structured JSON defining Rank Score (0-100), Strengths, Gaps, and a one-paragraph Recommendation.

## 3. Recruiter Dashboard Interface
- UI heavily reliant on Redux.
- Filter applicants by score bounds or status (rejected vs screened).
- Add new jobs and see an aggregated view of applicants currently matched to them.

// @ts-ignore
import * as React from "react";
/* @jsxImportSource react*/
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ScreeningCompletedEmailProps {
  recruiterName: string;
  applicantName: string;
  jobTitle: string;
  matchScore: number;
  dashboardUrl: string;
}

export function ScreeningCompletedEmail({
  recruiterName,
  applicantName,
  jobTitle,
  matchScore,
  dashboardUrl,
}: ScreeningCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>AI Screening Complete: {applicantName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Screening Analysis Complete</Heading>
          <Text style={text}>Hi {recruiterName},</Text>
          <Text style={text}>
            Our AI has finished analyzing <strong>{applicantName}</strong> for
            the <strong>{jobTitle}</strong> position.
          </Text>
          <Section style={scoreContainer}>
            <div style={scoreBox}>
              <Text style={scoreLabel}>Match Score</Text>
              <Text style={scoreValue}>{matchScore}%</Text>
            </div>
          </Section>
          <Text style={text}>
            You can now review the detailed strengths, gaps, and final
            recommendation in your dashboard.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Full Report
            </Button>
          </Section>
          <Text style={footer}>
            Umurava AI — Precision Recruiting at Scale.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ScreeningCompletedEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "5px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const scoreContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const scoreBox = {
  display: "inline-block",
  padding: "20px 40px",
  backgroundColor: "#f0fdf4",
  borderRadius: "12px",
  border: "1px solid #bbf7d0",
};

const scoreLabel = {
  color: "#166534",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  margin: "0",
};

const scoreValue = {
  color: "#166534",
  fontSize: "36px",
  fontWeight: "bold",
  margin: "0",
};

const buttonContainer = {
  padding: "27px 0 27px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "50px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  padding: "0 48px",
  marginTop: "20px",
  textAlign: "center" as const,
};

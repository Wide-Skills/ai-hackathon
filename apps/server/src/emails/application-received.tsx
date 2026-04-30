// @ts-nocheck

/* @jsxImportSource react*/
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface ApplicationReceivedEmailProps {
  firstName: string;
  jobTitle: string;
}

export function ApplicationReceivedEmail({
  firstName,
  jobTitle,
}: ApplicationReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Application Received: {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Application Received</Heading>
          <Text style={text}>Hi {firstName},</Text>
          <Text style={text}>
            Thank you for applying for the <strong>{jobTitle}</strong> position
            at Umurava.
          </Text>
          <Text style={text}>
            Our AI-powered screening assistant is currently reviewing your
            profile against the job requirements. We will be in touch shortly
            with an update.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            The Umurava Talent Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ApplicationReceivedEmail;

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

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "22px",
  padding: "0 48px",
  marginTop: "20px",
};

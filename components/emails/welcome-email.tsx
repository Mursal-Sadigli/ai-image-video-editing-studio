import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userFirstName?: string;
}

export const WelcomeEmail = ({ userFirstName = "İstifadəçi" }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>VisionAI Studio-ya Xoş Gəldiniz! 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>VisionAI-yə Xoş Gəldiniz, {userFirstName}!</Heading>
          <Text style={text}>
            Qeydiyyatdan keçdiyiniz üçün təşəkkür edirik. Biz sizə 20 pulsuz kredit hədiyyə etdik. İndi dərhal öz mükəmməl şəkil və videolarınızı yaratmağa başlaya bilərsiniz.
          </Text>
          
          <Section style={btnContainer}>
            <Button style={button} href="https://visionai.demo/dashboard">
              İndi Yarat
            </Button>
          </Section>
          
          <Text style={text}>
            Platforma ilə bağlı hər hansı sualınız olarsa, bu e-poçta cavab verərək bizimlə əlaqə saxlaya bilərsiniz.
          </Text>
          
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} VisionAI Studio. Bütün hüquqlar qorunur.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 48px",
  marginTop: "40px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  padding: "0 48px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#6366f1", // indigo-500
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  padding: "0 48px",
};

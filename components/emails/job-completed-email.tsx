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

interface JobCompletedEmailProps {
  userFirstName?: string;
  jobType?: string;
  projectUrl?: string;
}

export const JobCompletedEmail = ({ 
  userFirstName = "İstifadəçi", 
  jobType = "Video Generasiyası",
  projectUrl = "https://visionai.demo/dashboard/history"
}: JobCompletedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Müjdə! Sizin {jobType} prosesiniz tamamlandı 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Tapşırıq Uğurla Tamamlandı!</Heading>
          <Text style={text}>
            Salam {userFirstName},
          </Text>
          <Text style={text}>
            Sizin gözlədiyiniz <strong>{jobType}</strong> əməliyyatı arxa planda uğurla başa çatdı. Nəticəni görmək, yükləmək və ya paylaşmaq üçün aşağıdakı düyməyə daxil ola bilərsiniz.
          </Text>
          
          <Section style={btnContainer}>
            <Button style={button} href={projectUrl}>
              Nəticəyə Bax
            </Button>
          </Section>
          
          <Text style={text}>
            Bizi seçdiyiniz üçün təşəkkür edirik!
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

export default JobCompletedEmail;

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
  backgroundColor: "#10b981", // emerald-500
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

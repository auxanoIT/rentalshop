import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";

import { formatNaira } from "@/lib/utils";

export default function OrderConfirmationEmail({
  name,
  reference,
  total
}: {
  name: string;
  reference: string;
  total: number;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your ITShop rental request has been received</Preview>
      <Body style={{ backgroundColor: "#f7faf8", color: "#111812", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ margin: "0 auto", maxWidth: 560, padding: "32px 20px" }}>
          <Heading style={{ color: "#087443", fontSize: 24 }}>Rental request received</Heading>
          <Text>Hello {name},</Text>
          <Text>
            Your rental request <strong>{reference}</strong> has been received by ITShop Equipment
            Leasing.
          </Text>
          <Section style={{ border: "1px solid #d9e2dc", borderRadius: 8, padding: 16 }}>
            <Text style={{ margin: 0 }}>Estimated total</Text>
            <Text style={{ fontSize: 24, fontWeight: 700, margin: "8px 0 0" }}>{formatNaira(total)}</Text>
          </Section>
          <Text>
            An admin will review payment, documents, inventory, delivery, and any security deposit
            requirement before fulfilment.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

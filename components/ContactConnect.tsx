import { Typography } from "@mui/material";
import {
  LinkedinLogo,
  Envelope,
  ChatCircle,
  Phone,
} from "@phosphor-icons/react";
import { ConnectButton } from "./ConnectButton";
import { useCallback } from "react";

interface Props {
  linkedIn: string;
  email: string;
  phone: string;
}

export const ContactConnect = ({ linkedIn, email, phone }: Props) => {
  const handleLinkedInClick = useCallback(() => {
    window.open(linkedIn);
  }, [linkedIn]);

  const handleEmailClick = useCallback(() => {
    const mailtoLink = `mailto:${email}`;

    window.open(mailtoLink);
  }, [email]);

  const handlePhoneClick = useCallback(() => {
    const phoneLink = `tel:${phone}`;

    window.open(phoneLink);
  }, [phone]);

  const handleMessgeClick = useCallback(() => {
    const messageLink = `message:${phone}`;

    window.open(messageLink);
  }, [phone]);

  return (
    <div className="space-y-3 mb-6 mx-4">
      <Typography variant="h3" sx={{ fontWeight: 600 }}>
        Connect
      </Typography>
      <div className="flex justify-between">
        <ConnectButton
          icon={<LinkedinLogo size={24} />}
          label="LinkedIn"
          onClick={linkedIn ? handleLinkedInClick : undefined}
        />
        <ConnectButton
          icon={<Envelope size={24} />}
          label="Email"
          onClick={email ? handleEmailClick : undefined}
        />
        <ConnectButton
          icon={<ChatCircle size={24} />}
          label="Message"
          onClick={phone ? handleMessgeClick : undefined}
        />
        <ConnectButton
          icon={<Phone size={24} />}
          label="Phone"
          onClick={phone ? handlePhoneClick : undefined}
        />
      </div>
    </div>
  );
};

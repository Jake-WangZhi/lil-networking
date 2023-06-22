import { Typography, Card, CardContent } from "@mui/material";
import { Mail, Linkedin } from "react-feather";
import { Button } from "@/components/Button";
import { Contact } from "@/types";
import { useCallback } from "react";

interface Props {
  contact: Contact;
}

export const MessageCard = ({ contact }: Props) => {
  const handleLinkedInClick = useCallback(() => {
    const linkedInLink = contact.links[0];

    window.open(linkedInLink);
  }, [contact.links]);

  const handleEmailClick = useCallback(() => {
    const emailAddress = contact.email;
    const mailtoLink = `mailto:${emailAddress}`;

    window.open(mailtoLink);
  }, [contact.email]);

  return (
    <div className="px-4">
      <Card>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Typography variant="h2">
                {contact.firstName} {contact.lastName}
              </Typography>
              <div className="flex items-start">
                {contact.email && (
                  <Button
                    variant="text"
                    sx={{ p: "12px !important" }}
                    onClick={handleEmailClick}
                  >
                    <Mail size={24} />
                  </Button>
                )}
                {contact.links.length > 0 && (
                  <Button
                    variant="text"
                    sx={{ p: "12px !important" }}
                    onClick={handleLinkedInClick}
                  >
                    <Linkedin size={24} />
                  </Button>
                )}
              </div>
            </div>
            <Typography variant="subtitle1">{contact.title}</Typography>
            <Typography variant="subtitle1">{contact.company}</Typography>
            <Typography variant="subtitle1">{contact.industry}</Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

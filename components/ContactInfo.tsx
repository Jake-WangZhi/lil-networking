import { Link, Mail, Phone } from "react-feather";
import { Contact } from "@/types";
import { Card, CardContent, Typography } from "@mui/material";
import { Clock } from "@phosphor-icons/react";
import { Button } from "./Button";
import { formatBaseUrl, formatPhoneNumber } from "@/lib/utils";
import { useCallback } from "react";

interface Props {
  contact: Contact;
}

export const ContactInfo = ({ contact }: Props) => {
  const {
    firstName,
    lastName,
    title,
    company,
    industry,
    goalDays,
    email,
    phone,
    links,
  } = contact;

  const handlePhoneClick = useCallback(() => {
    const phone = `tel:${contact.phone}`;

    window.location.href = phone;
  }, [contact.phone]);

  const handleEmailClick = useCallback(() => {
    const emailAddress = `mailto:${contact.email}`;

    window.location.href = emailAddress;
  }, [contact.email]);

  const handleLinkedInClick = useCallback(
    (linkedInLink: string) => () => {
      const link = document.createElement("a");
      link.href = linkedInLink;
      link.target = "_blank";
      link.click();
    },
    []
  );

  return (
    <div className="mx-4 mb-6">
      <Card>
        <CardContent>
          <div className="text-white break-words">
            <Typography variant="h2">
              {firstName} {lastName}
            </Typography>
            {title && (
              <Typography
                variant="subtitle1"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {title}
              </Typography>
            )}
            {company && (
              <Typography
                variant="subtitle1"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {company}
              </Typography>
            )}
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {industry}
            </Typography>
            {links.length !== 0 && (
              <div>
                {links?.map((link, index) => (
                  <Button
                    variant="text"
                    sx={{
                      width: "100%",
                    }}
                    onClick={handleLinkedInClick(link)}
                    key={`link-${index}`}
                  >
                    <div className="flex space-x-3 w-full items-center">
                      <Link
                        size={16}
                        className="md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0 text-light-blue"
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          overflow: "hidden",
                          overflowWrap: "break-words",
                        }}
                      >
                        {formatBaseUrl(link)}
                      </Typography>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

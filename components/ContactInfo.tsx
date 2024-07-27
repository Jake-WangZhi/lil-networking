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
          <div className="text-white space-y-2 break-words">
            <Typography variant="h2">
              {firstName} {lastName}
            </Typography>
            {title && <Typography variant="subtitle1">{title}</Typography>}
            {company && <Typography variant="subtitle1">{company}</Typography>}
            <Typography variant="subtitle1">{industry}</Typography>
            <div className="flex items-center space-x-3">
              <Clock
                size={24}
                className="md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0"
              />
              <Typography variant="subtitle1">{goalDays} days</Typography>
            </div>
            {(email || phone || links.length !== 0) && (
              <div>
                {email && (
                  <Button
                    variant="text"
                    sx={{
                      width: "100%",
                    }}
                    onClick={handleEmailClick}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Mail
                        size={24}
                        className="md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0 text-light-blue"
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          overflow: "hidden",
                          overflowWrap: "break-words",
                        }}
                      >
                        {email}
                      </Typography>
                    </div>
                  </Button>
                )}
                {phone && (
                  <Button
                    variant="text"
                    sx={{
                      width: "100%",
                    }}
                    onClick={handlePhoneClick}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Phone
                        size={24}
                        className="md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0 text-light-blue"
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          overflow: "hidden",
                          overflowWrap: "break-words",
                        }}
                      >
                        {formatPhoneNumber(phone)}
                      </Typography>
                    </div>
                  </Button>
                )}
                {links?.map((link, index) => (
                  <Button
                    variant="text"
                    sx={{
                      width: "100%",
                    }}
                    onClick={handleLinkedInClick(link)}
                    key={`link-${index}`}
                  >
                    <div className="flex space-x-3 w-full">
                      <Link
                        size={24}
                        className="md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0 text-light-blue"
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

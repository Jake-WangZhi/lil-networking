import { Card, CardContent, Typography } from "@mui/material";
import { Button } from "./Button";
import { formatBaseUrl } from "@/lib/utils";
import { useCallback } from "react";
import { Link } from "@phosphor-icons/react";

interface Props {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  industry: string;
  links: string[];
}

export const ContactInfo = ({
  firstName,
  lastName,
  title,
  company,
  industry,
  links,
}: Props) => {
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

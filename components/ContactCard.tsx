import { ActivityType, Contact } from "~/types";
import { ArrowRight, Archive } from "react-feather";
import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { formatDate } from "~/lib/utils";

interface Props {
  contact: Contact;
}

export const ContactCard = ({ contact }: Props) => {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Link href={`/contacts/${contact.id}`} className="text-white">
            <div className="flex justify-between">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                }}
              >
                {contact.firstName} {contact.lastName}
              </Typography>
              <ArrowRight className="md:w-6 md:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
            </div>
            <div className="flex items-center space-x-2">
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.7,
                }}
              >
                {contact.industry}
              </Typography>
              {contact.isArchived && (
                <Archive size={16} className="opacity-70 flex-shrink-0" />
              )}
            </div>
            <Typography
              variant="body1"
              sx={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {contact.activities[0].type === ActivityType.USER
                ? contact.activities[0].description
                : `Contact added ${formatDate(contact.activities[0].date)}`}
            </Typography>
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

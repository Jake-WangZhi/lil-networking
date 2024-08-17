import { ContactCardType, UserType } from "@/types";
import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Chip } from "./Chip";

interface Props {
  contact: ContactCardType;
}

export const ContactCard = ({ contact }: Props) => {
  const { id, firstName, lastName, title, interests, note, isArchived } =
    contact;

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Link href={`/contacts/${id}`} className="text-white">
            <div className="flex justify-between items-start">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                }}
              >
                {firstName} {lastName}
              </Typography>
              {isArchived && <Chip label={UserType.Archived} />}
            </div>
            <div className="flex items-center space-x-2">
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.7,
                }}
              >
                {title}
              </Typography>
            </div>
            {note && (
              <Typography
                variant="body1"
                sx={{
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {note}
              </Typography>
            )}
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

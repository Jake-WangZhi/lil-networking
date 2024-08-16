import { formatDate } from "@/lib/utils";
import { ActivityType } from "@/types";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { NoteBlank } from "@phosphor-icons/react";
import Link from "next/link";

interface Props {
  contactId: string;
  activityId: string;
  title: string;
  date: string;
  note: string;
  description: string;
  type: ActivityType;
}

export const ActivityCard = ({
  contactId,
  activityId,
  title,
  date,
  note,
  description,
  type,
}: Props) => {
  const content = (
    <CardContent>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        {formatDate(date)}
      </Typography>
      {note && (
        <Grid container alignItems="center">
          <Grid item xs={1} sm={0.8} lg={0.7}>
            <NoteBlank
              size={24}
              color="white"
              className="mt-1.5 md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          </Grid>
          <Grid item xs={11} sm={11.2} lg={11.3}>
            <Typography variant="body1" sx={{ marginTop: "8px" }}>
              {note}
            </Typography>
          </Grid>
        </Grid>
      )}
      {description && (
        <Typography variant="body1" sx={{ marginTop: "8px" }}>
          {description}
        </Typography>
      )}
    </CardContent>
  );

  return (
    <Card sx={{ ml: "24px" }}>
      {type === ActivityType.User ? (
        <CardActionArea>
          <Link
            href={`/contacts/${contactId}/activities/${activityId}/edit`}
            className="text-white"
          >
            {content}
          </Link>
        </CardActionArea>
      ) : (
        content
      )}
    </Card>
  );
};

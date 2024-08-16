import { formatDate } from "@/lib/utils";
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
}

export const ActivityCard = ({
  contactId,
  activityId,
  title,
  date,
  note,
  description,
}: Props) => {
  return (
    <Card sx={{ ml: "24px" }}>
      <CardActionArea>
        <CardContent>
          <Link
            href={`/contacts/${contactId}/activities/${activityId}/edit`}
            className="text-white"
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              {formatDate(date)}
            </Typography>
            {note && (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={1}>
                  <NoteBlank
                    size={24}
                    color="white"
                    className="mt-1.5 md:w-7 md:h-7 lg:w-8 lg:h-8"
                  />
                </Grid>
                <Grid item xs={11}>
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
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

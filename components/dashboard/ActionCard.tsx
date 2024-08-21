import { Action, UserType, SearchParams } from "@/types";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { CalendarBlank, NoteBlank } from "@phosphor-icons/react";
import { Chip } from "../Chip";

interface Props {
  action: Action;
  actionType: UserType;
}

export const ActionCard = ({ action, actionType }: Props) => {
  const getLastActivityMessage = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const { contactId, contactFirstName, contactLastName, title, note } = action;

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Link
            href={`/contacts/${contactId}?${SearchParams.IsFromDashboard}=true`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex justify-between text-white">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {contactFirstName} {contactLastName}
                  </Typography>
                </div>
                {title && (
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.7,
                      mb: 1,
                    }}
                  >
                    {title}
                  </Typography>
                )}
              </div>
              {action.isNewUser && <Chip label={UserType.New} />}
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarBlank
                size={24}
                color="white"
                className="-mt-0.5 md:w-7 md:h-7 lg:w-8 lg:h-8"
              />
              <Typography variant="body1">{action.goalDays} days •</Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color:
                    actionType === UserType.Priority ? "#ED3293" : "#FFCF79",
                }}
              >
                Last Activity: {getLastActivityMessage(action.days)}
              </Typography>
            </div>
            {note && (
              <Grid container>
                <Grid item xs={1} sm={0.8} md={0.64}>
                  <NoteBlank
                    size={24}
                    color="white"
                    className="mt-1.5 md:mt-0.5 md:w-7 md:h-7 lg:w-8 lg:h-8"
                  />
                </Grid>
                <Grid item xs={11} sm={11.2} md={11.36}>
                  <Typography variant="body1" sx={{ marginTop: "8px" }}>
                    {note}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

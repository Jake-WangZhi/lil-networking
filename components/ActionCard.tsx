import { Action, ActionType, SearchParams } from "@/types";
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { CalendarBlank } from "@phosphor-icons/react";

interface Props {
  action: Action;
  actionType: ActionType;
}

export const ActionCard = ({ action, actionType }: Props) => {
  const getLastActivityMessage = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Link
            href={`/contacts/${action.contactId}?${SearchParams.IsFromDashboard}=true`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex justify-between text-white">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {action.contactFirstName} {action.contactLastName}
                  </Typography>
                </div>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.7,
                  }}
                >
                  {action.title}
                </Typography>
              </div>
              {action.isNewUser && (
                <Chip label="New" className="text-white bg-medium-overlay" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <CalendarBlank
                className="text-2xl mb-1 md:text-3xl lg:text-4xl"
                color="white"
              />
              <Typography variant="body1">{action.goalDays} days •</Typography>
              <Typography
                variant="body1"
                className={`font-semibold ${
                  actionType === "past" ? "text-magenta" : "text-light-yellow"
                }`}
              >
                Last Activity: {getLastActivityMessage(action.days)}
              </Typography>
            </div>
          </Link>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

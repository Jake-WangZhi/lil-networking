import { Typography } from "@mui/material";
import { Goals } from "@prisma/client";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { UserPlus, ChatCircle } from "@phosphor-icons/react";

interface Props {
  goals: Goals;
}

export const GoalStats = ({ goals }: Props) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-16 h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20">
          <CircularProgressbarWithChildren
            value={Math.min(
              (goals.connections / goals.goalConnections) * 100,
              100
            )}
            styles={buildStyles({
              pathColor: "#38ACE2",
              trailColor: "rgba(255, 255, 255, 0.32)",
            })}
            strokeWidth={4}
          >
            <UserPlus className="text-2xl md:text-3xl lg:text-4xl" />
          </CircularProgressbarWithChildren>
        </div>
        <div className="p-2">
          <Typography variant="body1">
            {goals.connections}/{goals.goalConnections}
          </Typography>
          <Typography variant="subtitle1" className="font-semibold">
            Contacts
          </Typography>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20">
          <CircularProgressbarWithChildren
            value={Math.min((goals.messages / goals.goalMessages) * 100, 100)}
            styles={buildStyles({
              pathColor: "#38ACE2",
              trailColor: "rgba(255, 255, 255, 0.32)",
            })}
            strokeWidth={4}
          >
            <ChatCircle className="text-2xl md:text-3xl lg:text-4xl" />
          </CircularProgressbarWithChildren>
        </div>
        <div className="p-2">
          <Typography variant="body1">
            {goals.messages}/{goals.goalMessages}
          </Typography>
          <Typography variant="subtitle1" className="font-semibold">
            Messages
          </Typography>
        </div>
      </div>
    </div>
  );
};

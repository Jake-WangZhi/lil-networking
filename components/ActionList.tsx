import { Action, ActionType } from "@/types";
import { ClipLoader } from "react-spinners";
import { ActionCard } from "./ActionCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import Image from "next/image";
import icon from "@/public/images/empty_state_icon.svg";
import Lottie from "react-lottie";
import animationData from "@/lottie/908-add-and-save.json";
import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface Props {
  actions?: {
    priorityActions: Array<Action>;
    upcomingActions: Array<Action>;
    hasContacts: boolean;
  };
  isLoading: boolean;
  isError: boolean;
}

export const ActionList = ({ actions, isLoading, isError }: Props) => {
  const [priorityExpanded, setPriorityExpanded] = useState(
    JSON.parse(localStorage.getItem("priorityExpanded") || "true")
  );
  const [upcomingExpanded, setUpcomingExpanded] = useState(
    JSON.parse(localStorage.getItem("upcomingExpanded") || "true")
  );

  useEffect(() => {
    localStorage.setItem("priorityExpanded", JSON.stringify(priorityExpanded));
  }, [priorityExpanded]);

  useEffect(() => {
    localStorage.setItem("upcomingExpanded", JSON.stringify(upcomingExpanded));
  }, [upcomingExpanded]);

  const handlePriorityClick = () => {
    setPriorityExpanded(!priorityExpanded);
  };

  const handleUpcomingClick = () => {
    setUpcomingExpanded(!upcomingExpanded);
  };

  if (isError) {
    return (
      <Typography
        variant="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#FB5913",
        }}
      >
        Something went wrong, please try again later
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center mt-5">
        <ClipLoader color="#38ACE2" size={150} />
      </div>
    );
  }

  if (!actions) {
    return (
      <Typography
        variant="h3"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          color: "#FB5913",
        }}
      >
        No actions available
      </Typography>
    );
  }

  if (!actions.hasContacts) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center px-8">
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          width={130}
          height={130}
        />
        <Typography variant="h2">Your Dashboard is empty</Typography>{" "}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, textAlign: "center" }}
        >
          Add contacts and all actionable items will show up here.
        </Typography>
      </div>
    );
  }

  if (
    actions.priorityActions.length === 0 &&
    actions.upcomingActions.length === 0
  )
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center px-8">
        <Image src={icon} alt={"empty state"} />
        <Typography variant="h2">You Rock!</Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, textAlign: "center" }}
        >
          Have you met anyone new? Add more contacts and continue growing your
          network.
        </Typography>
      </div>
    );

  return (
    <div className="w-full mb-20 mt-5 space-y-6">
      <Accordion disableGutters expanded={priorityExpanded}>
        <AccordionSummary
          expandIcon={
            <CaretDown
              color="white"
              size={24}
              className="md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          }
          onClick={handlePriorityClick}
        >
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 border-l-4 border-magenta mb-1 md:border-l-5 md:h-5 lg:border-l-6 lg:h-6"></div>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
              }}
            >{`Priority (${actions.priorityActions.length})`}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="space-y-4">
            {actions.priorityActions?.map((action, index) => (
              <ActionCard
                key={index}
                action={action}
                actionType={ActionType.Priority}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters expanded={upcomingExpanded}>
        <AccordionSummary
          expandIcon={
            <CaretDown
              color="white"
              size={24}
              className="md:w-7 md:h-7 lg:w-8 lg:h-8"
            />
          }
          onClick={handleUpcomingClick}
        >
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 border-l-4 border-light-yellow mb-1 md:border-l-5 md:h-5 lg:border-l-6 lg:h-6"></div>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
              }}
            >{`Upcoming (${actions.upcomingActions?.length})`}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="space-y-4">
            {actions.upcomingActions?.map((action, index) => (
              <ActionCard
                key={index}
                action={action}
                actionType={ActionType.Upcoming}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

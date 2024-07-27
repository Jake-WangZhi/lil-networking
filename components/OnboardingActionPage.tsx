import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  actionButton?: ReactNode;
  textButton?: ReactNode;
  morePadding?: boolean;
}

export const OnboardingActionPage = ({
  title,
  description,
  actionButton,
  textButton,
  morePadding,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center bg-dark-blue space-y-6 mt-[291px]">
      <div className={`${morePadding ? "px-20" : "px-12"}`}>
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          {description}
        </Typography>
      </div>
      <div className="flex flex-col items-center space-y-4">
        {actionButton}
        {textButton}
      </div>
    </div>
  );
};

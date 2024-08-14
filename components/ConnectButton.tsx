import { Button } from "@/components/Button";
import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export const ConnectButton = ({ icon, label, onClick }: Props) => {
  return (
    <div className="flex flex-col items-center gap-1 px-3">
      <Button
        variant="text"
        sx={{ height: "auto" }}
        onClick={onClick}
        disabled={onClick === undefined}
      >
        <div
          className={`${
            onClick
              ? "bg-light-blue active:bg-blue-500 text-black"
              : "bg-medium-overlay text-disabled-grey"
          } p-4 rounded-full items-center`}
        >
          {icon}
        </div>
      </Button>
      <Typography
        variant="body1"
        sx={{
          alignSelf: "center",
          color: onClick ? "white" : "rgba(255, 255, 255, 0.38)",
        }}
      >
        {label}
      </Typography>
    </div>
  );
};

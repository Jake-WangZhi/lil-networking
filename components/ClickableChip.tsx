import { Typography } from "@mui/material";

interface ClickableChipProps {
  label: string;
  isClicked: boolean;
  onClick: () => void;
}

export const ClickableChip = ({
  label,
  isClicked,
  onClick,
}: ClickableChipProps) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white bg-opacity-[0.12] rounded-2xl px-4 py-1 border-[1px] ${
        isClicked ? "border-[#38ACE2]" : "border-white border-opacity-0"
      }`}
    >
      <Typography
        variant="body1"
        sx={{
          color: isClicked ? "#38ACE2" : "inherit",
        }}
      >
        {label}
      </Typography>
    </div>
  );
};

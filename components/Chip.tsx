import { Typography } from "@mui/material";

export const Chip = ({ label }: { label: string }) => {
  return (
    <div className="bg-white bg-opacity-[0.12] rounded-2xl px-4 py-1">
      <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
        {label}
      </Typography>
    </div>
  );
};

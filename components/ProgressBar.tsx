import { Typography } from "@mui/material";

interface Props {
  title: string;
  progress: number;
  stepCount: number;
}

export const ProgressBar = ({ title, progress, stepCount }: Props) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="subtitle1">{`${
          progress + 1
        }/${stepCount}`}</Typography>
      </div>
      <div className="flex justify-between items-center w-full">
        {Array.from({ length: stepCount }).map((_, index) => (
          <div
            key={index}
            className={`w-[30%] ${
              index <= progress ? "border-light-blue" : "border-white"
            } border-2`}
          />
        ))}
      </div>
    </div>
  );
};

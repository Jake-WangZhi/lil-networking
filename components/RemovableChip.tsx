import { Typography } from "@mui/material";
import { X } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  label: string;
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
}

export const RemovableChip = ({ label, setSelectedTags }: Props) => {
  const handleClick = () => {
    setSelectedTags((prev: string[]) =>
      prev.filter((tag: string) => tag !== label)
    );
  };

  return (
    <div
      onClick={handleClick}
      className="flex bg-white bg-opacity-[0.12] rounded-2xl px-4 py-1 items-center gap-1"
    >
      <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
        {label}
      </Typography>
      <div className="bg-white bg-opacity-60 rounded-full p-[2px]">
        <X size={15} color="black" />
      </div>
    </div>
  );
};

import { X } from "@phosphor-icons/react";
import { Button } from "./Button";
import { Typography } from "@mui/material";
import { ClickableChip } from "./ClickableChip";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  tags: string[];
  setSelectedTags: Dispatch<SetStateAction<Set<string>>>;
}

export const FilterPage = ({
  isVisible,
  onClose,
  tags,
  setSelectedTags,
}: Props) => {
  const [clickedTags, setClickedTags] = useState(
    [...Array(tags.length)].map(() => false)
  );

  const handleChipClick = (index: number) => {
    setClickedTags((prev) =>
      prev.map((clicked, i) => (i === index ? !clicked : clicked))
    );

    setSelectedTags((prev) => {
      const newTags = new Set(prev);

      if (newTags.has(tags[index])) {
        newTags.delete(tags[index]);
      } else {
        newTags.add(tags[index]);
      }

      return newTags;
    });
  };

  const handleClearClick = () => {
    setClickedTags([...Array(tags.length)].map(() => false));
  };

  return (
    <div
      className={`mx-auto max-w-lg md:max-w-xl lg:max-w-3xl fixed inset-0 px-4 py-8 bg-dark-blue transform transition-transform duration-700 ease-in-out h-full ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ zIndex: 20 }}
    >
      <div className="flex justify-between items-center">
        <Typography variant="h2">Tag List</Typography>
        <Button variant="text" sx={{ px: "8px" }} onClick={onClose}>
          <X size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
        </Button>
      </div>
      <Typography variant="body1">Filter your contact list by tags</Typography>
      <div className="h-5/6">
        <div className="flex gap-3 pt-2 flex-wrap px-2 !py-6">
          {tags.map((tag, index) => (
            <ClickableChip
              key={index}
              label={tag}
              isClicked={clickedTags[index]}
              onClick={() => handleChipClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <Button variant="text" onClick={handleClearClick}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, px: "24px" }}>
            Clear All
          </Typography>
        </Button>
        <Button variant="contained" onClick={onClose} sx={{ margin: 0 }}>
          Show 35 results
        </Button>
      </div>
    </div>
  );
};

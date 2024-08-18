import { X } from "@phosphor-icons/react";
import { Button } from "./Button";
import { Typography } from "@mui/material";
import { ClickableChip } from "./ClickableChip";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useContactCount } from "@/hooks/useContactCount";
import { ClipLoader } from "react-spinners";

interface Props {
  isVisible: boolean;
  tags: string[];
  clickedTags: boolean[];
  setClickedTags: Dispatch<SetStateAction<boolean[]>>;
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  email: string;
  name: string;
  selectedTags: string[];
  setIsHiddenPageVisible: Dispatch<SetStateAction<boolean>>;
}

export const FilterPage = ({
  isVisible,
  tags,
  clickedTags,
  setClickedTags,
  selectedTags,
  setSelectedTags,
  email,
  name,
  setIsHiddenPageVisible,
}: Props) => {
  const { contactCount } = useContactCount({
    userEmail: email,
    name,
    tags: tags.filter((tag, index) => clickedTags[index]),
  });

  console.log("clickedTags", clickedTags);
  const handleChipClick = (index: number) => {
    setClickedTags((prev) =>
      prev.map((clicked, i) => (i === index ? !clicked : clicked))
    );
  };

  const handleClearClick = () => {
    setClickedTags((prev) => prev.map(() => false));
  };

  const handleConfirmClick = () => {
    setSelectedTags(
      clickedTags.map((clicked, index) => (clicked ? tags[index] : ""))
    );
    setIsHiddenPageVisible(false);
  };

  const handleCloseClick = () => {
    setIsHiddenPageVisible(false);

    const indexes = tags.map((tag, index) => {
      if (selectedTags.includes(tag)) return index;
    });

    setClickedTags((prev: boolean[]) =>
      prev.map((tagBoolean, index) => {
        if (indexes.includes(index)) return true;
        else return false;
      })
    );
  };

  const noTagsSelected = clickedTags.every((tag) => tag === false);

  return (
    <div
      className={`mx-auto max-w-lg md:max-w-xl lg:max-w-3xl fixed inset-0 px-4 py-8 bg-dark-blue transform transition-transform duration-700 ease-in-out h-full ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ zIndex: 20 }}
    >
      <div className="flex justify-between items-center">
        <Typography variant="h2">Tag List</Typography>
        <Button variant="text" sx={{ px: "8px" }} onClick={handleCloseClick}>
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
        <Button
          variant="text"
          onClick={handleClearClick}
          disabled={noTagsSelected}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              px: "24px",
              ...(noTagsSelected
                ? {
                    color: "rgb(255, 255, 255, 0.38)",
                  }
                : { color: "white" }),
            }}
          >
            Clear All
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmClick}
          sx={{ margin: 0, width: "180px" }}
        >
          {contactCount?.count ? (
            `Show ${contactCount.count} results`
          ) : (
            <ClipLoader color="black" size={30} />
          )}
        </Button>
      </div>
    </div>
  );
};

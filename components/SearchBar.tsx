import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Search } from "react-feather";
import { Button } from "./Button";

interface Props {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

export const SearchBar = ({ name, setName }: Props) => {
  const [isInputFocused, setInputFocused] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
    setShowCancel(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  const handleCancel = useCallback(() => {
    setName("");
    setInputFocused(false);
    setShowCancel(false);
  }, [setName]);

  return (
    <div className="flex items-center mt-6 mb-1 space-x-3">
      <div
        className={`w-full h-12 bg-white bg-opacity-5 rounded-lg flex ${
          isInputFocused ? "ring-1 ring-white bg-opacity-[0.12]" : ""
        }`}
      >
        <Search
          size={16}
          className="mx-2 my-auto text-grey opacity-60 md:w-5 md:h-5 lg:w-6 lg:h-6"
        />
        <input
          id="searchBarInput"
          type="text"
          placeholder={"Search contact"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="flex-grow bg-transparent text-white caret-white focus:outline-none text-base md:text-lg lg:text-xl"
        />
      </div>
      {showCancel && (
        <div>
          <Button
            variant="text"
            sx={{
              color: "#38ACE2",
              "&:hover": {
                color: "#38ACE2",
              },
            }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

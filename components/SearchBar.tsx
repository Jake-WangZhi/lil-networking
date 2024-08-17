import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "./Button";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface Props {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

export const SearchBar = ({ name, setName }: Props) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
    setShowCancel(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const handleCancel = useCallback(() => {
    setName("");
    setIsInputFocused(false);
    setShowCancel(false);
  }, [setName]);

  return (
    <div className="flex items-center mt-6 mb-1 space-x-3">
      <div
        className={`w-full h-12 bg-white bg-opacity-5 rounded-lg flex ${
          isInputFocused ? "ring-1 ring-white bg-opacity-[0.12]" : ""
        }`}
      >
        <MagnifyingGlass
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
        {showCancel && (
          <Button
            variant="text"
            onClick={handleCancel}
            sx={{ mr: "8px", mt: "-1px" }}
          >
            <X size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </Button>
        )}
      </div>
    </div>
  );
};

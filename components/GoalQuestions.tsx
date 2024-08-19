import { Typography } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./Button";

interface ButtonContent {
  label: string;
  value: number;
}

interface Props {
  title: string;
  description: string;
  setValue: Dispatch<SetStateAction<number>>;
  selectedValue: number;
  buttonContents: ButtonContent[];
  errorMessage: string;
}

export const GoalQuestions = ({
  title,
  description,
  setValue,
  selectedValue,
  buttonContents,
  errorMessage,
}: Props) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(
    (value: number) => () => {
      setValue(value);
      setIsCustomInput(false);
    },
    [setValue]
  );

  const handleCustomClick = useCallback(() => {
    setValue(selectedValue);
    setIsCustomInput(true);
  }, [selectedValue, setValue]);

  useEffect(() => {
    if (isCustomInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = "";
    }
  }, [isCustomInput]);

  useEffect(() => {
    //Use setTimeout to create a short delay to prevent accidental button triggering
    //when redirected from the onboarding
    setTimeout(() => {
      setIsDisabled(false);
    }, 0);
  }, []);

  return (
    <div className="h-[70vh] flex flex-col justify-center items-center">
      <Typography variant="h2" sx={{ textAlign: "center", mb: "16px" }}>
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ textAlign: "center", mb: "32px" }}>
        {description}
      </Typography>
      <div className="space-y-4 w-full">
        {buttonContents.map(({ label, value }, index) => {
          return (
            <div key={`answer-${index}`} className="flex justify-center">
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  "@media (min-width: 1024px)": {
                    width: "60%",
                  },
                  border:
                    selectedValue === value && !isCustomInput
                      ? "1px solid #38ACE2"
                      : "none",
                  color:
                    selectedValue === value && !isCustomInput
                      ? "#38ACE2"
                      : "white",
                  "&:disabled": {
                    color: "white",
                  },
                }}
                onClick={handleClick(value)}
                disabled={isDisabled}
              >
                {label}
              </Button>
            </div>
          );
        })}
        <div className="flex justify-center">
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              "@media (min-width: 1024px)": {
                width: "60%",
              },
              border: isCustomInput ? "1px solid #38ACE2" : "none",
              color: isCustomInput ? "#38ACE2" : "white",
              "&:disabled": {
                color: "white",
              },
            }}
            onClick={handleCustomClick}
            disabled={isDisabled}
            turnOffRipple={isCustomInput}
          >
            {isCustomInput ? (
              <div className="bg-dark-blue">
                <input
                  type="number"
                  id="customValue"
                  name="customValue"
                  className="text-center w-full"
                  ref={inputRef}
                  value={selectedValue}
                  onChange={(e) => setValue(parseInt(e.target.value))}
                />
              </div>
            ) : (
              "Add custom goal here..."
            )}
          </Button>
        </div>
        {errorMessage && (
          <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
            {errorMessage}
          </Typography>
        )}
      </div>
    </div>
  );
};

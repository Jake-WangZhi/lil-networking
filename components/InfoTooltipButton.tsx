import { Tooltip, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";
import { Info, X } from "@phosphor-icons/react";
import { Button } from "./Button";

export const InfoTooltipButton = () => {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setOpen(false);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const tooltipContent = (
    <div ref={tooltipRef} className="flex justify-between p-2">
      <div>
        <Typography variant="body1">
          <span className="font-bold">Past Due:</span> Items that have been
          actionable for 10+ days
        </Typography>
        <br />
        <Typography variant="body1">
          <span className="font-bold">New Actions:</span> Items that have been
          actionable between 0-10 days.
        </Typography>
      </div>
      <div className="flex items-start">
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ zIndex: 10, height: "auto" }}
        >
          <X size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </Button>
      </div>
    </div>
  );

  return (
    <Button variant="text" onClick={handleClick} sx={{ px: "8px" }}>
      <Tooltip
        open={open}
        title={tooltipContent}
        arrow
        placement="bottom-start"
      >
        <Info
          size={32}
          fill="white"
          color="#0F1A24"
          className="md:w-10 md:h-10 lg:w-12 lg:h-12 "
        />
      </Tooltip>
    </Button>
  );
};

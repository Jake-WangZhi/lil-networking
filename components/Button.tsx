"use client";

import { MouseEvent, ReactNode } from "react";
import { Button as MuiButton } from "@mui/material";

type Props = {
  variant?: "contained" | "outlined" | "text";
  children: ReactNode;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  sx?: {};
  type?: "button" | "submit" | "reset";
};

const VARIANTS: Record<string, {}> = {
  contained: {
    mx: "auto",
    color: "#0F1A24",
    backgroundColor: "#38ACE2 !important",
    fontWeight: "600",
    lineHeight: "24px",
    borderRadius: "28px",
    fontSize: "16px",
    px: "16px",
    textAlign: "center",
    height: "48px",
    "@media (min-width: 768px)": {
      fontSize: "18px",
    },
    "@media (min-width: 1024px)": {
      fontSize: "20px",
    },
    "&:hover": {
      color: "#0F1A24",
    },
  },
  outlined: {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.05) !important",
    borderRadius: "41px",
    border: "0px",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "20px",
    p: "13px",
    textAlign: "center",
    "@media (min-width: 768px)": {
      fontSize: "16px",
    },
    "@media (min-width: 1024px)": {
      fontSize: "18px",
    },
  },
  text: {
    color: "white !important",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    height: "48px",
    "@media (min-width: 768px)": {
      fontSize: "16px",
    },
    "@media (min-width: 1024px)": {
      fontSize: "18px",
    },
  },
};

export const Button = ({
  children,
  disabled = false,
  variant = "contained",
  onClick,
  sx = {},
  type = "button",
}: Props) => {
  return (
    <MuiButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      variant={variant}
      sx={{
        textTransform: "none",
        padding: "0px",
        minWidth: "unset",
        lineHeight: "24px",
        "&:hover": {
          backgroundColor: variant === "contained" ? "#38ACE2" : "transparent",
          border: variant === "outlined" ? "1px solid #38ACE2" : "none",
          color: variant === "outlined" ? "#38ACE2" : "white",
        },
        ...VARIANTS[variant],
        ...sx,
      }}
    >
      {children}
    </MuiButton>
  );
};

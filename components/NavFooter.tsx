"use client";

import { Home, Users, Settings } from "react-feather";
import { useRouter } from "next/navigation";
import { useBackPath } from "@/contexts/BackPathContext";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useState } from "react";
import { AddToHomeScreenBanner } from "./AddToHomeScreenBanner";

export const NavFooter = () => {
  const { backPath, setBackPath } = useBackPath();
  const [value, setValue] = useState(backPath);
  const router = useRouter();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
      }}
      elevation={3}
    >
      <AddToHomeScreenBanner addBottomPadding={true} />
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          setBackPath(newValue);
          router.push(newValue);
        }}
        sx={{
          backgroundColor: "#0F1A24",
          margin: "auto",
          px: "16px",
          justifyContent: "space-between",
          pb: "4px",
          "& .MuiBottomNavigationAction-root.Mui-selected": {
            color: "white",
          },
          "@media (min-width: 768px)": {
            maxWidth: "576px",
          },
          "@media (min-width: 1024px)": {
            maxWidth: "768px",
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<Home />}
          value={"/dashboard"}
          sx={{
            color: "#C5C6C7",
            padding: 0,
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
            },
          }}
        />
        <BottomNavigationAction
          label="Contacts"
          icon={<Users />}
          value={"/contacts"}
          sx={{
            color: "#C5C6C7",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
            },
          }}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings />}
          value={"/settings"}
          sx={{
            color: "#C5C6C7",
            padding: 0,
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

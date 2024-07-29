"use client";

import { useRouter } from "next/navigation";
import { useBackPath } from "@/contexts/BackPathContext";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useState } from "react";
import { AddToHomeScreenBanner } from "./AddToHomeScreenBanner";
import { House, Users, Gear } from "@phosphor-icons/react";

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
          pb: "34px",
          height: "90px",
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
          icon={<House size={24} />}
          value={"/dashboard"}
          sx={{
            color: "#C5C6C7",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
            },
          }}
        />
        <BottomNavigationAction
          label="Contacts"
          icon={<Users size={24} />}
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
          icon={<Gear size={24} />}
          value={"/settings"}
          sx={{
            color: "#C5C6C7",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

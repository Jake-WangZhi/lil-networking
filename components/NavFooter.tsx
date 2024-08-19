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
          pb: "10px",
          height: "66px",
          "& .MuiBottomNavigationAction-root.Mui-selected": {
            color: "white",
          },
          "@media (min-width: 768px)": {
            maxWidth: "576px",
            height: "76px",
          },
          "@media (min-width: 1024px)": {
            maxWidth: "768px",
            height: "86px",
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<House className="text-2xl md:text-3xl lg:text-4xl" />}
          value={"/dashboard"}
          sx={{
            color: "#C5C6C7",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
              "@media (min-width: 768px)": {
                fontSize: "13px !important",
              },
              "@media (min-width: 1024px)": {
                fontSize: "15px !important",
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Contacts"
          icon={<Users className="text-2xl md:text-3xl lg:text-4xl" />}
          value={"/contacts"}
          sx={{
            color: "#C5C6C7",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
              "@media (min-width: 768px)": {
                fontSize: "13px !important",
              },
              "@media (min-width: 1024px)": {
                fontSize: "15px !important",
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Gear className="text-2xl md:text-3xl lg:text-4xl" />}
          value={"/settings"}
          sx={{
            color: "#C5C6C7",
            "& .MuiBottomNavigationAction-label": {
              fontSize: "11px !important",
              "@media (min-width: 768px)": {
                fontSize: "13px !important",
              },
              "@media (min-width: 1024px)": {
                fontSize: "15px !important",
              },
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

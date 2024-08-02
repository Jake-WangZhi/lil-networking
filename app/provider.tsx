"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GoogleAnalytics } from "nextjs-google-analytics";

export function QCProvider({ children }: PropsWithChildren) {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <GoogleAnalytics trackPageViews />
      {children}
    </QueryClientProvider>
  );
}

export function MuiCssProvider({ children }: PropsWithChildren) {
  let theme = createTheme({
    typography: {
      allVariants: {
        overflow: "hidden",
        overflowWrap: "break-word",
      },
      fontFamily: "Metropolis, sans-serif",
      h1: {
        fontSize: 33,
        fontWeight: 600,
        lineHeight: "48px",
        color: "white",
        "@media (min-width:768px)": {
          fontSize: 40,
        },
        "@media (min-width:1024px)": {
          fontSize: 48,
        },
      },
      h2: {
        fontSize: 23,
        fontWeight: 600,
        lineHeight: "32px",
        color: "white",
        "@media (min-width:768px)": {
          fontSize: 25,
        },
        "@media (min-width:1024px)": {
          fontSize: 27,
        },
      },
      h3: {
        fontSize: 19,
        fontWeight: 400,
        lineHeight: "24px",
        color: "white",
        "@media (min-width:768px)": {
          fontSize: 21,
        },
        "@media (min-width:1024px)": {
          fontSize: 23,
        },
      },
      h4: {
        fontSize: 40,
        fontWeight: 600,
        lineHeight: "40px",
        color: "#38ACE2",
        "@media (min-width:768px)": {
          fontSize: 42,
        },
        "@media (min-width:1024px)": {
          fontSize: 44,
        },
      },
      subtitle1: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: "24px",
        color: "white",
        "@media (min-width:768px)": {
          fontSize: 18,
        },
        "@media (min-width:1024px)": {
          fontSize: 20,
        },
      },
      body1: {
        fontSize: 14,
        fontWeight: 400,
        lineHeight: "20px",
        color: "white",
        "@media (min-width:768px)": {
          fontSize: 16,
        },
        "@media (min-width:1024px)": {
          fontSize: 18,
        },
      },
      subtitle2: {
        fontSize: 11,
        fontWeight: 400,
        lineHeight: "16px",
        color: "#F42010",
        "@media (min-width:768px)": {
          fontSize: 13,
        },
        "@media (min-width:1024px)": {
          fontSize: 15,
        },
      },
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            position: "relative",
            backgroundColor: "#0F1A24",
            padding: "8px",
            "&::after": {
              borderRadius: "4px",
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.16)",
            },
          },
          arrow: {
            background: "#0F1A24",
            color: "rgba(255, 255, 255, 0.16)",
          },
          tooltipPlacementBottom: {
            marginTop: "16px !important",
          },
          tooltipPlacementLeft: {
            marginRight: "16px !important",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(0, 0, 0, 0.32)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            padding: "8px",
            position: "relative",
            backgroundColor: "#2C353E",
            "&::after": {
              borderRadius: "4px",
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            },
            "@media (min-width:768px)": {
              padding: "16px",
            },
            "@media (min-width:1024px)": {
              padding: "24px",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            boxShadow: "none",
            width: "100%",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            "&:last-child": {
              paddingBottom: "16px",
            },
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: { backgroundColor: "#0F1A24", boxShadow: "none" },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: { root: { padding: "0px" } },
      },
      MuiAccordionDetails: {
        styleOverrides: { root: { padding: "0px", marginTop: "8px" } },
      },
      MuiMenu: {
        styleOverrides: {
          root: { backgroundColor: "none" },
          list: { padding: "0px" },
          paper: {
            background: "#EDEDED",
            borderRadius: "12px",
            width: "254px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: { root: { padding: "0px" } },
      },
      MuiDivider: {
        styleOverrides: {
          root: { margin: "0px !important" },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: { margin: "0px" },
        },
      },
      MuiModal: {
        styleOverrides: {
          backdrop: { backgroundColor: "transparent" },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: "52px",
            height: "32px",
            padding: "0px",
          },
          switchBase: {
            padding: "0px",
            margin: "4px",
            transitionDuration: "300ms",
            color: "#938F99",
            "&.Mui-checked": {
              color: "#38ACE2",
            },
          },
          track: {
            borderColor: "red",
            backgroundColor: "#36343B",
            opacity: 1,
            border: "2px solid #938F99",
            borderRadius: "100px",
            ".Mui-checked+ &": {
              backgroundColor: "white !important",
              opacity: "1 !important",
              border: "0px",
            },
          },
          thumb: {
            width: "24px",
            height: "24px",
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

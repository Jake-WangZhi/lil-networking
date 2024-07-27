import { Grid, Typography } from "@mui/material";
import { Goals } from "@prisma/client";

interface Props {
  goals: Goals;
}

export const GoalStats = ({ goals }: Props) => {
  return (
    <Grid container>
      <Grid item xs={4}>
        <div className="flex flex-col items-center">
          <Typography variant="h4">{goals.connections}</Typography>
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            {`out of ${goals.goalConnections}`}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Connections
          </Typography>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="flex flex-col items-center">
          <Typography variant="h4">{goals.messages}</Typography>
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            {`out of ${goals.goalMessages}`}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Messages
          </Typography>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="flex flex-col items-center">
          <Typography variant="h4">{goals.streak}</Typography>
          <Typography variant="subtitle2" sx={{ color: "white" }}>
            Month
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Streak
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};

import { Grid} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

const useStyles = makeStyles(theme => ({
  LinearContainer: {
    flexGrow: 1,
    position: "relative",
  },
  progressBar: {
    height: "20px",
    borderRadius: theme.spacing(.5),
  },
  progressLabel: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    textAlign: "center",
    display: "flex",
    "& span": {
      width: "100%",
      fontWeight: '700',
      color: '#fff'
    }
  },
}));


export const GreenOrangeProgressBar = withStyles((theme) => ({
  colorPrimary: {
    backgroundColor: theme.palette.grey[400],
  },
  barColorPrimary: {
    backgroundColor: "#00a227",
  },
  colorSecondary: {
    backgroundColor: theme.palette.grey[400],
  },
  barColorSecondary: {
    backgroundColor: theme.palette.warning.dark,
  },
}))(LinearProgress)







function ProgressBar({ price=0 ,value = 0, prefix = '', suffix = '', max = 1000, Component = GreenOrangeProgressBar, ...props }) {
    const classes = useStyles();
    const perc = value > max ? 100 : value / max * 100
  return (<>
    <div className={classes.LinearContainer}>
      <Grid container spacing={1} justifyContent="space-between">
        <Grid item xs={12} spacing={0}>
          <div className={classes.progressLabel}>
            <span>{prefix}{price}{suffix}</span>
          </div>
          <Component
            value={perc}
            color='primary'
            variant="determinate"
            className={classes.progressBar}
          />
        </Grid>
      </Grid>
    </div>
  </>
  )
}

export default ProgressBar;
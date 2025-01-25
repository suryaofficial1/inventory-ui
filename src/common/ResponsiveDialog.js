import Dialog from '@material-ui/core/Dialog';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  paper: {
    overflowY: 'unset',
  },
});

export default withStyles(styles)(function ResponsiveDialog(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return <Dialog
    fullScreen={fullScreen}
    aria-labelledby="responsive-dialog"
    disableBackdropClick={true}
    disableEscapeKeyDown={true}
    {...props}
  >
    {props.children}
  </Dialog>
});


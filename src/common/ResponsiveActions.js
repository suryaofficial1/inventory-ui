import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function ResponsiveActions(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return <DialogActions style={isMobile ? { width: "100%" } : { width: props.width }}>
    {props.children}
  </DialogActions>
}
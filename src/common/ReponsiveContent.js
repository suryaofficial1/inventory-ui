import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Use makeStyles to define the styles
const useStyles = makeStyles(() => ({
  scrollBar: {
    '&::-webkit-scrollbar': {
      width: '0.4em',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#0066a3',
      outline: '1px solid slategrey',
    },
  },
}));

export default function ReponsiveContent(props) {
  const theme = useTheme();
  const classes = useStyles(); // Apply the styles
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DialogContent
      className={classes.scrollBar}
      style={{
        ...props.style,
        ...(isMobile
          ? { height: '100%' }
          : { height: props.height }),
      }}
    >
      {props.children}
    </DialogContent>
  );
}

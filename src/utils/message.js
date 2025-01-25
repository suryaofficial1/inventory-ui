import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';
import React from 'react';

/**
 * Method to Show messages on any messages.
 */
var snackbar = null;
var close = null;
export default function InitSnackbar() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    snackbar = enqueueSnackbar;
    close = closeSnackbar;
    return '';
}

export const showMessage = (_type, _message) => {
    let variant = _type;
    snackbar(<span id="snackbar_message">{_message}</span>, {
        variant, action: (id) => <IconButton size="small" aria-label="close" color="inherit"
            onClick={() => close(id)}>
            <CloseIcon fontSize="small" />
        </IconButton>
    });
}
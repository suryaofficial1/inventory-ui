import React from 'react'
import ResponsiveDialog from './ResponsiveDialog'
import ReponsiveDialogTitle from './ReponsiveDialogTitle'
import ReponsiveContent from './ReponsiveContent'
import { DialogActions } from '@material-ui/core'

const PopupAction = ({ onClose, title, width, fullWidth, maxWidth, actions, children }) => {
    return (
        <ResponsiveDialog open={true} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth || 'md'}>
            {title && <ReponsiveDialogTitle title={title} closeAction={onClose} />}
            <ReponsiveContent width={width || 500}>
                {children}
            </ReponsiveContent>
            {actions && (
                <DialogActions>
                    {actions}
                </DialogActions>
            )}
        </ResponsiveDialog>
    )
}

export default PopupAction
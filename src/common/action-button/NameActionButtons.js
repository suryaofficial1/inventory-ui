import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useSelector } from 'react-redux';
const useStyles = makeStyles({
    actionIcons: {
    },
    actionButton: {
        margin: 5,
        padding: "5px 5px",
    }
});

const NameActionButtons = ({ params, handleAction, deleteAction }) => {
    const user = useSelector((state) => state.user);
    const classes = useStyles();
    const showAllButtons = user?.role === 'User' ? false : true;

    return (
        <>
            <div style={{ lineHeight: 3 }}>
                {showAllButtons ? (
                    <>
                        <div>
                            <Button className={classes.actionButton} fullWidth variant="contained" color="primary" onClick={() => handleAction(params.row, 'edit')}>Edit</Button>
                        </div>
                        <div style={{ display: 'flex', gap: 5, cursor: 'pointer' }}>
                            <Button className={classes.actionButton} variant="contained" color="action" onClick={() => handleAction(params.row, 'view')}>View</Button>
                            <Button className={classes.actionButton} variant="contained" color="secondary" onClick={() => deleteAction(params.row)}>Delete</Button>
                        </div>
                    </>
                ) : (
                    <Button fullWidth className={classes.actionButton} variant="contained" color="action" onClick={() => handleAction(params.row, 'view')}>View</Button>
                )}
            </div>
        </>
    );
}

export default NameActionButtons

{/* <div className={classes.actionIcons}>
            {showAllButtons ? (
                <>
                    <Button className={classes.actionButton} variant="contained" color="primary" onClick={() => handleAction(params.row, 'edit')}>Edit</Button>
                   
                </>
            ) : (
                <Button className={classes.actionButton} variant="contained" color="action" onClick={() => handleAction(params.row, 'view')}>View</Button>
            )}
        </div> */}
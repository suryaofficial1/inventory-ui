import { Delete, Edit, Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useSelector } from 'react-redux';
const useStyles = makeStyles({
    actionIcons: {
        display: 'flex',
        gap: 15,
        cursor: 'pointer',
    },
    addBtn: {
        padding: 10
    },
    actionButton: {
        padding: "5px 15px",
        marginRight: 10,
        borderRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

const ActionButton = ({ params, handleAction, deleteAction }) => {
    const user = useSelector((state) => state.user);
    const classes = useStyles();
    const showAllButtons = user?.role === 'User' ? false : true;

    return (
        <div className={classes.actionIcons}>
            {showAllButtons ? (
                <>
                    <Edit color="primary" onClick={() => handleAction(params.row, 'edit')} />
                    <Visibility color="action" onClick={() => handleAction(params.row, 'view')} />
                    <Delete color="secondary" onClick={() => deleteAction(params.row)} />
                </>
            ) : (
                <Visibility color="action" onClick={() => handleAction(params.row, 'view')} />
            )}
        </div>
    );
}
export default ActionButton

import { Grid, Typography } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';
const useStyles = theme => ({
	closeButtonCont: {
		position: "absolute",
		top: "-10px",
		right: "-10px",
		zIndex: 1,
	},
	closeButton: {
		margin: 0,
		padding: 5,
		color: "#0066a3",
		background: "#fff",
		"&:hover": {
			background: "#fff",
			color: "#0066a3"
		}
	},
	title: {
		color: "#fff",
		background: "#0066a3",
		padding: 0
	},
	titleCont: {
		paddingLeft: "20px",
		paddingTop: 5
	},

	titleText: {
		color: "#fff",
		fontSize: "22px"
	},
	small: {
		color: "#fff",
		fontSize: "1.72rem"
	},
});

function EzyDialogTitle(props) {
	const { classes } = props
	const titleText = classes[props.size || "titleText"]
	return <DialogTitle disableTypography className={classes.title}>
		<Grid container spacing={0} xs={12} direction="row" justify="flex-end" alignItems="flex-start">
			<Grid item xs className={classes.titleCont}>
				<Typography gutterBottom className={titleText}>
					{props.title}
				</Typography>
			</Grid>
			<Grid item className={classes.closeButtonCont}>
				<IconButton className={classes.closeButton} size="medium" id="closeDialog" onClick={props.closeAction}>
					<CloseIcon color='primary' fontSize="small" />
				</IconButton>
			</Grid>
		</Grid>
	</DialogTitle>
}

EzyDialogTitle.propTypes = {
	classes: PropTypes.object.isRequired,
	closeAction: PropTypes.func.isRequired,
	size: PropTypes.string,
	title: PropTypes.string.isRequired,
};

export default withStyles(useStyles)(EzyDialogTitle);
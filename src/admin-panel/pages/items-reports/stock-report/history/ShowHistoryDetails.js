import { IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { PRODUCT_HISTORY } from '../../../../../config/api-urls';
import { showMessage } from '../../../../../utils/message';
import { sendGetRequest } from '../../../../../utils/network';
import './ProductTimeline.css';
export default function ShowHistoryDetails({ title, open, onClose, id, type, supId, batchNo}) {

    const [productDetails, setProductDetails] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const user = useSelector((state) => state.user);

  React.useEffect(() => {
    fetchProductHistory();
  }, [id, type]);

  const fetchProductHistory = () => {
    setLoading(true);
    console.log("id", id, type, supId)
    sendGetRequest(PRODUCT_HISTORY(id, type, supId, batchNo), user.token)
      .then((_res) => {
        if (_res.status === 200) {
          setProductDetails(_res.data);
        } else {
          showMessage("error", `Something went wrong while loading ${type} product history details`);
        }
      }).catch(err => {
        console.log("err", err)
          showMessage("error", `Something went wrong while loading ${type} product history details`);
      }).finally(() => setLoading(false));
  }

  return (
    <>
      <Dialog
        maxWidth={'xl'}
        open={open}
        onClose={onClose}
        style={{ height: '100%' }}
      >
        <DialogTitle style={{ background: '#0066a3', color: '#fff' }}>
            <Grid container spacing={2} xs={12} direction="row" justify="space-between" alignItems="center">
                <Grid item xs>
                    <Typography variant="h6" gutterBottom component="div">
                         <b>{title} </b> Product history
                    </Typography>
                </Grid>
                <Grid item>
                   <IconButton aria-label="view reporters" size="small" onClick={onClose}>
                        <Close style={{ color: '#fff' }} fontSize="small" />
                    </IconButton>
                </Grid>
            </Grid>
            </DialogTitle>
        <DialogContent >
           <div className="timeline">
      <div className="outer">
        {productDetails?.length != 0 ? productDetails?.map((item, index) => (
          <div className="card" key={index}>
            <div className="info">
              <h3 className="title">{item.action}</h3>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2"><b>Date:</b> {item.action_time}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2"><b>Product name:</b> {item.product_name}</Typography>
                    </Grid>
                    {!['Product Created', 'Used in Production', 'Production Entry'].includes(item.action) && <Grid item xs={12}>
                        <Typography variant="body2"><b>Invoice No:</b> {item.invoiceNo}</Typography>
                    </Grid>}
                     {['Product Purchased', 'Product Returned'].includes(item.action) &&<Grid item xs={12}>
                        <Typography variant="body2"><b>Batch No:</b> {item.batchNo}</Typography>
                    </Grid>}
                    <Grid item xs={12}>
                        <Typography variant="body2"><b>Quantity:</b> {item.quantity}</Typography>
                    </Grid>
                     {['Product Purchased', 'Product Returned'].includes(item.action) &&<Grid item xs={12}>
                        <Typography variant="body2"><b>Supplier</b> {item.reference.name}</Typography>
                    </Grid>}
                     {['Sales', 'Sales Return'].includes(item.action) &&<Grid item xs={12}>
                        <Typography variant="body2"><b>Customers</b> {item.reference.name}</Typography>
                        <Typography variant="body2"></Typography>
                        <Typography variant="body2"><b>Sales Name</b> {item.salesName}</Typography>
                    </Grid>}
                     {['Used in Production', 'Production Entry'].includes(item.action) &&<Grid item xs={12}>
                        <Typography variant="body2"><b>Operator Name:</b> {item.reference.operatorName}</Typography>
                        <Typography variant="body2"></Typography>
                        <Typography variant="body2"><b>Batch Number:</b> {item.batchNo}</Typography>
                    </Grid>}
                     {['Used in Production'].includes(item.action) &&<Grid item xs={12}>
                        <Typography variant="body2"><b>Manufacturing product name:</b> ❝ {item.manufBy.name} ❞</Typography>
                    </Grid>}
                    <Grid item xs={12} sm={12}>
                        <Typography variant="body2"> ❝ {item.description} ❞</Typography>
                    </Grid>
                </Grid>
            </div>
          </div>
        ))
       : 
       <div className="card" style={{ width: 500 }}>
          <Typography variant="body2">No history found</Typography>
        </div>
       }
      </div>
    </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
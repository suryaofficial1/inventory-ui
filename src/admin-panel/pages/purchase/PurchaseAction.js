import React, { useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import PopupAction from '../../../common/PopupAction';
import moment from 'moment';
import { useLoader } from '../../../hooks/useLoader';
import { ADD_PURCHASE_DETAILS, PRODUCTS, SUPPLIERS, UPDATE_PURCHASE_DETAILS } from '../../../config/api-urls';
import { sendGetRequest, sendPostRequest } from '../../../utils/network';
import { showMessage } from '../../../utils/message';

const useStyles = makeStyles({
  formField: {
    marginBottom: 15,
    width: '100%',
  },
});

const PurchaseAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
  const classes = useStyles();
  const [formsData, setFormsData] = useState({
    supplier: selectedData?.supplier ? selectedData.supplier.id : '' || '',
    product: selectedData?.product ? selectedData.product.id : '' || '',
    purchaseDate: moment(selectedData.purchaseDate).local().format('YYYY-MM-DD') || '',
    description: selectedData?.description || '',
    purchaseOrder: selectedData?.purchaseOrder || '',
    qty: selectedData?.qty || '',
    unit: selectedData?.unit || '',
    price: selectedData?.price || '',
    status: selectedData?.status || '1',
  });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [{ start, stop }, Loader] = useLoader();

  useEffect(() => {
    getSuppliers();
    getProducts();
  }, []);

  const getSuppliers = () => {
    start()
    sendGetRequest(SUPPLIERS, "token")
      .then(res => {
        if (res.status === 200) {
          setSuppliers(res.data);
        } else {
          console.log("Error in get suppliers", res.data)
        }
      }).catch(err => {
        console.log(err)
      }).finally(stop)
  }
  const getProducts = () => {
    start()
    sendGetRequest(PRODUCTS, "token")
      .then(res => {
        if (res.status === 200) {
          setProducts(res.data);
        } else {
          console.log("Error in get products", res.data)
        }
      }).catch(err => {
        console.log(err)
      }).finally(stop)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };

  const validation = () => {
    const errors = {};
    if (!formsData.supplier) errors.supplier = "Customer is required";
    if (!formsData.product) errors.product = "Product is required";
    if (!formsData.purchaseDate) errors.purchaseDate = "Purchase Date is required";
    if (!formsData.price) errors.price = "Purchase Price is required";
    if (!formsData.unit) errors.unit = "Unit is required";
    if (!formsData.qty) errors.qty = "Quantity is required";
    if (!formsData.description) errors.description = "Description is required";
    if (!formsData.status) errors.status = "Status is required";
    if (Object.keys(errors).length > 0) {
      showMessage("error", errors[Object.keys(errors)[0]]);
      return true;
    }
    return false;
  }

  const submitAction = () => {
    if (validation()) return;
    const reqData = {
      supplier: formsData.supplier,
      product: formsData.product,
      purchaseDate: formsData.purchaseDate,
      price: formsData.price,
      unit: formsData.unit,
      qty: formsData.qty,
      description: formsData.description,
      status: formsData.status,
    }
    const url = selectedData.id ? UPDATE_PURCHASE_DETAILS(selectedData.id) : ADD_PURCHASE_DETAILS;
    const action = selectedData.id ? 'updated' : 'added';
    start()
    sendPostRequest(url, reqData, true).then((res) => {
      if (res.status === 200) {
        successAction()
        showMessage('success', `Purchase successfully ${action}`);
        onClose();
      } else if (res.status === 400) {
        showMessage('error', res.data);
      } else if (res.status === 409) {
        showMessage('error', res.message);
      } else {
        showMessage('error', "Something went wrong in " + action + " purchase!");
      }
    }).catch((err) => {
      console.log(err);
      showMessage('error', "Something went wrong in " + action + " purchase!");
    }).finally(() => stop())
  }

  return (
    <>
      <Loader />
      <PopupAction onClose={onClose} title={title} width={700}
        actions={
          !readOnly && (
            <Button variant="contained" color="primary" onClick={submitAction}>
              Save
            </Button>
          )
        }
      >

        <Grid container spacing={3} style={{ padding: 20 }}>
          <Grid item xs={6}>
            <TextField fullWidth id="Supplier"
              onChange={handleInputChange}
              name='supplier'
              label="Supplier"
              variant='outlined'
              size='small'
              value={formsData.supplier} select>
              {suppliers.map((item) => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth id="Product"
              onChange={handleInputChange}
              name='product'
              label="Product"
              variant='outlined'
              size='small'
              value={formsData.product} select>
              {products.map((item) => (
                <MenuItem value={item.id}>{item.name}-{item.pCode}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              name="purchaseDate"
              value={formsData.purchaseDate}
              onChange={handleInputChange}
              label="Purchase Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                format: "MM/dd/yy"
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              name='price'
              size='small'
              value={formsData.price}
              placeholder="Enter Price..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Unit"
              variant="outlined"
              fullWidth
              name='unit'
              size='small'
              value={formsData.unit}
              placeholder="Enter Unit..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              name='qty'
              size='small'
              value={formsData.qty}
              placeholder="Enter Quantity..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              size='small'
              name='description'
              InputProps={{
                readOnly: readOnly,
              }}
              value={formsData.description}
              placeholder="Enter Description..."
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="status"
              onChange={handleInputChange}
              name='status'
              label="Status"
              variant='outlined'
              size='small'
              value={formsData.status} select>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </PopupAction>
    </>
  );
};

export default PurchaseAction;

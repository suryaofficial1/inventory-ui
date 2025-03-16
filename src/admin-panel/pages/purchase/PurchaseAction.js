import { Button, Grid, MenuItem, TextField } from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PopupAction from '../../../common/PopupAction';
import ProductSpellSearch from '../../../common/select-box/ProductSpellSearch';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';
import UnitSelect from '../../../common/select-box/UnitSelect';
import { ADD_PURCHASE_DETAILS, UPDATE_PURCHASE_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendPostRequestWithAuth } from '../../../utils/network';


const PurchaseAction = ({ onClose, successAction, title, selectedData = {}, returns = false, readOnly = false }) => {
  const [formsData, setFormsData] = useState({
    supplier: selectedData?.supplier || {},
    product: selectedData?.product || {},
    purchaseDate: selectedData?.purchaseDate
      ? moment(selectedData.purchaseDate).local().format('YYYY-MM-DD')
      : moment().local().format('YYYY-MM-DD'),
    expiryDate: selectedData?.expiryDate
      ? moment(selectedData.expiryDate).local().format('YYYY-MM-DD')
      : moment().add(3, 'months').local().format('YYYY-MM-DD'),
    description: selectedData?.description || '',
    invoiceNo: selectedData?.invoiceNo || '',
    bNumber: selectedData?.bNumber || '',
    purchaseOrder: selectedData?.purchaseOrder || '',
    qty: selectedData?.qty || '',
    unit: selectedData?.unit || '',
    price: selectedData?.price || '',
    status: selectedData?.status || '1',
  });

  const [errors, setErrors] = useState({});
  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "purchaseDate") {
      console.log("value", value);

      // Convert value (purchaseDate) to a Date object
      const purchaseDate = new Date(value);

      // Add 90 days
      purchaseDate.setDate(purchaseDate.getDate() + 90);
      console.log("purchaseDate", purchaseDate);

      // Format the date to YYYY-MM-DD
      const expiryDate = purchaseDate.toISOString().split("T")[0];
      console.log("expiryDate", expiryDate);

      setFormsData({ ...formsData, ["purchaseDate"]: value, ["expiryDate"]: expiryDate, });
    } else if (name === "qty") {
      const numericValue = Number(value); // Convert to number

      if (numericValue > selectedData.qty) {
        setErrors({ ...errors, "qty": `Quantity cannot be increased beyond : ${selectedData.qty}` })
        return;
      }

      setFormsData((prev) => ({
        ...prev,
        [name]: numericValue, // Update qty if within limit
      }));
    }
    else {
      setFormsData({ ...formsData, [name]: value });
    }

  };


  const validation = () => {
    const errors = {};
    if (!formsData?.supplier?.id) errors.supplier = "Supplier is required";
    if (!formsData?.product?.id) errors.product = "Product is required";
    if (!formsData.invoiceNo) errors.invoiceNo = "Invoice No is required";
    if (!formsData.bNumber) errors.bNumber = "Batch No is required";
    if (!formsData.purchaseDate) errors.purchaseDate = "Purchase Date is required";
    if (!formsData.expiryDate) errors.expiryDate = "Expiry Date is required";
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
      supplier: formsData.supplier.id,
      product: formsData.product.id,
      invoiceNo: formsData.invoiceNo,
      bNumber: formsData.bNumber,
      purchaseDate: formsData.purchaseDate,
      expiryDate: formsData.expiryDate,
      price: formsData.price,
      unit: formsData.unit,
      qty: formsData.qty,
      description: formsData.description,
      status: formsData.status,
    }
    const url = selectedData.id ? UPDATE_PURCHASE_DETAILS(selectedData.id) : ADD_PURCHASE_DETAILS;
    const action = selectedData.id ? 'updated' : 'added';
    start()
    sendPostRequestWithAuth(url, reqData, user.token).then((res) => {
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

  const handleSupplierChange = (e) => {
    setFormsData({ ...formsData, ["supplier"]: e });
  };

  const handleProductChange = (e) => {
    setFormsData({ ...formsData, ["product"]: e });
  };

  const handleReset = () => {
    setFormsData({ ...formsData, ["supplier"]: '', ['product']: '' });
    handleSupplierChange('')
    handleProductChange('')
  };

  return (
    <>
      <Loader />
      <PopupAction onClose={onClose} title={title} width={700}
        actions={
          !readOnly && (
            <Button variant="contained" color="primary" onClick={submitAction}>
              {selectedData.id ? "Update" : "Submit"}
            </Button>
          )
        }
      >

        <Grid container spacing={3} style={{ padding: 20 }}>
          <Grid item xs={6}>

            <SupplierSpellSearch onChange={handleSupplierChange} value={formsData.supplier} onReset={handleReset} />
          </Grid>
          <Grid item xs={6}>
            <ProductSpellSearch onChangeAction={handleProductChange} value={formsData.product} onReset={handleReset} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Invoice No"
              variant="outlined"
              fullWidth
              name='invoiceNo'
              size='small'
              value={formsData.invoiceNo}
              placeholder="Enter Invoice No..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Batch Number"
              variant="outlined"
              fullWidth
              name='bNumber'
              size='small'
              value={formsData.bNumber}
              placeholder="Enter bNumber..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
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
              error={errors.qty} helperText={errors.qty}
              onChange={handleInputChange}
            />
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
                format: "MM/dd/yy",
                readOnly: readOnly,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              name="expiryDate"
              color='secondary'
              value={formsData.expiryDate}
              onChange={handleInputChange}
              label="Expiry Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                format: "MM/dd/yy",
                readOnly: readOnly,
              }}
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

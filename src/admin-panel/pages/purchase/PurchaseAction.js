import { Button, Grid, TextField } from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ProductSpellSearch from '../../../common/input-search/ProductSpellSearch';
import PopupAction from '../../../common/PopupAction';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';
import UnitSelect from '../../../common/select-box/UnitSelect';
import { ADD_PURCHASE_DETAILS, UPDATE_PURCHASE_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendPostRequestWithAuth } from '../../../utils/network';
import { validateNumber } from '../../../utils/validation';


const PurchaseAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
  const [formsData, setFormsData] = React.useState({
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
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [clearSignal, setClearSignal] = useState(0);
  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    if (typeof e === "object" && e?.id && e?.name) {
      setFormsData((prev) => ({ ...prev, product: e, unit: e.unit }));
      return;
    }
    const { name, value } = e.target;
    if (name === "qty") {

      const qtyValidation = validateNumber("Quantity", value);
      if (qtyValidation.error) {
        setErrorMsg(qtyValidation.message);

        return;
      } else {
        setFormsData((prev) => ({ ...prev, ["qty"]: value }));
      }
    }
    if (name === "purchaseDate") {

      // Convert value (purchaseDate) to a Date object
      const purchaseDate = new Date(value);

      // Add 90 days
      purchaseDate.setDate(purchaseDate.getDate() + 90);

      // Format the date to YYYY-MM-DD
      const expiryDate = purchaseDate.toISOString().split("T")[0];

      setFormsData({ ...formsData, ["purchaseDate"]: value, ["expiryDate"]: expiryDate, });
    } else {
      setFormsData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validation = () => {
    const errors = {};
    if (!formsData?.supplier?.id) errors.supplier = "Supplier is required";
    if (!formsData?.product.id) errors.product = "Product is required";
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
      } else if (res.status === 403) {
        showMessage('error', res.message);
      }
      else {
        showMessage('error', "Something went wrong in " + action + " purchase!");
      }
    }).catch((err) => {
      console.log(err);
      showMessage('error', "Something went wrong in " + action + " purchase!");
    }).finally(() => stop())
  }

  const handleSupplierChange = (e) => {
    setErrors({ ...errors, ["supplier"]: "" });
    setClearSignal((prev) => prev + 1);
    setFormsData({ ...formsData, ["supplier"]: e, ['product']: {}, unit: "", invoiceNo: "", bNumber: "" });
  };

  const handleProductChange = (e) => {

    if (!formsData.supplier.id) {
      setErrors({ ...errors, ["supplier"]: "Supplier is required" });
      showMessage('error', "Please select supplier first!");
      setClearSignal((prev) => prev + 1);
      setFormsData((prev) => ({ ...prev, product: {}, unit: "", price: "", qty: "", invoiceNo: "", bNumber: "" }));
      return
    } 

              setFormsData((prev) => ({ ...prev, product: e, unit: e.unit }));

    
    // else {
    //   if (typeof e === "object" && e?.id) {
    //     getPurchaseDetailsByProductId(e);
    //     return;
    //   }
    // }
  };

  const handleReset = () => {
    setFormsData({ ...formsData, ["supplier"]: '', ['product']: '' });
    handleSupplierChange('')
    // handleProductChange('')
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
            {selectedData.id ?
              <TextField
                autoComplete='off'
                label="Supplier name"
                variant="outlined"
                fullWidth
                name='supplier'
                size='small'
                value={formsData.supplier.name}
                InputProps={{
                  readOnly: readOnly,
                }}
              /> : <SupplierSpellSearch onChange={handleSupplierChange} value={formsData.supplier} onReset={handleReset} error={errors.supplier} />
            }
          </Grid>
          <Grid item xs={6}>
            {selectedData.id ?
              <TextField
                autoComplete='off'
                label="Product name"
                variant="outlined"
                fullWidth
                name='product'
                size='small'
                value={formsData.product.name}
                InputProps={{
                  readOnly: readOnly,
                }}
              /> :
              <ProductSpellSearch
                type="purchase"
                onSelect={handleProductChange}
                clearSignal={clearSignal}
              />
            }
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoComplete='off'
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
              autoComplete='off'
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
              autoComplete='off'
              label="Price"
              variant="outlined"
              fullWidth
              name='price'
              size='small'
              type='number'
              value={formsData.price}
              placeholder="Enter Price..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete='off'
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
              error={Boolean(errorMsg)}
              helperText={errorMsg}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              autoComplete='off'
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
              autoComplete='off'
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
              autoComplete='off'
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
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
          {/* <Grid item xs={12}>
            <TextField
                            autoComplete='off' fullWidth id="status"
              onChange={handleInputChange}
              name='status'
              label="Status"
              variant='outlined'
              size='small'
              value={formsData.status} select>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">Inactive</MenuItem>
            </TextField>
          </Grid> */}
        </Grid>
      </PopupAction>
    </>
  );
};

export default PurchaseAction;

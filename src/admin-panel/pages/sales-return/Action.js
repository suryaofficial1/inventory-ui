import { Button, Grid, MenuItem, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PopupAction from '../../../common/PopupAction';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';
import ProductionProductSelect from '../../../common/select-box/ProductionProductSelect';
import UnitSelect from '../../../common/select-box/UnitSelect';
import { ADD_RETURN_SALES_DETAILS, SALES_LIST_BY_INVOICE_NO, SALES_RETURN_LIST_BY_INVOICE_NO, UPDATE_RETURN_SALES_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendGetRequest, sendPostRequestWithAuth } from '../../../utils/network';
import { validateNumber } from '../../../utils/validation';
import SalesDetails from './SalesDetails';


const Action = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
  const [formsData, setFormsData] = useState({
    customer: selectedData?.customer ? selectedData.customer : {} || {},
    product: selectedData?.product ? selectedData.product : {} || {},
    // returnDate: moment(selectedData.returnDate).local().format('YYYY-MM-DD') || '',
    rDesc: selectedData?.rDesc || '',
    salesId: selectedData?.salesId || '',
    invoiceNo: selectedData?.invoiceNo || '',
    qty: selectedData?.qty || '',
    unit: selectedData?.unit || '',
    price: selectedData?.salesPrice || '',
    status: selectedData?.status || '1',
  });
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [errors, setErrors] = useState({});
  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "qty") {
      const numericValue = Number(value);
      const qtyValidation = validateNumber("Quantity", value);

      if (qtyValidation.error) {
        setErrors({ ...errors, ["qty"]: qtyValidation.message });
        return;
      }
      if (!formsData.product.id) {
        showMessage("error", "Product selection is required before entering quantity!");
        return;
      }

      // if (numericValue > selectedInvoice.qty) {
      //   setErrors({ ...errors, "qty": `Quantity cannot be increased beyond : ${selectedInvoice.qty}` })
      //   return;
      // }

      setErrors({ ...errors, ["qty"]: "" });
      setFormsData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

    }
    else {
      setFormsData({ ...formsData, [name]: value });
    }

  };

  useEffect(() => {
    if (selectedData?.id) {
      loadSalesDetails(selectedData.invoiceNo)
    }
  }, [selectedData, selectedInvoice.length])

  useEffect(() => {
    if (Object.keys(selectedInvoice).length !== 0) {
      setFormsData((prevFormsData) => ({
        ...prevFormsData,  // Keep existing values
        invoiceNo: selectedInvoice?.invoiceNo ?? prevFormsData.invoiceNo,
        product: selectedInvoice?.product ?? prevFormsData.product,
        customer: selectedInvoice?.customer ?? prevFormsData.customer,
        unit: selectedInvoice?.unit ?? prevFormsData.unit,
        rDesc: selectedInvoice?.rDesc ?? prevFormsData.rDesc,
      }));
    }
  }, [selectedInvoice])

  useEffect(() => {
    if (selectedInvoice.invoiceNo) {
      loadSalesReturnDetails(selectedInvoice.invoiceNo);
    }
  }, [selectedInvoice.invoiceNo]);

  const loadSalesDetails = (data) => {
    start();
    sendGetRequest(`${SALES_LIST_BY_INVOICE_NO}?invoiceNo=${data}`, user.token).then((_res) => {
      if (_res.status === 200) {
        setSelectedInvoice(_res.data[0]);
        setFormsData({ ...formsData, ["invoiceNo"]: _res.data[0].invoiceNo })
      } else if (_res.status === 400) {
        showMessage("error", _res.data[0]);
      } else {
        showMessage("error", "Something went wrong while loading sales details");
      }
    }).catch(err => {
      console.log("err", err)
      showMessage("error", "Something went wrong while loading sales details");
    }).finally(() => stop())
  }

  const loadSalesReturnDetails = (data) => {
    start();
    sendGetRequest(`${SALES_RETURN_LIST_BY_INVOICE_NO}?invoiceNo=${data}`, user.token).then((_res) => {
      if (_res.status === 200) {
        setFormsData((prevFormsData) => ({
          ...prevFormsData,
          qty: _res.data?.qty ?? prevFormsData.qty,
          product: _res.data?.product ?? prevFormsData.product,
          customer: _res.data?.customer ?? prevFormsData.customer,
          // returnDate: _res.data?.returnDate ?? prevFormsData.returnDate,
          unit: _res.data?.unit ?? prevFormsData.unit,
          price: _res.data?.price ?? prevFormsData.price,
          rDesc: _res.data?.rDesc ?? prevFormsData.rDesc,
        }));
        selectedData.id = _res.data.id

      } else if (_res.status === 400) {
        showMessage("error", _res.data[0]);
      } else {
        showMessage("error", "Something went wrong while loading return sales details");
      }
    }).catch(err => {
      console.log("err", err)
      showMessage("error", "Something went wrong while loading return sales details");
    }).finally(() => stop())
  }

  const validation = () => {
    const errors = {};
    if (!formsData.invoiceNo) errors.invoiceNo = "Invoice No is required";
    if (!formsData?.customer?.id) errors.customer = "Customer is required";
    if (!formsData?.product?.id) errors.product = "Product is required";
    if (!formsData.unit) errors.unit = "Unit is required";
    if (!formsData.price) errors.price = "Return Price is required";
    if (!formsData.qty) errors.qty = "Return Quantity is required";
    // if (!formsData.returnDate) errors.returnDate = "Return Date is required";
    if (!formsData.status) errors.status = "Status is required";
    if (!formsData.rDesc) errors.rDesc = "Description is required";

    if (Object.keys(errors).length > 0) {
      showMessage("error", errors[Object.keys(errors)[0]]);
      return true;
    }
    return false;
  }

  const submitAction = () => {
    if (validation()) return;
    const reqData = {
      salesId: selectedInvoice.id,
      customer: formsData.customer.id,
      product: formsData.product.id,
      invoiceNo: formsData.invoiceNo,
      rDesc: formsData.rDesc,
      qty: formsData.qty,
      salesPrice: formsData.price,
      unit: formsData.unit,
      // returnDate: formsData.returnDate,
      status: formsData.status,
    }
    const url = selectedData.id ? UPDATE_RETURN_SALES_DETAILS(selectedData.id) : ADD_RETURN_SALES_DETAILS;
    const action = selectedData.id ? 'updated' : 'added';
    start()
    sendPostRequestWithAuth(url, reqData, user.token).then((res) => {
      if (res.status === 200) {
        successAction()
        showMessage('success', `Return SALES successfully ${action}`);
        onClose();
      } else if (res.status === 400) {
        showMessage('error', res.data);
      } else if (res.status === 409) {
        showMessage('error', res.message);
      } else {
        showMessage('error', "Something went wrong in " + action + " return sales!");
      }
    }).catch((err) => {
      console.log(err);
      showMessage('error', "Something went wrong in " + action + " return sales!");
    }).finally(() => stop())
  }

  const handleCustomerChange = (e) => {
    setFormsData({ ...formsData, ["customer"]: e });
  };

  const handleProductChange = (e) => {
    setFormsData({ ...formsData, ["product"]: e, ["qty"]: '' });
  };

  const qtyHandleChange = (value) => {
    setFormsData({ ...formsData, ["qty"]: value });
  };

  const handleReset = () => {
    setFormsData({ ...formsData, ["customer"]: '', ['product']: '' });
    handleCustomerChange('')
    handleProductChange('')
  };

  return (
    <>
      <Loader />
      <PopupAction onClose={onClose} title={title} width={700}
        actions={
          !readOnly && (
            <Button variant="contained" color="primary" onClick={submitAction}>
              {selectedData.id ? "Update Return" : "Submit Return"}
            </Button>
          )
        }
      >

        <Grid container spacing={3} style={{ padding: 20 }}>
          {!selectedData?.id && <Grid item xs={12}>
            <SalesDetails error={selectedInvoice.length == 0}
              setter={setSelectedInvoice} />
          </Grid>}
          <Grid item xs={6}>
            <TextField
              label="Invoice No"
              variant="outlined"
              fullWidth
              name='invoiceNo'
              size='small'
              focused={formsData.invoiceNo}
              value={formsData.invoiceNo}
              placeholder="Enter Invoice No..."
              InputProps={{
                readOnly: true,
              }}
            // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomerSpellSearch onChange={handleCustomerChange} value={formsData.customer} onReset={handleReset} />
          </Grid>
          <Grid item xs={6}>
            <ProductionProductSelect onChangeAction={handleProductChange} value={formsData.product} />
          </Grid>
          <Grid item xs={6}>
            <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={8}>
            {/* <QtyAction
              value={formsData.qty}
              setter={qtyHandleChange}
              productId={formsData?.product?.id}
              readOnly={readOnly}
              by="sales"
              type="return"
            /> */}
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              name="qty"
              size="small"
              value={formsData.qty}
              placeholder="Enter Quantity..."
              InputProps={{
                readOnly: readOnly,
              }}
              error={Boolean(errors.qty)}
              helperText={errors.qty}
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
              name='rDesc'
              InputProps={{
                readOnly: readOnly,
              }}
              value={formsData.rDesc}
              placeholder="Enter rDesc..."
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

export default Action;

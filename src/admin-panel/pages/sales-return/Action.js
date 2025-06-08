import { Button, Grid, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SalesProductSpellSearch from '../../../common/input-search/SalesProductSpellSearch';
import PopupAction from '../../../common/PopupAction';
import CustomerSpellSearch from '../../../common/select-box/CustomerSpellSearch';
import UnitSelect from '../../../common/select-box/UnitSelect';
import { ADD_RETURN_SALES_DETAILS, SALES_DETAIL_BY_PRODUCT_ID, SALES_ITEM_AVAILABLE_QTY, UPDATE_RETURN_SALES_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendGetRequest, sendPostRequestWithAuth } from '../../../utils/network';
import { validateNumber } from '../../../utils/validation';


const Action = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
  const [formsData, setFormsData] = useState({
    customer: selectedData?.customer ? selectedData.customer : '' || '',
    product: selectedData?.product ? selectedData.product : {} || {},
    rDesc: selectedData?.rDesc || '',
    invoiceNo: selectedData?.invoiceNo || '',
    qty: selectedData?.qty || '',
    unit: selectedData?.unit || '',
    price: selectedData?.salesPrice || '',
    status: selectedData?.status || '1',
    salesId: selectedData?.salesId || '',
    productionId: selectedData?.productionId || '',
  });
  const [clearSignal, setClearSignal] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
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
      if (!formsData.product) {
        showMessage("error", "Product selection is required before entering quantity!");
        return;
      }

      if (numericValue > availableQty) {
        setErrors({ ...errors, ["qty"]: `Quantity cannot exceed available stock: ${availableQty}` });
        return;
      }
      setErrors({ ...errors, ["qty"]: "" });
      setFormsData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormsData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validation = () => {
    const errors = {};
    if (!formsData?.customer?.id) {
      setErrors({ ...errors, ["customer"]: "Customer is required" });
      errors.customer = "Customer is required"
    };
    if (!formsData?.product?.id) errors.product = "Product is required";
    if (!formsData.invoiceNo) errors.invoiceNo = "Invoice No is required";
    if (!formsData.unit) errors.unit = "Unit is required";
    if (!formsData.price) errors.price = "Return Price is required";
    if (!formsData.qty) errors.qty = "Return Quantity is required";
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
      productionId: formsData.productionId,
      salesId: formsData.salesId,
      customer: formsData.customer.id,
      product: formsData.product.id,
      invoiceNo: formsData.invoiceNo,
      rDesc: formsData.rDesc,
      qty: formsData.qty,
      salesPrice: formsData.price,
      unit: formsData.unit,
      status: formsData.status,
    }
    const url = selectedData.id ? UPDATE_RETURN_SALES_DETAILS(selectedData.id) : ADD_RETURN_SALES_DETAILS;
    const action = selectedData.id ? 'updated' : 'added';
    start()
    sendPostRequestWithAuth(url, reqData, user.token).then((res) => {
      if (res.status === 200) {
        successAction()
        showMessage('success', `Return sales successfully ${action}`);
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

  useEffect(() => {
    if (formsData?.product?.id) {
      getAvailableQty();
    }
  }, [formsData?.product?.id]);


  const getAvailableQty = async () => {
    try {
      const res = await sendGetRequest(`${SALES_ITEM_AVAILABLE_QTY(formsData?.product?.id)}?type=sales_return&customer=${formsData?.customer?.id}`, user.token);
      if (res.status === 200) {
        setAvailableQty(res.data.availableQty || 0);
      } else {
        console.error("Error in getting available quantity", res.data);
        return 0;
      }
    } catch (err) {
      console.error("Error fetching available quantity", err);
      return 0;
    }
  };

  const handleCustomerChange = (e) => {
    setErrors({ ...errors, ["customer"]: "", qty: "" });
    setClearSignal((prev) => prev + 1);
    setFormsData({ ...formsData, ["customer"]: e, ['product']: {}, unit: "" , price: "", qty: ""});
  };

  const getProductionDetailsByProductId = (e) => {
    start();
    console.log(e);
    sendGetRequest(SALES_DETAIL_BY_PRODUCT_ID(e.product.id, formsData.customer.id,  'sales_return'), user.token).then((res) => {
      if (res.status === 200) {
        console.log(res.data, "Object.keys(res.data).length !== 0", Object.keys(res.data).length !== 0,);
        if (Object.keys(res.data).length !== 0 && e.customer.id == formsData.customer.id) {
          setClearSignal((prev) => prev + 1);
            setFormsData((prev) => ({ ...prev, product: {}, unit: "", price: "", qty: "", invoiceNo: "", productionId: '', salesId: '' }));
          showMessage('error', "Product already exists on sales return list please update this product!");
        } else {
            setFormsData((prev) => ({ ...prev, product: e.product, unit: e.unit, productionId: e.productionId, salesId: e.id }));
        }
      }
    }).catch((err) => {
      console.log("err", err);
    }).finally(() => {
      stop();
    });
  }

  const handleProductChange = (e) => {
    if (!formsData.customer) {
            setErrors({ ...errors, ["customer"]: "Customer is required" });
            showMessage('error', "Please select customer first!");
            setClearSignal((prev) => prev + 1);
            setFormsData((prev) => ({ ...prev, product: {}, unit: "", price: "", qty: "", invoiceNo: "", productionId: '', salesId: '' }));
    } else {
      
      if (typeof e === "object" && e?.id) {
        setErrors({ ...errors, ["customer"]: "", ["qty"]: "" });
        setFormsData((prev) => ({ ...prev, product: {}, unit: "", price: "", qty: "", invoiceNo: "", productionId: '', salesId: '' }));
        getProductionDetailsByProductId(e);
        return;
      }
    }
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

          <Grid item xs={6}>
            {selectedData.id ?
              <TextField
                            autoComplete='off'
                label="Customer"
                variant="outlined"
                fullWidth
                name='customer'
                size='small'
                value={formsData.customer.name}
                placeholder="Enter customer name..."
                InputProps={{
                  readOnly: true,
                }}
              />
              :
              <CustomerSpellSearch
                onChange={handleCustomerChange}
                value={formsData.customer}
                onReset={handleReset}
                error={errors.customer}
              />}
          </Grid>
          <Grid item xs={6}>
            {selectedData.id ?
              <TextField
                            autoComplete='off'
                label="Product"
                variant="outlined"
                fullWidth
                name='product'
                size='small'
                value={formsData.product.name}
                placeholder="Enter product name..."
                InputProps={{
                  readOnly: true,
                }}
              />
              :
              <SalesProductSpellSearch onSelect={handleProductChange}
                clearSignal={clearSignal} customer={formsData.customer} />}

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
          <Grid item xs={4}>
            <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
          </Grid>
          <Grid item xs={8}>
            <TextField
                            autoComplete='off'
              label="Quantity"
              variant="outlined"
              fullWidth
              name="qty"
              // type='number'
              size='small'
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
                            autoComplete='off'
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
        </Grid>
      </PopupAction>
    </>
  );
};

export default Action;

import { Button, Grid, TextField } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PurchaseItemsSpellSearch from '../../../common/input-search/PurchaseItemsSpellSearch';
import PopupAction from '../../../common/PopupAction';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';
import UnitSelect from '../../../common/select-box/UnitSelect';
import { ADD_RETURN_PURCHASE_DETAILS, AVAILABLE_PURCHASE_PRODUCT_QTY, PURCHASE_DETAILS_BY_PRODUCT_ID, UPDATE_RETURN_PURCHASE_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendGetRequest, sendPostRequestWithAuth } from '../../../utils/network';
import { validateNumber } from '../../../utils/validation';

const Action = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
  const [formsData, setFormsData] = React.useState({
    supplier: selectedData?.supplier ? selectedData.supplier : {} || {},
    product: selectedData?.product ? selectedData.product : {} || {},
    returnDate: moment(selectedData.returnDate).local().format('YYYY-MM-DD') || '',
    desc: selectedData?.rDesc || '',
    purchaseId: selectedData?.purchaseId || '',
    invoiceNo: selectedData?.invoiceNo || '',
    bNumber: selectedData?.bNumber || '',
    qty: selectedData?.qty || '',
    unit: selectedData?.unit || '',
    price: selectedData?.price || '',
    id: selectedData?.id || '',
  });
  const [availableQty, setAvailableQty] = useState(0);
  const [errors, setErrors] = useState({});
  const [clearSignal, setClearSignal] = useState(0);
  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };

  const qtyHandleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    const qtyValidation = validateNumber("Quantity", value);
    if (qtyValidation.error) {
      setErrors({ ...errors, ["qty"]: qtyValidation.message });
      return;
    }
    if (!formsData?.product?.id) {
      showMessage("error", "Product selection is required before entering quantity!");
      return;
    }

    if (numericValue > availableQty) {
      setErrors({ ...errors, ["qty"]: `Quantity cannot exceed available stock: ${availableQty}` });
      return;
    }
    setErrors({ ...errors, ["mqty"]: "" });
    setFormsData((prev) => ({
      ...prev,
      ["qty"]: numericValue,
    }));

  };

  useEffect(() => {
    if (formsData.product.id) {
      getAvailableQty();
    }
  }, [formsData.product.id]);

  const getAvailableQty = async () => {
    try {
      const res = await sendGetRequest(AVAILABLE_PURCHASE_PRODUCT_QTY(formsData.purchaseId, formsData.product.id, formsData.supplier.id), user.token);
      if (res.status === 200) {
        setAvailableQty(res.data.availableQty);
      } else {
        console.error("Error in getting available quantity", res.data);
        return 0;
      }
    } catch (err) {
      console.error("Error fetching available quantity", err);
      return 0;
    }
  };

  const getPurchaseDetailsByProductId = (e) => {
    start();
    sendGetRequest(PURCHASE_DETAILS_BY_PRODUCT_ID(e.id, e.product.id, formsData.supplier.id, 'purchase_return'), user.token).then((res) => {
      if (res.status === 200) {
        if (Object.keys(res.data).length !== 0) {
          setClearSignal((prev) => prev + 1);
          setFormsData((prev) => ({ ...prev, product: {}, unit: "", price: "", qty: "", invoiceNo: "", bNumber: "" }));
          showMessage('error', "Product already exists on purchase return list please update this product!");
        } else {
          setFormsData((prev) => ({
            ...prev,
            product: e.product,
            unit: e.unit,
            purchaseId: e.id,
            invoiceNo: e.invoiceNo,
            bNumber: e.bNumber
          }));
        }
      }
    }).catch((err) => {
      console.log("err", err);
    }).finally(() => {
      stop();
    });
  }

  console.log("formsData", formsData);

  const handleProductChange = (e) => {

    if (!formsData.supplier.id) {
      setErrors({ ...errors, ["supplier"]: "Supplier is required" });
      showMessage('error', "Please select supplier first!");
      setClearSignal((prev) => prev + 1);
      setFormsData((prev) => ({ ...prev, product: {}, unit: "", price: "", qty: "", invoiceNo: "", bNumber: "", purchaseId: "" }));
      return
    } else {
      if (typeof e === "object" && e?.id) {
        getPurchaseDetailsByProductId(e);
        return;
      }
    }
  };

  const handleSupplierChange = (e) => {
    setErrors({ ...errors, ["supplier"]: "" });
    setClearSignal((prev) => prev + 1);
    setFormsData({ ...formsData, ["supplier"]: e, ['product']: {}, unit: "", qty: "", invoiceNo: "", bNumber: "", purchaseId: "" });
  };

  const handleReset = () => {
    setFormsData({ ...formsData, ["supplier"]: '', ['product']: '' });
    handleSupplierChange('')
    // handleProductChange('')
  };

  const validation = () => {
    const errors = {};

    if (!formsData?.product?.id) errors.product = "Product is required";
    if (!formsData.invoiceNo) errors.invoiceNo = "Invoice No is required";
    if (!formsData?.bNumber) errors.bNumber = "Batch Number is required";
    if (!formsData?.supplier?.id) errors.supplier = "Supplier is required";
    if (!formsData.unit) errors.unit = "Unit is required";
    if (!formsData.price) errors.price = "Return Price is required";
    if (!formsData.qty) errors.qty = "Return Quantity is required";
    if (!formsData.desc) errors.desc = "Description is required";
    if (Object.keys(errors).length > 0) {
      showMessage("error", errors[Object.keys(errors)[0]]);
      return true;
    }
    return false;
  }

  const submitAction = () => {
    if (validation()) return;
    const reqData = {
      purchaseId: formsData.purchaseId,
      supplier: formsData.supplier.id,
      product: formsData.product.id,
      invoiceNo: formsData.invoiceNo,
      bNumber: formsData.bNumber,
      desc: formsData.desc,
      qty: formsData.qty,
      price: formsData.price,
      unit: formsData.unit,
    }
    const url = selectedData.id ? UPDATE_RETURN_PURCHASE_DETAILS(selectedData.id) : ADD_RETURN_PURCHASE_DETAILS;
    const action = selectedData.id ? 'updated' : 'added';
    start()
    sendPostRequestWithAuth(url, reqData, user.token).then((res) => {
      if (res.status === 200) {
        successAction()
        showMessage('success', `Return Purchase successfully ${action}`);
        onClose();
      } else if (res.status === 400) {
        showMessage('error', res.data);
      } else if (res.status === 401) {
        showMessage('error', res.message);
      } else if (res.status === 409) {
        showMessage('error', res.message);
      } else {
        showMessage('error', "Something went wrong in " + action + " return purchase!");
      }
    }).catch((err) => {
      console.log(err);
      showMessage('error', "Something went wrong in " + action + " return purchase!");
    }).finally(() => stop())
  }

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
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>  {!selectedData?.id ?
            <PurchaseItemsSpellSearch
              type="purchase"
              onSelect={handleProductChange}
              clearSignal={clearSignal}
              supplier={formsData.supplier.id}
            />
            :
            <TextField
              autoComplete='off'
              label="Product"
              variant="outlined"
              fullWidth
              name='product'
              size='small'
              focused={formsData?.product?.name}
              value={formsData?.product?.name}
              InputProps={{
                readOnly: true,
              }}
            />
          }
          </Grid>
          <Grid item xs={12} sm={6}>
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
                readOnly: true,
              }}
            // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete='off'
              label="Batch Number"
              variant="outlined"
              fullWidth
              name='bNumber'
              size='small'
              value={formsData.bNumber}
              InputProps={{
                readOnly: true,
              }}
            // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <UnitSelect onChange={handleInputChange} value={formsData.unit} readOnly={readOnly} />
          </Grid>
          <Grid item xs={12} sm={6}>
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
              autoComplete='off' fullWidth id="Return-Quantity"
              onChange={qtyHandleChange}
              name='qty'
              label="Return Quantity"
              variant='outlined'
              size='small'
              value={formsData.qty}
              error={Boolean(errors.qty)}
              helperText={errors.qty}
            />
            {/* <QtyAction
              value={formsData.qty}
              setter={qtyHandleChange}
              productId={formsData?.id}
              readOnly={readOnly}
              by="purchase"
              type="return"
            /> */}
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
              name='desc'
              InputProps={{
                readOnly: readOnly,
              }}
              value={formsData.desc}
              placeholder="Enter desc..."
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </PopupAction>
    </>
  );
};

export default Action;

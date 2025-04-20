import { Button, Grid, TextField } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PopupAction from '../../../common/PopupAction';
import QtyAction from '../../../common/quntity-update/QtyAction';
import SupplierSpellSearch from '../../../common/select-box/SupplierSpellSearch';
import UnitSelect from '../../../common/select-box/UnitSelect';
import { ADD_RETURN_PURCHASE_DETAILS, PURCHASE_LIST_BY_PRODUCT, PURCHASE_RETURN_LIST_BY_PRODUCTS, UPDATE_RETURN_PURCHASE_DETAILS } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { showMessage } from '../../../utils/message';
import { sendGetRequest, sendPostRequestWithAuth } from '../../../utils/network';
import PurchaseDetails from '../purchase/PurchaseDetails';


const Action = ({ onClose, successAction, title, selectedData = {}, returns = false, readOnly = false }) => {
  const [formsData, setFormsData] = useState({
    supplier: selectedData?.supplier ? selectedData.supplier : {} || {},
    product: selectedData?.product ? selectedData.product : '' || '',
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

  const [selectedProduct, setSelectedProduct] = useState({});
  const [{ start, stop }, Loader] = useLoader();
  const user = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormsData({ ...formsData, [name]: value });
  };

  // useEffect(() => {
  //   if (selectedData?.id) {
  //     loadPurchaseDetails(selectedData.id)
  //   }
  // }, [selectedData, selectedProduct.length])

  useEffect(() => {
    if (Object.keys(selectedProduct).length !== 0) {
      // setFormsData({ ...formsData, ["invoiceNo"]: selectedInvoice.invoiceNo, ["bNumber"]: selectedInvoice.bNumber })
      setFormsData((prevFormsData) => ({
        ...prevFormsData,  // Keep existing values
        invoiceNo: selectedProduct?.invoiceNo ?? prevFormsData.invoiceNo,
        bNumber: selectedProduct?.bNumber ?? prevFormsData.bNumber,
        product: selectedProduct?.product ?? prevFormsData.product,
        supplier: selectedProduct?.supplier ?? prevFormsData.supplier,
        unit: selectedProduct?.unit ?? prevFormsData.unit,
        desc: selectedProduct?.rDesc ?? prevFormsData.desc,
        id: selectedProduct?.id ?? prevFormsData.id
      }));
    }
  }, [selectedProduct]);

  // useEffect(() => {
  //   if (selectedProduct.id) {
  //     loadPurchaseReturnDetails(selectedProduct.id);
  //   }
  // }, [selectedProduct.id]);


  const loadPurchaseDetails = (id) => {
    start();
    sendGetRequest(`${PURCHASE_LIST_BY_PRODUCT}?id=${id}`, user.token).then((_res) => {
      if (_res.status === 200) {
        setSelectedProduct(_res.data[0]);
        setFormsData((prevFormsData) => ({
          ...prevFormsData,
          invoiceNo: _res.data[0].invoiceNo,
          bNumber: _res.data[0].bNumber,
          product: _res.data[0].product,
          supplier: _res.data[0].supplier,
          unit: _res.data[0].unit,
          desc: _res.data[0].rDesc,
          id: _res.data[0].id
        }));
      } else if (_res.status === 400) {
        showMessage("error", _res.data[0]);
      } else {
        showMessage("error", "Something went wrong while loading purchase details");
      }
    }).catch(err => {
      console.log("err", err)
      showMessage("error", "Something went wrong while loading purchase details");
    }).finally(() => stop())
  }

  const loadPurchaseReturnDetails = (data) => {
    start();
    sendGetRequest(`${PURCHASE_RETURN_LIST_BY_PRODUCTS}?id=${data}`, user.token).then((_res) => {
      if (_res.status === 200) {
        setFormsData((prevFormsData) => ({
          ...prevFormsData,
          qty: _res.data?.qty ?? prevFormsData.qty,
          product: _res.data?.product ?? prevFormsData.product,
          supplier: _res.data?.supplier ?? prevFormsData.supplier,
          returnDate: _res.data?.returnDate ?? prevFormsData.returnDate,
          unit: _res.data?.unit ?? prevFormsData.unit,
          price: _res.data?.price ?? prevFormsData.price,
          desc: _res.data?.rDesc ?? prevFormsData.desc,
          id: data
        }));
        selectedData.id = _res.data.id
      } else if (_res.status === 400) {
        showMessage("error", _res.data[0]);
      } else {
        showMessage("error", "Something went wrong while loading purchase details");
      }
    }).catch(err => {
      console.log("err", err)
      showMessage("error", "Something went wrong while loading purchase details");
    }).finally(() => stop())
  }

  const validation = () => {
    const errors = {};
    if (!formsData.invoiceNo) errors.invoiceNo = "Invoice No is required";
    if (!formsData?.bNumber) errors.bNumber = "Batch Number is required";
    if (!formsData?.supplier?.id) errors.supplier = "Supplier is required";
    if (!formsData?.product) errors.product = "Product is required";
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
      purchaseId: formsData.id,
      supplier: formsData.supplier.id,
      product: formsData.product,
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

  const handleSupplierChange = (e) => {
    setFormsData({ ...formsData, ["supplier"]: e });
  };

  const handleProductChange = (e) => {
    setFormsData({ ...formsData, ["product"]: e, ["qty"]: '' });
  };

  const handleReset = () => {
    setFormsData({ ...formsData, ["supplier"]: '', ['product']: '' });
    handleSupplierChange('')
    handleProductChange('')
  };

  const qtyHandleChange = (value) => {
    setFormsData({ ...formsData, ["qty"]: value });
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
            <PurchaseDetails error={selectedProduct.length == 0}
              setter={setSelectedProduct} />
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
            <TextField
              label="Batch Number"
              variant="outlined"
              fullWidth
              name='bNumber'
              size='small'
              focused={formsData.bNumber}
              value={formsData.bNumber}
              placeholder="Enter bNumber..."
              InputProps={{
                readOnly: true,
              }}
            // onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <SupplierSpellSearch onChange={handleSupplierChange} value={formsData.supplier} onReset={handleReset} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              name='product'
              size='small'
              value={formsData.product}
              placeholder="Enter Product Name..."
              InputProps={{
                readOnly: readOnly,
              }}
              onChange={handleInputChange}
            />
            {/* <ProductSpellSearch type="purchase" onChangeAction={handleProductChange} value={formsData.product} onReset={handleReset} /> */}
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
          <Grid item xs={12}>
            <QtyAction
              value={formsData.qty}
              setter={qtyHandleChange}
              productId={formsData?.id}
              readOnly={readOnly}
              by="purchase"
              type="return"
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

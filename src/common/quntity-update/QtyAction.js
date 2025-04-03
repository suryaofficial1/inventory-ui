import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AVAILABLE_PRODUCT_QTY } from '../../config/api-urls';
import { sendGetRequest } from '../../utils/network';
import { validateNumber } from '../../utils/validation';
import { TextField } from '@material-ui/core';

const QtyAction = ({ value, setter, productId, readOnly, by, type }) => {
    const user = useSelector((state) => state.user);
    const [errorMsg, setErrorMsg] = useState('');


    useEffect(() => {
        if (productId) {
            getAvailableQty();
        }
    }, [productId]);

    const getAvailableQty = async () => {
        try {
            const res = await sendGetRequest(AVAILABLE_PRODUCT_QTY(productId,by, type), user.token);
            if (res.status === 200) {
                return { availableQty: res.data.availableQty, totalPurchased: res.data.totalPurchased };
            } else {
                console.error("Error in getting available quantity", res.data);
                return 0;
            }
        } catch (err) {
            console.error("Error fetching available quantity", err);
            return 0;
        }
    };

    const handleInputChange = async (e) => {
        const enteredValue = e.target.value;
        const qtyValidation = validateNumber("Quantity", enteredValue);

        if (qtyValidation.error) {
            setErrorMsg(qtyValidation.message);
            return;
        }

        if (!productId) {
            setErrorMsg('Product selection is required before entering quantity!');
            return;
        }

        const { availableQty, totalPurchased } = await getAvailableQty();
        if (Number(enteredValue) > Number(availableQty)) {
            let message = '';

            if (availableQty == 0 && type === 'return') {
                message = `No quantity has been ${by}, so returns are not allowed.`;
            } else {
                message = `Only ${availableQty} units are available in stock. Please enter a valid quantity.`;
            }

            setErrorMsg(message);
            return;
        }

        setter(enteredValue);
        setErrorMsg(''); // Clear error message on successful input
    };

    return (
        <div>
            <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                name="qty"
                size="small"
                value={value}
                placeholder="Enter Quantity..."
                InputProps={{
                    readOnly: readOnly,
                }}
                error={Boolean(errorMsg)}
                helperText={errorMsg}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default QtyAction;

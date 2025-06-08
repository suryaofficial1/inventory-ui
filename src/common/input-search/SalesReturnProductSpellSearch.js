import {
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    TextField
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { SALES_RETURN_PRODUCTS_LIST } from '../../config/api-urls';
import { sendGetRequest } from '../../utils/network';

// Styled components
const CustomListItem = styled(ListItemButton)(({ theme }) => ({
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    cursor: 'pointer',
}));

const CustomListItemText = styled(ListItemText)({
    '& .MuiTypography-root': {
        fontSize: '12px',
    },
});

const SalesReturnProductSpellSearch = ({ onSelect, clearSignal }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        setQuery('');
        setResults([]);
        setShowDropdown(false);
    }, [clearSignal]);


    const getProducts = async (searchTerm) => {
        if (!searchTerm) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);
        try {
            const res = await sendGetRequest(`${SALES_RETURN_PRODUCTS_LIST}?product=${searchTerm}`, user.token);
            if (res.status === 200) {
                // const filtered = res.data.filter((product) =>
                //     product.name.toLowerCase().includes(searchTerm.toLowerCase())
                // );
                setResults(res.data);
                setShowDropdown(true);
            } else {
                console.error('Error fetching sales return products:', res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(debounce(getProducts, 400), [user.token]);

    const handleChange = (e) => {
        setLoading(true);
        const value = e.target.value;
        setQuery(value);
        debouncedFetch(value);
    };

    const handleSelect = (e, item) => {
        e.preventDefault();
        setQuery(item.product.name);
        if (onSelect) {
            onSelect(item);
        }
        setShowDropdown(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <TextField
                label="Search Product by name"
                placeholder='Enter product name...'
                variant="outlined"
                fullWidth
                size="small"
                value={query}
                autoComplete='off'
                onChange={handleChange}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onFocus={() => query && results.length && setShowDropdown(true)}
                InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                }}
            />

            {showDropdown && results.length > 0 && (
                <Paper
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        maxHeight: 200,
                        overflowY: 'auto',
                    }}
                >
                    <List disablePadding>
                        {results.map((item, index) => (
                            <CustomListItem button key={index} onMouseDown={(e) => handleSelect(e, item)}>
                                <CustomListItemText primary={item.product.name} />
                            </CustomListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
};

export default SalesReturnProductSpellSearch;

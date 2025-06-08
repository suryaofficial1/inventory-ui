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
import { PRODUCTS_LIST } from '../../config/api-urls';
import { sendGetRequest } from '../../utils/network';

const CustomListItem = styled(ListItemButton)({
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    cursor: 'pointer',
});

const SpellSearchProductInput = ({ type, onSelect, value }) => {
    const [query, setQuery] = useState(value || '');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    const getProducts = async (searchTerm) => {
        setLoading(true);
        try {
            const res = await sendGetRequest(PRODUCTS_LIST(type), user.token);
            if (res.status === 200) {
                const filtered = res.data.filter((product) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setResults(filtered);
                setShowDropdown(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(debounce(getProducts, 400), [type, user.token]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedFetch(value);
    };

    const handleSelect = (item) => {
        if (item && onSelect) {
            onSelect(item);
        }
        setShowDropdown(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <TextField
                label="Add Or Update Product"
                placeholder='Type product name...'
                variant="outlined"
                fullWidth
                size="small"
                value={query}
                autoComplete='off'
                onChange={handleChange}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onFocus={() => query && setShowDropdown(true)}
                InputProps={{
                    endAdornment: loading && <CircularProgress size={20} />,
                }}
            />
            {showDropdown && (
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
                            <CustomListItem key={index} onMouseDown={() => handleSelect(item)}>
                                <ListItemText primary={item.name} />
                            </CustomListItem>
                        ))}
                        {results.length === 0 && query && (
                            <CustomListItem onMouseDown={() => handleSelect({ id: null, name: query })}>
                                <ListItemText primary={`Add "${query}"`} />
                            </CustomListItem>
                        )}
                    </List>
                </Paper>
            )}
        </div>
    );
};

export default SpellSearchProductInput;

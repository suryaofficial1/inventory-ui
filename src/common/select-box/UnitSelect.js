import { MenuItem, TextField } from "@material-ui/core"
import React from "react"

const UnitSelect = ({ onChange, value, readOnly }) => {
    return (
        <>
            <TextField fullWidth id="unit"
                onChange={onChange}
                name='unit'
                label="Unit"
                size="small"
                variant='outlined'
                InputProps={{
                    readOnly: readOnly,
                }}
                value={value} select>
                <MenuItem size="small" value="Mtr">Mtr</MenuItem>
                <MenuItem value="Kg">Kgs</MenuItem>
                <MenuItem value="Nos">Nos</MenuItem>
                <MenuItem value="Bag">Bags</MenuItem>
                <MenuItem value="Box">Box</MenuItem>
            </TextField>
        </>
    )
}
export default UnitSelect
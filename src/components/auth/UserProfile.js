import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import React, { useEffect } from 'react'
import PopupAction from '../../common/PopupAction'
import SingleUploader from '../../common/uploader/SingleUploader'
import { GET_USER_BY_ID, UPDATE_USER_BY_ID } from '../../config/api-urls'
import { useLoader } from '../../hooks/useLoader'
import { showMessage } from '../../utils/message'
import { sendGetRequest, sendPostRequestWithImage } from '../../utils/network'
import { useDispatch } from 'react-redux'
import { storeUserSession } from './StoreUserSession'

const UserProfile = (props) => {
    const dispatch = useDispatch();

    const [formsData, setFormsData] = React.useState({
        name: '',
        email: '',
        profile: '',
        mobile: '',
        role: '',
        department: '',
        status: '',
    });
    const [{ start, stop }, Loader, loading] = useLoader();

    useEffect(() => {
        getUserDetails()
    }, [])

    const submitAction = () => {
        const formData = new FormData();
        Object.entries(formsData).forEach(([key, value]) => formData.append(key, value));
        start()
        sendPostRequestWithImage(UPDATE_USER_BY_ID(props.id), formData, true).then((res) => {
            if (res.status === 200) {
                storeUserSession(dispatch, res.data);
                showMessage('success', `Details update successfully`);
                props.onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in update details");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in update details");
        }).finally(() => stop())
    }

    const handleImageChange = (updatedImage) => {
        setFormsData(prevData => ({ ...prevData, profile: updatedImage }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update form data
        setFormsData((prev) => ({ ...prev, [name]: value }));
    };

    const getUserDetails = () => {
        start()
        sendGetRequest(GET_USER_BY_ID(props.id), "token")
            .then(res => {
                if (res.status === 200) {
                    setFormsData((prev) => ({ ...prev, name: res.data.name, email: res.data.email, profile: res.data.profile, mobile: res.data.mobile, role: res.data.role, department: res.data.department, status: res.data.status }));
                } else {
                    console.log(res)
                }
            }).catch(err => {
                console.log(err)
            }).finally(stop)
    }
    return (<>
        <PopupAction onClose={props.onClose} title={'Edit Profile'} width={500}
            actions={
                <Button variant="contained" color="primary" onClick={submitAction}>
                    Save
                </Button>
            }
        >
            <Loader loading={loading} />
            <Grid container spacing={3} style={{ padding: 20 }}>
                <Grid item xs={12}>
                    <SingleUploader readOnly={false}
                        image={formsData.profile}
                        onChange={handleImageChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        size='small'
                        name='name'
                        value={formsData.name}
                        placeholder="Enter Name..."
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name='email'
                        size='small'
                        value={formsData.email}
                        placeholder="Enter Email..."
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Mobile"
                        variant="outlined"
                        fullWidth
                        name='mobile'
                        size='small'
                        value={formsData.mobile}
                        placeholder="Enter Mobile..."
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Role"
                        variant="outlined"
                        fullWidth
                        name='role'
                        size='small'
                        InputProps={{
                            readOnly: true
                        }}
                        value={formsData.role}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Department"
                        variant="outlined"
                        fullWidth
                        name='department'
                        size='small'
                        InputProps={{
                            readOnly: true
                        }}
                        value={formsData.department}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
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
        </PopupAction >
    </>)
}

export default UserProfile
import { Button, Grid, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PopupAction from '../../common/PopupAction'
import SingleUploader from '../../common/uploader/SingleUploader'
import { GET_USER_BY_ID, UPDATE_PASSWORD_BY_ID, UPDATE_USER_BY_ID } from '../../config/api-urls'
import { useLoader } from '../../hooks/useLoader'
import { showMessage } from '../../utils/message'
import { sendGetRequest, sendPostRequest, sendPostRequestWithImage } from '../../utils/network'
import { validateContactNumber, validateEmail } from '../../utils/validation'
import { storeUserSession } from './StoreUserSession'

const UserProfile = (props) => {
    const dispatch = useDispatch();

    const [formsData, setFormsData] = useState({
        name: '',
        email: '',
        profile: '',
        mobile: '',
        role: '',
        department: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        password: '',
        rePassword: ''
    });
    const [errors, setErrors] = useState({});
    const [{ start, stop }, Loader, loading] = useLoader();
    const user = useSelector((state) => state.user);


    useEffect(() => {
        getUserDetails()
    }, []);


    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        // Real-time validation for specific fields
        if (name === "password" || name === "rePassword") {
            validatePasswords(name === "password" ? value : passwordData.password, name === "rePassword" ? value : passwordData.rePassword);
        }
    };

    const validatePasswords = (password, rePassword) => {
        const newErrors = { ...errors };
        // Validate matching passwords
        if (password && rePassword && password !== rePassword) {
            newErrors.rePassword = "Passwords do not match";
        } else {
            delete newErrors.rePassword;
        }

        setErrors(newErrors);
    };

    const validation = () => {
        const errors = {};

        if (!formsData.name) errors.name = "Name is required";
        if (!formsData.email) {
            errors.email = "Email is required"
        } else {
            const emailValidation = validateEmail(formsData.email);
            if (emailValidation.error) {
                errors.email = emailValidation.message;
            }
        }
        if (!formsData.mobile) {
            errors.mobile = "Mobile is required";
        } else {
            const mobileValidation = validateContactNumber(formsData.mobile);
            if (mobileValidation.error) {
                errors.mobile = mobileValidation.message;
            }
        }
        if (!formsData.role) errors.role = "Role is required";
        if (!formsData.department) errors.department = "Department is required";
        if (!formsData.status) errors.status = "Status is required";

        if (Object.keys(errors).length > 0) {
            showMessage("error", errors[Object.keys(errors)[0]]);
            return true;
        }

        return false;
    };

    const validatePassword = () => {
        const errors = {};
        if (!passwordData.currentPassword) errors.currentPassword = "Current Password is required";
        if (!passwordData.password) errors.password = "Password is required";
        if (!passwordData.rePassword) errors.rePassword = "Re-Password is required";
        if (passwordData.password && passwordData.rePassword && passwordData.password !== passwordData.rePassword) errors.status = "Passwords do not match";
        if (Object.keys(errors).length > 0) {
            showMessage("error", errors[Object.keys(errors)[0]]);
            return true;
        }
        return false;
    }
    const updatePassword = () => {
        if (validatePassword()) return;
        const reqBody = {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.password
        }
        sendPostRequest(UPDATE_PASSWORD_BY_ID(props.id), reqBody).then((res) => {
            if (res.status === 200) {
                setPasswordData({ currentPassword: '', password: '', rePassword: '' });
                showMessage('success', `Password update successfully`);
                props.onClose();
            } else if (res.status === 401) {
                showMessage('error', res.message);
            } else if (res.status === 400) {
                showMessage('error', res.data[0]);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in update password");
            }
        })
    }

    const submitAction = () => {
        if (validation()) return;
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
        sendGetRequest(GET_USER_BY_ID(props.id), user.token)
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
                    Update
                </Button>
            }
        >
            <Loader loading={loading} />
            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <SingleUploader readOnly={false}
                        image={formsData.profile}
                        onChange={handleImageChange} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Personal Details
                    </Typography>
                    <Typography color='textSecondary' variant="caption" gutterBottom>
                        Manage your personal information
                    </Typography>
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
                <Grid item container xs={12} style={{ marginTop: '50px' }}>
                    <Grid xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Password
                        </Typography>
                        <Typography color='textSecondary' variant="caption" gutterBottom>
                            Change your password
                        </Typography>
                    </Grid>
                    <div style={{ padding: '10px 0px', }}>
                        <Grid item container xs={12} spacing={2} >
                            <Grid item xs={12}>
                                <TextField
                                    label="Current Password"
                                    variant="outlined"
                                    size='small'
                                    name='currentPassword'
                                    value={passwordData.currentPassword}
                                    placeholder="Enter Current Password..."
                                    onChange={handlePasswordChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    size='small'
                                    name='password'
                                    value={passwordData.password}
                                    placeholder="Enter Password..."
                                    onChange={handlePasswordChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Re-Password"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="rePassword"
                                    value={passwordData.rePassword}
                                    placeholder="Enter Re-Password..."
                                    onChange={handlePasswordChange}
                                    error={!!errors.rePassword} // Show error state
                                    helperText={errors.rePassword || ""} // Show error message
                                />
                            </Grid>
                            <Grid sm={8}>
                                <Button disabled={!passwordData.currentPassword} variant="outlined" color="primary" onClick={updatePassword}>
                                    Update password
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>

        </PopupAction >
    </>)
}

export default UserProfile
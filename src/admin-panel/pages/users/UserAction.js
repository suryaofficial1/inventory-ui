import { Button, Grid, MenuItem, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PopupAction from '../../../common/PopupAction'
import { ADD_USER, DEPARTMENT_LIST, ROLE_LIST, UPDATE_USER } from '../../../config/api-urls'
import { useLoader } from '../../../hooks/useLoader'
import { showMessage } from '../../../utils/message'
import { sendGetRequest, sendPostRequest, sendPostRequestWithImage } from '../../../utils/network'
import SingleUploader from '../../../common/uploader/SingleUploader'

const UserAction = ({ onClose, successAction, title, selectedData = {}, readOnly = false }) => {
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formsData, setFormsData] = useState(() => ({
        name: selectedData.name || '',
        email: selectedData.email || '',
        mobile: selectedData.mobile || '',
        role: selectedData.role ? selectedData.role[0].id : '' || '',
        department: selectedData?.department ? selectedData?.department[0].id : '' || '',
        profile: selectedData.profile || '',
        status: selectedData.status || '1',
    }));
    const [passwordData, setPasswordData] = useState({
        password: '',
        rePassword: ''
    });
    const [errors, setErrors] = useState({});

    const [{ start, stop }, Loader] = useLoader();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update form data
        setFormsData((prev) => ({ ...prev, [name]: value }));
    };

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

    const handleImageChange = (updatedImage) => {
        setFormsData(prevData => ({ ...prevData, profile: updatedImage }));
    }

    useEffect(() => {
        getRole();
        getDepartment();
    }, []);

    const getRole = () => {
        start();
        sendGetRequest(ROLE_LIST, 'token').then(res => {
            if (res.status === 200) {
                setRoles(res.data);
            } else {
                console.log(res);
            }
        }).catch(err => {
            console.log(err);
        }).finally(stop);
    }
    const getDepartment = () => {
        start();
        sendGetRequest(DEPARTMENT_LIST, 'token').then(res => {
            if (res.status === 200) {
                setDepartments(res.data);
            } else {
                console.log(res);
            }
        }).catch(err => {
            console.log(err);
        }).finally(stop);
    }
    const validation = () => {
        const errors = {};
        if (!formsData.name) errors.name = "Name is required";
        if (!formsData.email) errors.email = "Email is required";
        if (!formsData.mobile) errors.mobile = "Mobile is required";
        if (!formsData.role) errors.role = "Role is required";
        if (!formsData.department) errors.department = "Department is required";
        if (!formsData.status) errors.status = "Status is required";
        if (passwordData.password && !passwordData.rePassword) errors.status = "Re-Password is required";
        if (passwordData.password && passwordData.rePassword && passwordData.password !== passwordData.rePassword) errors.status = "Passwords do not match";
        if (!selectedData.id) {
            if (!passwordData.password) errors.password = "Password is required";
            if (!passwordData.rePassword) errors.rePassword = "Re-Password is required";

        }
        if (Object.keys(errors).length > 0) {
            showMessage("error", errors[Object.keys(errors)[0]]);
            return true;
        }
        return false;
    }

    const submitAction = () => {
        if (validation()) return;
        const formData = new FormData();
        Object.entries(formsData).forEach(([key, value]) => formData.append(key, value));
        if (passwordData.password) {
            formData.append('password', passwordData.password);
        }
        const url = selectedData.id ? UPDATE_USER(selectedData.id) : ADD_USER;
        const action = selectedData.id ? 'updated' : 'added';
        start()
        sendPostRequestWithImage(url, formData, true).then((res) => {
            if (res.status === 200) {
                successAction()
                showMessage('success', `User successfully ${action}`);
                onClose();
            } else if (res.status === 400) {
                showMessage('error', res.data);
            } else if (res.status === 409) {
                showMessage('error', res.message);
            } else {
                showMessage('error', "Something went wrong in " + action + " user!");
            }
        }).catch((err) => {
            console.log(err);
            showMessage('error', "Something went wrong in " + action + " user!");
        }).finally(() => stop())
    }

    return (
        <>
            <Loader />
            <PopupAction onClose={onClose} title={title} width={700}
                actions={
                    !readOnly && (
                        <Button variant="contained" color="primary" onClick={submitAction}>
                            Save
                        </Button>
                    )
                }
            >
                <Grid container spacing={3} style={{ padding: 20 }}>
                    <Grid item xs={12}>
                        <SingleUploader readOnly={readOnly}
                            image={formsData.profile}
                            onChange={handleImageChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            size='small'
                            name='name'
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            value={formsData.name}
                            placeholder="Enter Name..."
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name='email'
                            size='small'
                            value={formsData.email}
                            placeholder="Enter Email..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Mobile"
                            variant="outlined"
                            fullWidth
                            name='mobile'
                            size='small'
                            value={formsData.mobile}
                            placeholder="Enter Mobile..."
                            InputProps={{
                                readOnly: readOnly,
                            }}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth id="role"
                            onChange={handleInputChange}
                            name='role'
                            label="Role"
                            variant='outlined'
                            size='small'
                            value={formsData.role} select>
                            {roles.map((i) => (
                                <MenuItem value={i.id}>{i.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth id="department"
                            onChange={handleInputChange}
                            name='department'
                            label="Department"
                            variant='outlined'
                            size='small'
                            value={formsData.department} select>
                            {departments.map((item) => (
                                <MenuItem value={item.id}>{item.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {!readOnly && <Grid item container xs={12} spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Update password
                            </Typography>
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
                    </Grid>}
                </Grid>
            </PopupAction >
        </>
    )
}

export default UserAction;
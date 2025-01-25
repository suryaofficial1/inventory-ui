import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Add, Refresh, Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ActionButton from '../../../common/action-button/ActionButton';
import { DELETE_USER, domain, USER_LIST } from '../../../config/api-urls';
import { useLoader } from '../../../hooks/useLoader';
import { roleBasePolicy } from '../../../utils/Constent';
import { showMessage } from '../../../utils/message';
import { sendDeleteRequest, sendGetRequest } from '../../../utils/network';
import UserAction from './UserAction';

const useStyles = makeStyles({
  actionIcons: {
    display: 'flex',
    gap: 15,
    cursor: 'pointer',
  },
  addBtn: {
    padding: 10
  },
  actionButton: {
    padding: "5px 15px",
    marginRight: 10,
    borderRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }
});

const UserList = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({ name: '' });
  const [tempFilter, setTempFilter] = useState({ name: '' });
  const [totalRecords, setTotalRecords] = useState(0);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const [{ start, stop }, Loader, loading] = useLoader();
  const user = useSelector((state) => state.user);


  useEffect(() => {
    getUsers();
  }, [page, filter]);
  const getUsers = () => {
    start()
    sendGetRequest(`${USER_LIST}?name=${filter.name}&page=${page + 1}&per_page=10`, "token")
      .then(res => {
        if (res.status === 200) {
          setRows(res.data.rows)
          setTotalRecords(res.data.total)
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      }).finally(stop)
  }

  const onClose = () => {
    setOpen(!open);
    setReadOnly(false);
    setEditData({});
  };


  const handleAction = (row, mode) => {
    setOpen(true);
    setEditData(row);
    setReadOnly(mode === 'view');
  };

  const deleteAction = (row) => {
    start()
    sendDeleteRequest(`${DELETE_USER(row.id)}`, "token")
      .then(res => {
        if (res.status === 200) {
          getUsers();
          showMessage('success', 'User deleted successfully');
        } else {
          console.log(res)
        }
      }).catch(err => {
        console.log(err)
      }).finally(stop)
  }

  const columns = [
    {
      field: 'id',
      headerName: '#Id',
      width: 80,
      sortable: true,
    },

    { field: 'name', headerName: 'Name', width: 110, resizable: true, sortable: false },
    {
      field: 'profile', headerName: 'Profile', width: 110, resizable: true, sortable: false,
      renderCell: (params) =>
        params.row.profile ? (
          <div style={{ width: 50, height: 48, borderRadius: '50%', overflow: 'hidden' }}>
            <img
              src={domain + params.row.profile}
              alt="Product"
              height="100%"
              width="100%"
              style={{ objectFit: 'fill' }}
            />
          </div>
        ) : null
    },
    {
      field: 'role', headerName: 'Role', width: 120, resizable: false, sortable: false,
      renderCell: (params) => (
        params.row.role[0].name
      )
    },
    {
      field: 'department', headerName: 'Department', width: 120, resizable: false, sortable: false,
      renderCell: (params) => (
        params.row.department[0].name
      )
    },
    { field: 'email', headerName: 'Email', width: 140, resizable: true, sortable: false },
    { field: 'mobile', headerName: 'Mobile', width: 130, resizable: true, sortable: false },
    {
      field: 'status', headerName: 'Status', width: 100, resizable: true, sortable: false,
      renderCell: (params) => (
        (params.row.status === 1) ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>
      )
    },
    {
      field: "Action", headerName: "Action", width: 200, resizable: true, sortable: false,
      renderCell: (params) => (
        <ActionButton
          params={params}
          handleAction={handleAction}
          deleteAction={deleteAction}
        />
      )
    }
  ];

  const applyFilter = () => {
    setFilter(tempFilter);
    setPage(0)
  }

  const resetAllData = () => {
    setFilter({ name: '' });
    setTempFilter({ name: '', });
    setPage(0)
  }

  return (
    <div >
      <Loader />
      {/* <div className={classes.addBtn}>
                <Filter reset={resetAllData} filter={tempFilter} setFilter={setTempFilter} />
            </div> */}
      <div>
        {roleBasePolicy(user?.role) && <Button startIcon={<Add />} className={classes.actionButton} variant="contained" color="primary" onClick={() => setOpen(!open)}>Add User</Button>}
        <Button startIcon={<Search />} className={classes.actionButton} variant="contained" color="primary" onClick={applyFilter}>Search</Button>
        <Button startIcon={<Refresh />} className={classes.actionButton} variant="contained" color="secondary" onClick={resetAllData}>Reset</Button>
      </div>
      <DataGrid autoHeight pagination style={{ background: "#fff", width: "100%" }}
        rows={rows}
        columns={columns}
        page={page}
        pageSize={10}
        rowsPerPageOptions={[10]}
        rowCount={(totalRecords) ? totalRecords : 100}
        loading={loading}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        disableColumnMenu
        disableColumnFilter
      />

      {open && <UserAction
        selectedData={editData}
        readOnly={readOnly}
        onClose={onClose}
        successAction={getUsers}
        title={readOnly ? 'View User' : editData.id ? 'Edit User' : 'Add User'}
      />}
    </div>
  );
};

export default UserList;

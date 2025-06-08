import {
    AppBar,
    Avatar,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText, makeStyles, Toolbar,
    Typography
} from '@material-ui/core';
import { ExpandLess, ExpandMore, PersonAdd } from '@material-ui/icons';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Logouts from '@material-ui/icons/ExitToAppRounded';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import MenuIcon from '@material-ui/icons/Menu';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import SubjectIcon from '@material-ui/icons/Subject';
import WcOutlinedIcon from '@material-ui/icons/WcOutlined';
import Add from '@mui/icons-material/AddCircleOutlineRounded';
import { Box, Button, Card, CardActionArea, CardContent, Popover } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { logoutUser } from '../../actions';
import UserProfile from '../../components/auth/UserProfile';
import { domain } from '../../config/api-urls';
import { persistor } from '../../store/store';
import MenuRoutes from './MenuRoutes';
import './Style.css';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        marginTop: 64, // Height of AppBar
    },
}));

const LayoutIndex = () => {
    const classes = useStyles();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [expand, setExpand] = useState({});
    const [editUser, setEditUser] = useState(false);
    const hash = window.location.hash
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();


    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDialogClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleResize = () => {
            if (mediaQuery.matches) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const handleClose = () => {
        console.log("close click")
    }

    const logout = () => {
        dispatch(logoutUser());
        persistor.purge(); // Clear the persisted state
        window.location.href = '/login';
    }

    const filteredMenuRoutes = MenuRoutes.filter((route) => {
        // If no roles are specified, the route is accessible by everyone
        if (!route.roles) return true;
        // If the user’s role is in the route’s roles, show the route
        return route.roles.includes(user.role);
    });
    const listComponent = () => (
        <div className={`adSidebars ${!sidebarOpen ? 'collapsed' : ''}`}>
            <List>
                {filteredMenuRoutes.map((prop, index) => {
                    return prop.hasOwnProperty("submenu") ?
                        <>
                            <ListItem button key={index} onClick={() => setExpand({ ...expand, [index]: !expand[index] })}>
                                <ListItemIcon><prop.icon /></ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1" color="inherit" className='menu-item'>{prop.sidebarName}</Typography>}></ListItemText>
                                <ListItemAvatar className="text-center">
                                    {prop.submenu && (
                                        expand[index] ? (
                                            <ExpandLess />
                                        ) : (
                                            <ExpandMore />
                                        )
                                    )}
                                </ListItemAvatar>
                            </ListItem>
                            <Collapse in={expand[index]} timeout="auto" unmountOnExit className={classes.subMenu}>
                                <List disablePadding>
                                    {prop.submenu
                                        .filter(f => !f.hidden)
                                        .map((sub, index) => {
                                            return <Link to={sub.path} style={{ textDecoration: 'none' }} key={index} onClick={handleClose}>
                                                <ListItem button key={index}>
                                                    <ListItemIcon><sub.icon /></ListItemIcon>
                                                    <ListItemText primary={<Typography variant="subtitle1" color="inherit" className='sub-menu-item'>{sub.sidebarName}</Typography>}></ListItemText>
                                                </ListItem>
                                            </Link>
                                        })}
                                </List>
                            </Collapse>

                        </>
                        :
                        (prop.show === "none" ? "" : <Link to={prop.path} style={{ textDecoration: 'none' }} key={index} onClick={handleClose}>
                            <ListItem button key={index}>
                                <ListItemIcon><prop.icon /></ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1" color="inherit" className='menu-item'>{prop.sidebarName}</Typography>}></ListItemText>
                            </ListItem>
                        </Link>)
                })}
                <ListItem button onClick={logout} key={'index' + 1}  >
                    <ListItemIcon ><Logouts fontSize='small' /></ListItemIcon>
                    <ListItemText primary={<Typography className='logout' variant="subtitle1"  >Logout</Typography>}></ListItemText>
                </ListItem>
            </List>
        </div>
    );

    const addPageDetails = [
        {
            id: 2,
            path: '#products',
            name: 'Add New Products',
            icon: AddShoppingCartIcon,
        },
        {
            id: 3,
            path: '#suppliers',
            name: 'Add New Suppliers',
            icon: PeopleSharpIcon,
        },
        {
            id: 4,
            path: '#customers',
            name: 'Add New Customers',
            icon: WcOutlinedIcon
        },
        {
            id: 5,
            path: '#purchase-list',
            name: 'Add new Purchase',
            icon: SubjectIcon,
        },
        {
            id: 6,
            path: '#purchase-return',
            name: 'Add New Purchase Return',
            icon: KeyboardReturnIcon,
        },
        {
            id: 7,
            path: '#production',
            name: 'Add New Production',
            icon: NewReleasesIcon,
        },
        {
            id: 8,
            path: '#sales-list',
            name: 'Add New Sales',
            icon: SubjectIcon,
        },
        {
            id: 9,
            path: '#sales-return',
            name: 'Add New Sales Return',
            icon: KeyboardReturnIcon,
        },
    ]

    const newHeader = () => {
        return (
            <AppBar position="fixed" className='app-bar'>
                <Toolbar className='flex'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div className='flex center-item'>
                            <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap>
                                {hash.replace('#', '').charAt(0).toUpperCase() + hash.slice(2)}
                            </Typography>
                        </div>
                        <div className='flex center-item'>
                            <Button style={{ background: '#f1e9e9', color: 'black' }}
                                variant='contained' startIcon={<Add size="small" />} onClick={handleClick}>Add New</Button>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleDialogClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                        gap: 2,
                                        maxWidth: 630,
                                    }}
                                >
                                    {addPageDetails.map((item, index) => (
                                        <Card
                                            key={index}
                                            sx={{
                                                p: 1,
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                boxShadow: 1,
                                                borderRadius: 2,
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                    boxShadow: 3,
                                                },
                                            }}
                                            onClick={() => {
                                                handleDialogClose();
                                                window.location.hash = item.path;
                                            }}
                                        >
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                                                <item.icon style={{ fontSize: 30, color: '#1976d2', marginBottom: 4 }} />
                                                <Typography variant="body2">
                                                    <b> {item.name}</b>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Popover>
                        </div>
                        <div className='flex center-item' onClick={() => setEditUser(true)} style={{ cursor: 'pointer' }}>
                            <Avatar alt={user.name} src={domain + user.profile} style={{ width: 30, height: 30, margin: 5 }} />
                            <p className='user-name' >
                                {user.name}
                            </p>
                            <p className='user-edit-icon' >
                                ▼
                            </p>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }

    const found = (MenuRoutes.flatMap(r => r.submenu ? r.submenu : r)
        .filter(f => !f.disabled && hash.startsWith(f.path)))
    found.push(MenuRoutes[0])
    const SelectedComponent = found[0].component

    return (<>
        <div className={classes.root}>
            {newHeader()}
            {listComponent()}

            <main className={`mainContent ${!sidebarOpen ? 'fullWidth' : ''}`} style={{ overflow: 'hidden' }}>
                {SelectedComponent}
            </main>
        </div>
        {editUser && <UserProfile
            id={user.id}
            onClose={() => setEditUser(false)}
        />}
    </>
    );
};

export default LayoutIndex;

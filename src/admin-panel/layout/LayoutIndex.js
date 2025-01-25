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
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import './Style.css';
import MenuRoutes from './MenuRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { domain } from '../../config/api-urls';
import UserProfile from '../../components/auth/UserProfile';
import Logouts from '@material-ui/icons/ExitToAppRounded';
import { persistor } from '../../store/store';
import { logoutUser } from '../../actions';

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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expand, setExpand] = useState({});
    const [editUser, setEditUser] = useState(false);
    const hash = window.location.hash
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

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
                                <ListItemText primary={<Typography variant="subtitle1" color="inherit" style={{ fontFamily: 'Montserrat', fontWeight: "900", }}>{prop.sidebarName}</Typography>}></ListItemText>
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
                                                    <ListItemText primary={<Typography variant="subtitle1" color="inherit" style={{ fontFamily: 'Montserrat', fontWeight: "900" }}>{sub.sidebarName}</Typography>}></ListItemText>
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

    const newHeader = () => {
        return (
            <AppBar position="fixed">
                <Toolbar className='flex' style={{ backgroundColor: '#a76060' }}>
                    <div className='flex center-item' style={{ flex: 1, marginLeft: 20 }}>
                        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {hash.replace('#', '').charAt(0).toUpperCase() + hash.slice(2)}
                        </Typography>
                    </div>
                    <div className='user-profile'>
                        <Avatar alt={user.name} src={domain + user.profile} style={{ width: 30, height: 30, margin: 5 }} />
                        <p className='user-name' >
                            {user.name}
                        </p>
                        <p className='user-edit-icon' onClick={() => setEditUser(true)} >
                            ▼
                        </p>
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

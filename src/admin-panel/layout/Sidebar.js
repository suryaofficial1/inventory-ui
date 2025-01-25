import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, Home, AccountBox } from '@material-ui/icons';
import './Style.css'

const Sidebar = ({ open, onClose }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleSubmenuToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };

  // <Drawer open={open} onClose={onClose} variant="permanent">
  // style={{ width: 200, flexShrink: 0, backgroundColor: '#fff',
  //   height: '100%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', minHeight: '100%'}}
  const listComponent = () => (
    <div className='adSidebars'
    >

      <List >
        <ListItem button>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={handleSubmenuToggle}>
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          <ListItemText primary="My Account" />
          {submenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button style={{ paddingLeft: 32 }}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button style={{ paddingLeft: 32 }}>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  )
  return (
    <div >
      {!open && listComponent()}
    </div>
  );
};

export default Sidebar;

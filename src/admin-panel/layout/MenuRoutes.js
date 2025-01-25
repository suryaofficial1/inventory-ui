import { FlashOn } from "@material-ui/icons";
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import React from "react";
import Dashboard from '../pages/dashboard/Dashboard';
import ProductList from '../pages/product/ProductList';
import SupplierList from "../pages/supplier/SupplierList";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CustomerList from "../pages/customer/CustomerList";
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
import WcOutlinedIcon from '@material-ui/icons/WcOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import SalesList from "../pages/sales/SalesList";
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import PurchaseList from "../pages/purchase/PurchaseList";
import UserList from "../pages/users/UserList";
import ReportsHome from "../pages/reports/ReportsList";



const MenuRoutes = [
    {
        path: '#dashboard',
        sidebarName: 'Dashboard',
        navbarName: 'Dashboard',
        icon: DashboardOutlinedIcon,
        component: <Dashboard />,
        roles: ['Admin', 'Store manager', 'User'] // Accessible to all roles
    },
    {
        path: '#Users',
        sidebarName: 'Users',
        navbarName: 'Users',
        icon: PersonAdd,
        component: <UserList />,
        roles: ['Admin'] // Only Admin can access
    },
    {
        path: '#suppliers',
        sidebarName: 'Suppliers',
        navbarName: 'Suppliers',
        icon: PeopleSharpIcon,
        component: <SupplierList />,
        roles: ['Admin', 'Store manager'] // Admin and Store manager can access
    },
    {
        path: '#products',
        sidebarName: 'Products',
        navbarName: 'Products',
        icon: AddShoppingCartIcon,
        component: <ProductList />,
        roles: ['Admin', 'Store manager'] // Admin and Store manager can access
    },
    {
        path: '#customers',
        sidebarName: 'Customers',
        navbarName: 'Customers',
        icon: WcOutlinedIcon,
        component: <CustomerList />,
        roles: ['Admin', 'Store manager'] // Admin and Store manager can access
    },
    {
        path: '#sales',
        sidebarName: 'Sales',
        navbarName: 'Sales',
        icon: TrendingUpOutlinedIcon,
        component: <SalesList />,
        roles: ['Admin', 'Store manager', 'User'] // Accessible to all roles
    },
    {
        path: '#purchase',
        sidebarName: 'Purchase',
        navbarName: 'Purchase',
        icon: TrendingUpOutlinedIcon,
        component: <PurchaseList />,
        roles: ['Admin', 'Store manager', 'User'] // Accessible to all roles
    },
    {
        path: '#reports',
        sidebarName: 'Reports',
        navbarName: 'Reports',
        icon: TrendingUpOutlinedIcon,
        component: <ReportsHome />,
        roles: ['Admin', 'Store manager', 'User'] // Accessible to all roles
    },

    // {
    //     sidebarName: 'Profile',
    //     navbarName: 'Profile',
    //     icon: FlashOn,
    //     submenu: [
    //         {
    //             path: '#Users',
    //             sidebarName: 'Users List',
    //             navbarName: 'Users List',
    //             icon: FlashOn,
    //             component: <About />,
    //         },
    //         {
    //             path: '#order',
    //             sidebarName: 'Order',
    //             navbarName: 'Order',
    //             icon: FlashOn,
    //             component: <ProductList />,
    //         },
    //     ]
    // },
];

export default MenuRoutes;
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import WcOutlinedIcon from '@material-ui/icons/WcOutlined';
import React from "react";
import CustomerList from "../pages/customer/CustomerList";
import Dashboard from '../pages/dashboard/Dashboard';
import ProductList from '../pages/product/ProductList';
import PurchaseList from "../pages/purchase/PurchaseList";
import ProductionList from "../pages/recycle/production/ProductionList";
import RowMaterialsList from "../pages/recycle/row-materiyal/RowMaterialsList";
import ReportsHome from "../pages/reports/ReportsList";
import SalesList from "../pages/sales/SalesList";
import SupplierList from "../pages/supplier/SupplierList";
import UserList from "../pages/users/UserList";



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
        sidebarName: 'Manufacturing',
        navbarName: 'Manufacturing',
        icon: AutorenewIcon,
        submenu: [
            {
                path: '#row-material',
                sidebarName: 'Row material',
                navbarName: 'Row material',
                icon: NewReleasesIcon,
                component: <RowMaterialsList />,
            },
            {
                path: '#production',
                sidebarName: 'Production',
                navbarName: 'Production',
                icon: OutdoorGrillIcon,
                component: <ProductionList />,
            },
        ]
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
];

export default MenuRoutes;
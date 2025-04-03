import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import PersonAdd from '@material-ui/icons/PersonAddOutlined';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SubjectIcon from '@material-ui/icons/Subject';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import WcOutlinedIcon from '@material-ui/icons/WcOutlined';
import React from "react";
import CustomerList from "../pages/customer/CustomerList";
import Dashboard from '../pages/dashboard/Dashboard';
import ManufacturingList from '../pages/Manufacturing/List';
import ProductList from '../pages/product/ProductList';
import ReturnList from '../pages/purchase-return/ReturnList';
import PurchaseList from "../pages/purchase/PurchaseList";
import ReportsHome from "../pages/reports/ReportsList";
import SalesReturnList from '../pages/sales-return/SalesReturnList';
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
        path: '#products',
        sidebarName: 'Products',
        navbarName: 'Products',
        icon: AddShoppingCartIcon,
        component: <ProductList />,
        roles: ['Admin', 'Store manager'] // Admin and Store manager can access
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
        path: '#customers',
        sidebarName: 'Customers',
        navbarName: 'Customers',
        icon: WcOutlinedIcon,
        component: <CustomerList />,
        roles: ['Admin', 'Store manager'] // Admin and Store manager can access
    },
    // {
    //     sidebarName: 'Manufacturing',
    //     navbarName: 'Manufacturing',
    //     icon: AutorenewIcon,
    //     submenu: [
    //         {
    //             path: '#raw-material',
    //             sidebarName: 'Raw material',
    //             navbarName: 'Raw material',
    //             icon: NewReleasesIcon,
    //             component: <RowMaterialsList />,
    //         },
    //         {
    //             path: '#productions',
    //             sidebarName: 'Production',
    //             navbarName: 'Production',
    //             icon: OutdoorGrillIcon,
    //             component: <ProductionList />,
    //         },
    //     ]
    // },

    {
        sidebarName: 'Purchase',
        navbarName: 'Purchase',
        icon: ShoppingCartIcon,
        submenu: [
            {
                path: '#purchase-list',
                sidebarName: 'List',
                navbarName: 'List',
                icon: SubjectIcon,
                component: <PurchaseList />,
            },
            {
                path: '#purchase-return',
                sidebarName: 'Return',
                navbarName: 'Return',
                icon: KeyboardReturnIcon,
                component: <ReturnList />,
            },
        ]
    },
    {
        sidebarName: 'Sales',
        navbarName: 'Sales',
        icon: TrendingUpIcon,
        submenu: [
            {
                path: '#sales-list',
                sidebarName: 'List',
                navbarName: 'List',
                icon: SubjectIcon,
                component: <SalesList />,
            },
            {
                path: '#sales-return',
                sidebarName: 'Return',
                navbarName: 'Return',
                icon: KeyboardReturnIcon,
                component: <SalesReturnList />,
            },
        ]
    },
    {
        path: '#production',
        sidebarName: 'Production',
        navbarName: 'Production',
        icon: NewReleasesIcon,
        component: <ManufacturingList />,
        roles: ['Admin'] // Only Admin can access
    },
    {
        path: '#reports',
        sidebarName: 'Reports',
        navbarName: 'Reports',
        icon: ReceiptIcon,
        component: <ReportsHome />,
        roles: ['Admin', 'Store manager', 'User'] // Accessible to all roles
    },
];

export default MenuRoutes;
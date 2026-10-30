import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/admin/LoginPage';
import OrdersPage from './pages/admin/OrdersPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductPage from './pages/admin/ProductPage';
import UsersPage from './pages/admin/UsersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import AdminLayout from './layouts/AdminLayout';
import RequireAuth from './features/auth/RequireAuth';

export const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/catalog', element: <CatalogPage /> },
    { path: '/admin/login', element: <LoginPage /> },
    {
        path: '/admin',
        element: <RequireAuth />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="orders" replace /> },
                    { path: 'orders', element: <OrdersPage /> },
                    { path: 'products', element: <ProductsPage /> },
                    { path: 'products/:id', element: <ProductPage /> },
                    { path: 'categories', element: <CategoriesPage /> },
                    { path: 'users', element: <UsersPage /> },
                ],
            },
        ],
    },
]);

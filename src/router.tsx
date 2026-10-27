import { createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/admin/LoginPage';
import OrdersPage from './pages/admin/OrdersPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductPage from './pages/admin/ProductPage';
import ComingSoonPage from './pages/admin/ComingSoonPage';
import AdminLayout from './layouts/AdminLayout';
import RequireAuth from './features/auth/RequireAuth';

export const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
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
                    { path: 'categories', element: <ComingSoonPage title="Категории" /> },
                    { path: 'users', element: <ComingSoonPage title="Пользователи" /> },
                ],
            },
        ],
    },
]);

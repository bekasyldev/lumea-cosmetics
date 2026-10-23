import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/admin/LoginPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import RequireAuth from './features/auth/RequireAuth';

export const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/admin/login', element: <LoginPage /> },
    {
        path: '/admin',
        element: <RequireAuth />,
        children: [{ index: true, element: <AdminHomePage /> }],
    },
]);

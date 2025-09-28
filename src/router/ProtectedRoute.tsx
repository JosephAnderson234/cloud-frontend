import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth  from "@hooks/useAuthContext";

export function ProtectedRoute({to}:{ to: string }) {
	const authContext = useAuth();
	const location = useLocation();

	if (!authContext.session && authContext.isLoggingOut) {
		return <Navigate to={to} replace />;
	}

	if (!authContext.session && !authContext.isLoggingOut)
		return <Navigate to={`/auth/login?from=${location.pathname}`} replace />;

	return <Outlet />;
}
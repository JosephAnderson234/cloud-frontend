import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth  from "@hooks/useAuthContext";
import { useUserStore } from "@utils/userStorage";

export function ProtectedRoute({to}:{ to: string }) {
	const authContext = useAuth();
	const location = useLocation();
	const user = useUserStore(state => state.usuario);

	if (!user && authContext.isLoggingOut) {
		return <Navigate to={to} replace />;
	}

	if (!user && !authContext.isLoggingOut)
		return <Navigate to={`/auth/login?from=${location.pathname}`} replace />;

	return <Outlet />;
}
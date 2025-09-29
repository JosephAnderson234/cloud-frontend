import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import Usuarios from "@pages/Usuarios";
import Pedidos from "@pages/Pedidos";
import { Login, Register } from "@pages/auth";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "auth",
				children: [
					{
						path: "login", 
						element: <Login />
					}, 
					{
						path: "register", 
						element: <Register />
					}
				],
			},
			{
				path: "/",
				element: <ProtectedRoute to="/" />,
				children: [
				{
					index: true,
					element: <Usuarios />
				},
				{
					path:"users",
					element:<Usuarios />
				},
				{
					path:"orders",
					element:<Pedidos />
				}],

			},
			{
				path: "*",
				element: <div>Not Found</div>,
			},
		],
	},
]);
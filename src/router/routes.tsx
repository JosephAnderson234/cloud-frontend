import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import Productos from "@pages/Productos";
import Pedidos from "@pages/Pedidos";
import Home from "@pages/Home";
import Delivery from "@pages/Delivery";
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
				element: <ProtectedRoute to="/auth/login" />,
				children: [
				{
					index: true,
					element: <Home />
				},
				{
					path:"products",
					element:<Productos />
				},
				{
					path:"orders",
					element:<Pedidos />
				},
				{
					path:"delivery",
					element:<Delivery />
				}],


			},
			{
				path: "*",
				element: <div>Not Found</div>,
			},
		],
	},
]);
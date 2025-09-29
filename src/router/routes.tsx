import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import Usuarios from "@pages/Usuarios";

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
						element: <div > Login Page</div>
					}, 
					{
						path: "register", 
						element: <div > Register Page</div>
					}
				],
			},
			{
				path: "/",
				element: <ProtectedRoute to="/" />,
				children: [
				{
					path:"users",
					element:<Usuarios />
				}, 
				{}, {}],

			},
			{
				path: "*",
				element: <div>Not Found</div>,
			},
		],
	},
]);
import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import Profile from "@pages/Profile";
import Home from "@pages/Home";

export const router = createBrowserRouter(
    [{
        path: "/",
        element: <App />,
        children: [
            {
				path: "/",
                element:<Home/>,
				children: [],
			},
            {
				path: "auth",
				children: [
                    {
                        path: "login",
                        element: <div>Login Page</div>
                    },
                    {
                        path: "register",
                        element: <div>Register Page</div>
                    }
                ],
			},
            {
                path: "profile",
                element: <ProtectedRoute to="/"/>,
                children: [
                    {
                        path: "",
                        element: <Profile />
                    }
                ]
            },
            {
                path: "*",
                element: <div>Not Found</div>
            }
        ]
    }]
)
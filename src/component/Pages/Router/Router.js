import { createBrowserRouter } from "react-router-dom";
import Login from "../createUsers/Login";
import Registration from "../createUsers/Registration";
import Home from "../Home/Home/Home";
import Main from "../Layout/Main";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Main/>,
        children: [
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/signIn",
                element:<Login/>
            },
            {
                path:"/signUp",
                element:<Registration/>
            }
        ]
    }
])
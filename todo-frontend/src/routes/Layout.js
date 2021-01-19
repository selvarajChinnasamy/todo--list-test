import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../states/Login";
import Home from "../states/Home";

const AuthRoute = ({ children, ...rest }) => {
    const token = localStorage.getItem("authToken");
    return (
        <Route
            {...rest}
            render={({ location }) =>
                token ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

const Layout = () => {
    return (
        <div>
            <Switch>
                <Route path="/login" children={<Login />} />
                <AuthRoute path="/" children={<Home />} />
            </Switch>
        </div>
    );
}

export default Layout;

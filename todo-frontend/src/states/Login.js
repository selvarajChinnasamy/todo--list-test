import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { post } from '../services/http.service';
import { useHistory } from "react-router-dom";

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("authToken");
        if (isLoggedIn) {
            history.push("/home");
        }
    });

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            if (loading) { return; }
            const emailValidateRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!(email && emailValidateRex.test(String(email).toLowerCase()))) {
                alert("Invalid Email!");
                return;
            }
            if (!password) {
                alert("Enter password!");
                return;
            }
            setLoading(true);
            const responce = await post("user/login", {
                email,
                password
            });
            setLoading(false);
            if (responce && responce.success && responce.user) {
                localStorage.setItem("authToken", responce.user.token);
                history.push("/home");
            } else {
                alert((responce && responce.message) ? responce.message : "something went wrong!.");
            }
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: "center", flexDirection: 'column' }}>
            <h2>Welcome To Do App</h2>
            <div className="container" id="container">
                <div className="form-container sign-in-container">
                    <form onSubmit={submitHandler}>
                        {loading ? <div className="loading">
                            <ClipLoader color={"#FF4B2B"} loading={true} size={150} />
                        </div> : null}
                        <h1>Sign in</h1>
                        <input onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" />
                        <input onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
                        <div style={{ marginTop: 15 }}>
                            <button type="submit">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
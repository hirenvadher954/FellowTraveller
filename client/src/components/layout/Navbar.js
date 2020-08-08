import React from 'react';
import {Link} from "react-router-dom";

function Navbar(props) {
    return (
        <div>
            <nav className="navbar bg-dark">
                <h1>
                    <Link to="/">
                        Fellow Traveller
                    </Link>
                </h1>
                <ul>
                    <li>
                        <a href="!#">Profile</a>
                    </li>
                    <li>
                        <Link to="/register">Login</Link>
                    </li>
                    <li>
                        <Link to="/login">Register</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
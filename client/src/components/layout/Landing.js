import React from 'react';
import {Link} from "react-router-dom";

function Landing(props) {
    return (
        <div>
            <section className="landing">
                <div className="dark-overlay">
                    <div className="landing-inner"><h1 className="x-large">Traveller Connector</h1>
                        <p className="lead">
                            Meet New People and make friends,share post and get like from other traveller
                        </p>
                        <div className="buttons">
                            <Link to="/register" className="btn btn-primary">SignUp</Link>
                            <Link to="/login" className="btn btn-light">Login</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;
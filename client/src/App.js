import React from 'react';
import './App.css';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar/>
                <Route exact path='/' component={Landing}/>
                <section className="container">
                    <Route exact path='/register' component={Login}/>
                    <Route exact path='/login' component={Register}/>
                </section>
            </div>
        </Router>
    );
}

export default App;

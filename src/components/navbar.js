import React from 'react';
import {  Link } from "react-router-dom";

const user = JSON.parse(localStorage.getItem('user'));

export default class NavBar extends React.Component{

    handleLogout = (event) => {
        localStorage.clear();
        window.location.href = '/';
    }
    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/dashboard" className="navbar-brand">Task Management</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        {user.role === 'admin' ? <li className="nav-item">
                            <Link to="/member" className="nav-link">Engineer</Link>
                        </li>  : ''}

                        <li className="nav-item">
                            <Link to="/task" className="nav-link"> {user.role === 'engineer' ? 'My ' : ''}Task</Link>
                        </li>

                        </ul>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {user.name}
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <button className="dropdown-item" onClick={this.handleLogout}>Logout</button>

                                </div>
                            </li>
                        </ul>

                    </div>
                </nav>
            </>
        );
    }
}

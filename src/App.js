
import React from "react";
import Home from "./components/home";
import Dashboard from "./components/dashboard";
import Member from './components/member';
import Task from './components/task';
import TaskShow from './components/taskShow';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route
    // Link,
    // useRouteMatch,
    // useParams
  } from "react-router-dom";



export default class App extends React.Component {

  render() {
    return (
        <Router>
            <Switch>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/member">
                    <Member />
                </Route>
                <Route path="/task">
                    <Task />
                </Route>
                <Route path="/task_show/:taskId" component={TaskShow}/>

                <Route path="/" >
                    <Home />
                </Route>
            </Switch>

        </Router>



        );
    }
}

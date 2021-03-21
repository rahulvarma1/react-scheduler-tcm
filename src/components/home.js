
import React from "react";
import Login from "./login";

export default class Home extends React.Component {
 render() {
    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-8 m-auto">
                    <Login />
                </div>
            </div>
        </div>
    );
    }
}

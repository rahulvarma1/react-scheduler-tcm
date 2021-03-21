import React from "react";
const axios = require('axios');

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error:false,
            messsge:'',
        };
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit = (event) => {
        event.preventDefault();
        var email    = event.target.email.value;
        var password = event.target.password.value;

        axios.get('http://localhost:3001/users/?email='+email+'&password='+password).then(resp => {

            if(resp.data.length !==0) {

                localStorage.setItem("user", JSON.stringify(resp.data[0]));
                var accessToken = "asdasdsadsadas";
                localStorage.setItem("accessToken", JSON.stringify(accessToken));
                window.location.href = '/dashboard';
            }else{
                this.setState({error:true,message:"This credentials doesn't match our record."});

            }
        }).catch(error => {

            console.log(error);
        });

    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-md-12 text-center mb-4">
                        <h5 className="font-weight-bold">Task Management</h5>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <form name="loginForm" autoComplete="off" className="loginForm" onSubmit={this.handleSubmit}>
                            <h3>Sign In</h3>
                            {this.state.error === true ?
                                <div className="alert alert-danger">
                                    <span>{this.state.message}</span>
                                </div>
                            : ''}

                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" className="form-control" placeholder="Enter email" name="email" required="required" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" name="password" placeholder="Enter password" required="required" />
                            </div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">Login</button>
                            <p className="forgot-password text-right mt-2">
                                {/* <a href="#">Forgot password?</a> */}
                            </p>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

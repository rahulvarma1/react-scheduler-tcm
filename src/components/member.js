import React from 'react';
import NavBar from './navbar';
import { Modal, Button } from "react-bootstrap";

const axios = require('axios');
export default class Member extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            members :[],
            name : '',
            email : '',
            mobile: '',
            password: '',
            id:'',
            errors:{}
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount = async () => {
        //  this.setState({members : })
         await this.getMembers();
    }

    getMembers = async () => {
        var users = await axios.get('http://localhost:3001/users?role=engineer').then(result => {
            return result.data;

        }).catch(err => console.log(err));
        await this.setState({members : users})
        // return users;
    }

    showModal = () => {
        this.setState(
            {
                name : '',
                email:'',
                mobile:'',
                password:'',
                id :'',
                show :true
            }
        );
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        var errors ={};



        // if(Number.isInteger(this.state.mobile) === true){
                var json = '';

                if(this.state.id === ''){
                json  = await  axios.post('http://localhost:3001/users/',{
                        name: this.state.name,
                        email:this.state.email,
                        mobile:this.state.mobile,
                        password:this.state.password,
                        role:'engineer'
                    }).then(result => {
                    console.log(result)
                    alert('Engineer created successfully.');

                    }).catch(err => {
                        console.log(err);
                    });
                }else{
                    json  = await axios.put('http://localhost:3001/users/'+this.state.id,{
                        name: this.state.name,
                        email:this.state.email,
                        mobile:this.state.mobile,
                        password:this.state.password,
                        role:'engineer'
                    }).then(result => {
                        console.log(result)
                        alert('Engineer updated successfully.');
                    }).catch(err => {
                        console.log(err);
                    });
                }

                this.setState({show:false});
                await this.getMembers();

        // }else{
        //     errors["mobile"] = 'Mobile Number is an integer format';
        //     await  this.setState({errors:errors})
        // }
    };
    handleEdit(value){
        this.setState(
            {
                name : value.name,
                email:value.email,
                mobile:value.mobile,
                id :value.id,
                password:value.password,
                show :true
            }
        );
    }
    handleDelete = async (id) => {


       var json =  await axios.delete('http://localhost:3001/users/'+id).then(result => {
            console.log(result);
            alert('Engineer Deleted Successgully');
        }).catch(err => {
            console.log(err);
        });
        await this.getMembers();
    }


    render() {
        return (
            <>
            <NavBar />
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Engineer List</h5>
                                    </div>
                                    <div className="text-right col-md-6">
                                    <Button className="btn btn-sm btn-primary pull-right" onClick={this.showModal}>Add Engineer</Button>
                                    </div>
                                </div>

                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        this.state.members.length  > 0 ?
                                            this.state.members.map((value,i) => {
                                                return (
                                                <tr key={i}>
                                                    <td>{i+1}</td>
                                                    <td>{value.name}</td>
                                                    <td>{value.email}</td>
                                                    <td>{value.mobile}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-success" onClick={() => this.handleEdit(value)} ><i className="fa fa-edit"></i></button>
                                                        <button className="btn btn-sm btn-danger ml-2"  onClick={(e) => { if (window.confirm('Are you sure you wish to delete this task?')) this.handleDelete(value.id) } }   ><i className="fa fa-trash"></i></button>
                                                    </td>

                                                </tr>
                                                )
                                            })

                                            : <tr><td colSpan="5" className="text-center">Not Found</td></tr>

                                       }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Modal show={this.state.show} onHide={this.hideModal}>
                        <Modal.Header >
                        <Modal.Title>{this.state.id === '' ? 'Add' : 'Edit'} Engineer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <form name="memberForm" autoComplete="off" className="memberForm" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" placeholder="Enter Name" name="name" value={this.state.name} onChange={(event) => this.setState({name : event.target.value})} required="required" />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" className="form-control" placeholder="Enter email" name="email"  value={this.state.email} onChange={(event) => this.setState({email : event.target.value})} required="required"  />
                                </div>

                                <div className="form-group">
                                    <label>Mobile</label>
                                    <input type="text" className="form-control" placeholder="Enter Mobile Number" name="mobile" value={this.state.mobile} onChange={(event) => this.setState({mobile : event.target.value})} required="required"  />
                                    {Object.keys(this.state.errors).length > 0 ? <span className="text-danger font-weight-bold">{this.state.errors.mobile}</span> : ''}
                                </div>
                                {
                                    this.state.id === '' ?
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" className="form-control" name="password" placeholder="Enter password"  onChange={(event) => this.setState({password : event.target.value})}  value={this.state.password} required="required"  />
                                        </div>
                                    : ''
                                }

                                <input type="hidden" name='id' value={this.state.id} />
                                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Close
                        </Button>

                        </Modal.Footer>
                    </Modal>
                </div>
            </div>

            </>
        );
    }

}

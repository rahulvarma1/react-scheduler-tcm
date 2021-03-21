
import React from "react";
import NavBar from "./navbar";

const axios = require('axios');

const user = JSON.parse(localStorage.getItem('user'));
export default class TaskShow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            task : '',
            comments:'',
            message:''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () => {
        var taskId = this.props.match.params.taskId;
        var task =  await axios.get('http://localhost:3001/tasks/'+taskId).then(result => {
            return result.data;
        }).catch(err => console.log(err));
        this.setState({task : task});
        this.getComments();
    }
    getComments = async () => {
        var taskId = this.props.match.params.taskId;
        var comments = await axios.get('http://localhost:3001/comments?task_id='+taskId).then(rs => {
            return rs.data;
        }).catch(err => console.log(err));
        this.setState({comments:comments});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(this.state.message)
        var test = await axios.post('http://localhost:3001/comments',{
            task_id: this.state.task.id,
            message:this.state.message,
            user_name:user.name,
            user_id:user.id
        }).then(result => {
            // alert('Comment Inserted Successfully');
            console.log(result)
        }).catch(err => console.log(err))
        this.setState({message:''});
        this.getComments();
    }

 render() {
    return (
       <>
        <NavBar />
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-12 m-auto">
                    <div className="card">
                        <div className="card-header">Task Details</div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <h6 className="mb-3"> <span className="font-weight-bold">Title</span> : {this.state.task.title}</h6>
                                    <h6 className="mb-3"> <span className="font-weight-bold">Creator</span> : Admin</h6>
                                    <h6 className="mb-3"><span className="font-weight-bold">Start Date</span> : {this.state.task.start_date} <span className="font-weight-bold"><i className="fa fa-arrow-right"></i></span> <span className="font-weight-bold">Due Date</span> : {this.state.task.due_date} </h6>
                                    <h6 className="mb-3"><span className="font-weight-bold">Status</span> : {this.state.task.status === 'P' ? 'In Progress' : 'Completed'}</h6>
                                    <h6 className="font-weight-bold">DESCRIPTION: </h6>
                                    <span>{this.state.task.description}</span>
                                    <hr />
                                </div>
                            </div>
                            <div className="row mt-3" >
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="form-group">
                                                <h6>All Comments <span className="pull-right">{this.state.comments.length} Comments</span></h6>
                                                <form name="memberForm" autoComplete="off" className="memberForm" onSubmit={this.handleSubmit}>
                                                <div className="input-group mb-3 mt-3">

                                                    <input type="text" className="form-control" required="required" placeholder="Write a comment" onChange={event => this.setState({message:event.target.value})} value={this.state.message} />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-success">Comment</button>
                                                    </div>
                                                </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10 mt-3">
                                <hr />
                                {
                                    this.state.comments.length  > 0 ?
                                        this.state.comments.map((value,i) => {
                                           return (
                                                <div key={value.id} className={user.id === value.user_id ? 'p-3 text-right aliceblue' : 'p-2 mintcream'} >
                                                    <h6 className="font-weight-bold">{value.user_name}</h6>
                                                    <h6>{value.message}</h6>
                                                </div>

                                                )
                                            }) :''
                                }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
       </>
    );
    }
}

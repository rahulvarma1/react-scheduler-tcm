import React from 'react';
import NavBar from './navbar';
import {Modal,Button} from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import { Link } from 'react-router-dom';
import checkIcon from '../check.svg';
import Toast from './Toast';
const axios = require('axios');

const user = JSON.parse(localStorage.getItem('user'));
export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            tasks :[],
            members:[],
            toastList:[],
            id:'',
            title:'',
            description:'',
            start_date:new Date(),
            due_date:new Date(),
            assignee_id:'',
            errors:{}
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.getFullDate = this.getFullDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.getTasks = this.getTasks.bind(this);

    }
    componentDidMount = async () => {
        var users = await axios.get('http://localhost:3001/users?role=engineer').then(result => {
            return result.data;
        }).catch(err => console.log(err));

        this.setState({members : users})
    await this.getTasks();
    }

    getTasks = async () => {
       var tasks = [];
       if( user.role ==='admin'){
             tasks =  await axios.get('http://localhost:3001/tasks').then(result => {
                return result.data;
            }).catch(err => console.log(err));
       }else{
             tasks =  await axios.get('http://localhost:3001/tasks?assignee_id='+user.id).then(result => {
                return result.data;
            }).catch(err => console.log(err));
       }

        this.setState({tasks : tasks})
    }

        //modal
    showModal =  () => {
        this.setState(
            {
                title : '',
                description:'',
                start_date:new Date(),
                id :'',
                due_date:new Date(),
                assignee_id:'',
                show :true
            }
        );
    }

    hideModal = () => {
        this.setState({show:false});
    }

    //validation
    handleStartDate = (date) => {
        var dueDate= this.state.due_date;

        console.log(dueDate);



        return date;

    }

    //form submit
    handleSubmit = async (event) => {
        event.preventDefault();
        var errors= {};

        if(this.state.start_date >= this.state.due_date){
            errors["due_date"] = 'Due date is greater than or equal to start date.';
          await  this.setState({errors:errors})

        }else{
            await this.setState({errors: {}})
        }
        if(Object.keys(this.state.errors).length === 0){
            //  console.log('asdasdasd');
            var start_date =  this.getFullDate(this.state.start_date).datetime;
            var due_date =  this.getFullDate(this.state.due_date).datetime;

            var assignee_name  = await axios.get('http://localhost:3001/users/'+this.state.assignee_id).then(result => {
                return result.data.name;
            } ).catch(err => console.log(err));

            var json = '';
            if(this.state.id === ''){
                json  = await  axios.post('http://localhost:3001/tasks/',{
                    title: this.state.title,
                    description:this.state.description,
                    start_date:start_date,
                    due_date:due_date,
                    assignee_id:this.state.assignee_id,
                    assignee_name:assignee_name,
                    status:'O'
                }).then(result => {
                    console.log(result)
                    this.setState({
                        toastList:[{
                            id:'1',
                            title: 'Success',
                            description: "Task Created successfully",
                            backgroundColor: 'success',
                            icon: checkIcon
                        }]
                    });

                }).catch(err => {
                    console.log(err);
                });
            }else{
                json  = await axios.put('http://localhost:3001/tasks/'+this.state.id,{
                    title: this.state.title,
                    description:this.state.description,
                    start_date:start_date,
                    due_date:due_date,
                    assignee_id:this.state.assignee_id,
                    assignee_name:assignee_name,
                    status:'O'
                }).then(result => {
                    console.log(result)
                    this.setState({
                        toastList:[{
                            id:'1',
                            title: 'Success',
                            description: "Task updated successfully",
                            backgroundColor: 'success',
                            icon: checkIcon
                        }]
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            console.log(json)
            this.setState({show:false});
            await this.getTasks();
        }




    }
    handleEdit(value){
        console.log(value)
        this.setState(
            {
                title : value.title,
                description:value.description,
                start_date:new Date(value.start_date),
                id :value.id,
                due_date:new Date(value.due_date),
                assignee_id:value.assignee_id,
                show :true
            }
        );
    }

    getFullDate = (date) =>{
        var s_date = new Date(date);
        var s_month = (parseInt(s_date.getMonth()) + parseInt(1)) <= 9 ? ('0' + (parseInt(s_date.getMonth()) + parseInt(1)) ) : (parseInt(s_date.getMonth()) + parseInt(1)) ;
        var s_day =  s_date.getDate() <=9 ? '0'+ s_date.getDate() :  s_date.getDate();
        var s_hour = s_date.getHours() <=9 ? '0'+ s_date.getHours() :  s_date.getHours();
        var s_min = s_date.getMinutes() <=9 ? '0'+ s_date.getMinutes() :  s_date.getMinutes();
        var s_sec = s_date.getSeconds() <=9 ? '0'+ s_date.getSeconds() :  s_date.getSeconds();

        var final_date = s_date.getFullYear() +'-' + s_month +'-'+ s_day;
        return {
            datetime: s_date.getFullYear() +'-' + s_month +'-'+ s_day +'T'+s_hour+':'+s_min+':'+s_sec,
            date:final_date
        };

    }

    handleDelete = async (id) => {
        var json1 =  await axios.get('http://localhost:3001/comments/?task_id='+id).then(result => {
            if(result.data.length > 0){
                result.data.map(value => {
                    axios.delete('http://localhost:3001/comments/'+value.id).then(rs=>console.log(rs)).catch(er => console.log(er))

                });
            }
        }).catch(err => {
            console.log(err);
        });
        var json =  await axios.delete('http://localhost:3001/tasks/'+id).then(result => {
            console.log(result);
            this.setState({
                toastList:[{
                    id:'1',
                    title: 'Success',
                    description: "Task deleted successfully",
                    backgroundColor: 'success',
                    icon: checkIcon
                }]
            });

        }).catch(err => {
            console.log(err);
        });
        console.log(json)
        console.log(json1)
        await this.getTasks();
    }

    handleComplete = async (value,status) => {
      var   json  = await axios.put('http://localhost:3001/tasks/'+value.id,{
            title: value.title,
            description:value.description,
            start_date:value.start_date,
            due_date:value.due_date,
            assignee_id:value.assignee_id,
            assignee_name:value.assignee_name,
            status:status
        }).then(result => {
            console.log(result)
            this.setState({
                toastList:[{
                    id:'1',
                    title: 'Success',
                    description: "Task "+( status === 'A' ? 'completed' : 'In progress') +" successfully",
                    backgroundColor: 'success',
                    icon: checkIcon
                }]
            });
        }).catch(err => {
            console.log(err);
        });
        console.log(json)
        await this.getTasks();
    }

    render() {
        return (
            <>
            <NavBar />
            {this.state.toastList.length > 0 ?
                <Toast
                toastList={this.state.toastList}
                position="bottom-right"
            /> : "" }
            <div className="container" >
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Task List</h5>
                                    </div>
                                    {user.role === 'admin' ?
                                    <div className="text-right col-md-6">
                                        <Button className="btn btn-sm btn-primary pull-right" onClick={this.showModal}>Add Task</Button>
                                    </div>
                                    : ''}
                                </div>

                            </div>
                            <div className="card-body table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Engineer Name</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.tasks.length  > 0 ?
                                            this.state.tasks.map((value,i) => {
                                                return (
                                                <tr key={i}>
                                                    <td>{i+1}</td>
                                                    <td>{value.title}</td>
                                                    <td>{value.description}</td>
                                                    <td>{value.assignee_name}</td>
                                                    <td>{value.start_date}</td>
                                                    <td>{value.due_date}</td>
                                                    <td>{value.status === 'P' ? 'In Progress' : (value.status === 'O' ? 'Open' : 'Completed')}</td>
                                                    {user.role === 'admin' ?
                                                        <td>
                                                            <Link to={`/task_show/${value.id}`} className="btn btn-sm btn-info"><i className="fa fa-eye"></i></Link>
                                                            <button className="btn btn-sm btn-success ml-2" onClick={() => this.handleEdit(value)} ><i className="fa fa-edit"></i></button>
                                                            <button className="btn btn-sm btn-danger ml-2" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this task?')) this.handleDelete(value.id) } } ><i className="fa fa-trash"></i></button>

                                                        </td>
                                                    :
                                                        <td>
                                                            <Link to={`/task_show/${value.id}`} className="btn btn-sm btn-info">Show</Link>
                                                            { value.status === 'P' ?

                                                                <button className="btn btn-sm btn-success ml-2" onClick={() => this.handleComplete(value,'A')} >Completed</button>

                                                            :  ((value.status === 'O') ?
                                                                <button className="btn btn-sm btn-info pull-right" onClick={() => this.handleComplete(this.state.task,'P')}>Mark In Progress</button>
                                                        :'' )
                                                        }
                                                        </td>
                                                    }

                                                </tr>
                                                )
                                            })

                                            : <tr><td colSpan="8" className="text-center">Not Found</td></tr>

                                       }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Modal show={this.state.show} onHide={this.hideModal}>
                        <Modal.Header >
                        <Modal.Title>{this.state.id === '' ? 'Add' : 'Edit'} Task

                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <form name="memberForm" autoComplete="off" className="memberForm" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>Task Title</label>
                                <input type="text" name="title" className="form-control" placeholder="Enter Title" required="required" value={this.state.title} onChange={(event) => {this.setState({title:event.target.value})}} />
                            </div>
                            <div className="form-group">
                                <label >Task Description</label>
                                <textarea className="form-control" name="description" cols="10" rows="7" onChange={(event) => {this.setState({description:event.target.value})}} defaultValue={this.state.description}></textarea>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <label >Set a start date </label>
                                    <DateTimePicker
                                        minDate={new Date()}
                                        onChange={date => this.setState({start_date:date})} value={this.state.start_date} className="form-control p-0 h-0"
                                        format="y-MM-dd HH:mm:ss"
                                        isClockOpen={false}
                                    />

                                </div>
                                <div className="form-group col-md-12">
                                    <label >Set a due date </label>
                                    <DateTimePicker
                                        minDate={new Date()}
                                        onChange={date => this.setState({due_date:date})} value={this.state.due_date} className="form-control p-0"
                                        isClockOpen={false}
                                        format="y-MM-dd HH:mm:ss"
                                    />

                                    {Object.keys(this.state.errors).length > 0 ? <span className="text-danger font-weight-bold">{this.state.errors.due_date}</span> : ''}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Task Assignee </label>
                                <select className="form-control" onChange={(event) => {this.setState({assignee_id:event.target.value})}} name="assignee_id" value={this.state.assignee_id} required="required">
                                    <option value="" key={0}>Select Engineer</option>
                                 {
                                        this.state.members.length  > 0 ?
                                            this.state.members.map((value,i) => {
                                                return (
                                                    <option value={value.id} key={value.id}>{value.name}</option>
                                                    )
                                            })
                                            : ''

                                       }

                                </select>
                            </div>
                            <div className="form-group">
                                <input type="hidden" name='id' value={this.state.id} />
                                <button type="submit" className="btn btn-sm btn-success">Submit</button>
                            </div>
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


import React from "react";
import NavBar from './navbar';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed
import bootstrapPlugin from '@fullcalendar/bootstrap';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import DateTimePicker from 'react-datetime-picker';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import checkIcon from '../check.svg';
import errorIcon from '../error.svg';
import Toast from './Toast';
const axios = require('axios');
const user = JSON.parse(localStorage.getItem('user'));



const color=['green','red','pink','blue','skyblue','black']
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            showTask: false,
            view: 'O',
            tasks: {},
            toastList:[],
            calendarTasks: {},
            members: [],
            id: '',
            title: '',
            description: '',
            start_date: new Date(),
            due_date: new Date(),
            assignee_id: '',
            errors: {},
            resources: {},
            task: ''

        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.getFullDate = this.getFullDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.viewChange = this.viewChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount = async () => {


        var users = await axios.get('http://localhost:3001/users?role=engineer').then(result => {
            return result.data;
        }).catch(err => console.log(err));

        await this.setState({ members: users })
        var resources = await users.map((value, i) => {
            return {
                id: value.id,
                title: value.name
            }
        });
        await this.getTasks();
        await this.setState({ resources: resources })

    }


    getTasks = async (status = 'O') => {
        var tasks = {};
        if (user.role === 'admin') {
            tasks = await axios.get('http://localhost:3001/tasks?status='+status).then(result => {
                return result.data;
            }).catch(err => console.log(err));
        } else {
            tasks = await axios.get('http://localhost:3001/tasks?assignee_id=' + user.id + '&status='+status).then(result => {
                return result.data;
            }).catch(err => console.log(err));
        }

        var calendarTask = await tasks.map((value, i) => {
            return {
                id: value.id,
                start: value.start_date,
                end: value.due_date,
                title: value.title,
                description: value.description,
                resourceId: value.assignee_id,
                status: value.status,
                start_date:new Date(value.start_date),
                due_date: new Date(value.due_date),
                color: color[i]
            }
        });

        await this.setState({ calendarTasks: calendarTask })

    }

    showModal = async (event) => {
        var d1 = new Date();

        var today = new Date(this.getFullDate(d1).date);
        var date = new Date(this.getFullDate(event.date).date);
        if (date.getTime() >= today.getTime()) {
            this.setState(
                {
                    title: '',
                    description: '',
                    start_date: event.date,
                    id: '',
                    due_date: event.date,
                    assignee_id: '',
                    show: true
                }
            );
        } else {

           this.setState({
                toastList:[{
                    id:'1',
                    title: 'Warning',
                    description: "You can't create previous date event",
                    backgroundColor: 'warning',
                    icon: errorIcon
                }]
            });
        }

        console.log(this.state.toastList)
    }

    taskShowModal = async (event) => {
        console.log(event)
        await this.setState(
            {
                title: event.event.title,
                description: event.event.extendedProps.description,
                start_date:event.event._instance.range.start,
                id: event.event._def.publicId,
                due_date: event.event._instance.range.end,
                status: event.event.extendedProps.status,
                showTask: true
            }
        );

        var task = await axios.get('http://localhost:3001/tasks/' + this.state.id).then(result => {
            return result.data;
        }).catch(err => console.log(err));
        await this.setState({ task: task });

    }

    hideModal = () => {
        this.setState({ show: false });
        this.setState({ showTask: false });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        var errors = {};
        var d1 = new Date(this.getFullDate(this.state.start_date).date);
        var d2 = new Date(this.getFullDate(this.state.due_date).date);

        if (d1.getTime() > d2.getTime()) {
            errors["due_date"] = 'Due date is greater than or equal to start date';
            await this.setState({ errors: errors })

        } else {
            await this.setState({ errors: {} })
        }
        if (Object.keys(this.state.errors).length === 0) {
            //  console.log('asdasdasd');
            var start_date = this.getFullDate(this.state.start_date).datetime;
            var due_date = this.getFullDate(this.state.due_date).datetime;

            var assignee_name = await axios.get('http://localhost:3001/users/' + this.state.assignee_id).then(result => {
                return result.data.name;
            }).catch(err => console.log(err));

            var json = '';
            if (this.state.id === '') {
                json = await axios.post('http://localhost:3001/tasks/', {
                    title: this.state.title,
                    description: this.state.description,
                    start_date: start_date,
                    due_date: due_date,
                    assignee_id: this.state.assignee_id,
                    assignee_name: assignee_name,
                    status: 'O'
                }).then(result => {
                    console.log(result);
                    this.setState({
                        toastList:[{
                            id:'1',
                            title: 'Success',
                            description: "Task created successfully",
                            backgroundColor: 'success',
                            icon: checkIcon
                        }]
                    });

                }).catch(err => {
                    console.log(err);
                });
            } else {
                json = await axios.put('http://localhost:3001/tasks/' + this.state.id, {
                    title: this.state.title,
                    description: this.state.description,
                    start_date: start_date,
                    due_date: due_date,
                    assignee_id: this.state.assignee_id,
                    assignee_name: assignee_name,
                    status: 'O'
                }).then((result) => {

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
            this.setState({ show: false });
            await this.getTasks();
        }

    }

    getFullDate = (date) => {
        var s_date = new Date(date);
        var s_month = (parseInt(s_date.getMonth()) + parseInt(1)) <= 9 ? ('0' + (parseInt(s_date.getMonth()) + parseInt(1))) : (parseInt(s_date.getMonth()) + parseInt(1));
        var s_day = s_date.getDate() <= 9 ? '0' + s_date.getDate() : s_date.getDate();
        var s_hour = s_date.getHours() <= 9 ? '0' + s_date.getHours() : s_date.getHours();
        var s_min = s_date.getMinutes() <= 9 ? '0' + s_date.getMinutes() : s_date.getMinutes();
        var s_sec = s_date.getSeconds() <= 9 ? '0' + s_date.getSeconds() : s_date.getSeconds();

        var final_date = s_date.getFullYear() + '-' + s_month + '-' + s_day;
        return {
            datetime: s_date.getFullYear() + '-' + s_month + '-' + s_day + 'T' + s_hour + ':' + s_min + ':' + s_sec,
            date: final_date
        };

    }

    handleEdit = async (event) => {
               await this.setState(
            {
                title: event.event.title,
                description: event.event.extendedProps.description,
                start_date:event.event.extendedProps.start_date,
                id: event.event._def.publicId,
                due_date: event.event.extendedProps.due_date,
                assignee_id: event.event._def.resourceIds[0],
                show: true
            }
        );

    }
    viewChange = async (btn) => {
        await this.setState({ view: btn });
        await this.getTasks(btn);

    }

    handleDelete = async (id,status,view) => {
        var json1 = await axios.get('http://localhost:3001/comments/?task_id=' + id).then(result => {
            if (result.data.length > 0) {
                result.data.map(value => {
                    axios.delete('http://localhost:3001/comments/' + value.id).then(rs => console.log(rs)).catch(er => console.log(er))

                });
            }
        }).catch(err => {
            console.log(err);
        });
        var json = await axios.delete('http://localhost:3001/tasks/' + id).then(result => {
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
        this.setState({ show: false });
        await this.getTasks(view);

    }

    handleComplete = async (value,status) => {

        var json = await axios.put('http://localhost:3001/tasks/' + value.id, {
            title: value.title,
            description: value.description,
            start_date: value.start_date,
            due_date: value.due_date,
            assignee_id: value.assignee_id,
            assignee_name: value.assignee_name,
            status: status
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
        this.setState({ showTask: false });
        await this.getTasks(status);
    }


    render() {

        return (
            <>

                <NavBar />
                <div className="container">
                    {this.state.toastList.length > 0 ?
                        <Toast
                        toastList={this.state.toastList}
                        position="bottom-right"
                        /> : "" }

                    {/* {user.role === 'admin' ? */}
                        <div className="row mb-5 mt-5">
                            <div className="col-md-12">
                                {/* <button className={"mr-2 btn btn-sm "+(this.state.view === 'dayGrid' ? "btn-primary" : "btn-secondary") } onClick={() => this.viewChange('dayGrid')}>Day Grid View</button>
                            <button className={"mr-2 btn btn-sm "+ (this.state.view === 'resourceGrid' ? "btn-primary" : "btn-secondary") } onClick={() => this.viewChange('resourceGrid')}>Resource View</button> */}

                                <button className={"mr-2 btn btn-sm " + (this.state.view === 'O' ? "btn-primary" : "btn-secondary")} onClick={() => this.viewChange('O')}>Open Task</button>

                                <button className={"mr-2 btn btn-sm " + (this.state.view === 'P' ? "btn-primary" : "btn-secondary")} onClick={() => this.viewChange('P')}>In Progress Task</button>

                                <button className={"mr-2 btn btn-sm " + (this.state.view === 'A' ? "btn-primary" : "btn-secondary")} onClick={() => this.viewChange('A')}>Complete Task</button>



                            </div>
                        </div>

                        {/* : ''} */}
                    <div className="row mt-5">
                        <div className="col-md-12">
                            {(user.role === 'admin') ?
                                    (this.state.resources.length > 0 ?
                                        <FullCalendar
                                            plugins={[dayGridPlugin, resourceTimelinePlugin, interactionPlugin, bootstrapPlugin]}
                                            themeSystem='bootstrap'
                                            initialView="resourceTimeline"
                                            resources={this.state.resources}
                                            events={this.state.calendarTasks}

                                            eventClick={(event) => this.handleEdit(event)}
                                            dateClick={(event) => this.showModal(event)}

                                        />
                                        :
                                    '')
                                :
                                <FullCalendar
                                    plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                                    themeSystem='bootstrap'
                                    initialView="dayGridMonth"
                                    events={this.state.calendarTasks}
                                    eventClick={(event) => this.taskShowModal(event)}
                                />



                            }



                        </div>
                        <Modal show={this.state.show} onHide={this.hideModal}>
                            <Modal.Header >
                                <Modal.Title>{this.state.id === '' ? 'Add' : 'Edit'} Task

                        </Modal.Title>
                                {this.state.id !== '' ?
                                    <Link to={`/task_show/${this.state.id}`} className="btn btn-sm btn-info mr-2 ml-auto"><i className="fa fa-eye"></i></Link>
                                    : ''}
                                {this.state.id !== '' ?
                                    (<button className="btn btn-sm btn-danger" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this task?')) this.handleDelete(this.state.id,this.state.view) }} ><i className="fa fa-trash"></i></button>)
                                    : ''}


                            </Modal.Header>
                            <Modal.Body>
                                <form name="memberForm" autoComplete="off" className="memberForm" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label>Task Title</label>
                                        <input type="text" name="title" className="form-control" placeholder="Enter Title" required={true} value={this.state.title} onChange={(event) => { this.setState({ title: event.target.value }) }} />
                                    </div>
                                    <div className="form-group">
                                        <label >Task Description</label>
                                        <textarea className="form-control" name="description" cols="8" rows="4" onChange={(event) => { this.setState({ description: event.target.value }) }} defaultValue={this.state.description}></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <label >Set a start date </label>

                                            <DateTimePicker
                                                minDate={new Date()}
                                                onChange={date => this.setState({ start_date: date })} value={this.state.start_date} className="form-control p-0 h-0"
                                                format="y-MM-dd HH:mm:ss"
                                                isClockOpen={false}
                                            />

                                        </div>
                                        <div className="form-group col-md-12">
                                            <label >Set a due date </label>
                                            <DateTimePicker
                                                minDate={new Date()}
                                                onChange={date => this.setState({ due_date: date })} value={this.state.due_date} className="form-control p-0"
                                                isClockOpen={false}
                                                format="y-MM-dd HH:mm:ss"
                                            />

                                            {Object.keys(this.state.errors).length > 0 ? <span className="text-danger font-weight-bold">{this.state.errors.due_date}</span> : ''}
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <label>Task Assignee </label>
                                        <select className="form-control" onChange={(event) => { this.setState({ assignee_id: event.target.value }) }} name="assignee_id" defaultValue={this.state.assignee_id} required={true}>
                                            <option value="" key={0}>Select Engineer</option>
                                            {
                                                this.state.members.length > 0 ?
                                                    this.state.members.map((value, i) => {
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

                        <Modal show={this.state.showTask} onHide={this.hideModal}>
                            <Modal.Header >
                                <Modal.Title>Show Task

                        </Modal.Title>

                            {this.state.status === 'P' ?
                                <button className="btn btn-sm btn-success pull-right" onClick={() => this.handleComplete(this.state.task,'A',this.state.view)}>Mark Completed</button>
                                :
                                ((this.state.status === 'O') ?
                                    <button className="btn btn-sm btn-info pull-right" onClick={() => this.handleComplete(this.state.task,'P',this.state.view)}>Mark In Progress</button>
                                :'' )


                            }

                            </Modal.Header>
                            <Modal.Body>
                                <div className="row mt-5">
                                    <div className="col-md-12 m-auto">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="card-title">Task Details</div>

                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <h6 className="mb-3"> <span className="font-weight-bold">Title</span> : {this.state.title}</h6>
                                                        <h6 className="mb-3"> <span className="font-weight-bold">Creator</span> : Admin</h6>
                                                        <h6 className="mb-3"><span className="font-weight-bold">Start Date</span> : {this.getFullDate(this.state.start_date).date} <span className="font-weight-bold"><i className="fa fa-arrow-right"></i></span> <span className="font-weight-bold">Due Date</span> : {this.getFullDate(this.state.due_date).date} </h6>
                                                        <h6 className="mb-3"><span className="font-weight-bold">Status</span> : {this.state.status === 'P' ? 'In Progress' : (this.state.status === 'O' ? 'Open' : 'Completed')}</h6>
                                                        <h6 className="font-weight-bold">DESCRIPTION: </h6>
                                                        <span>{this.state.description}</span>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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

import React from 'react';
import {Modal,Button} from 'react-bootstrap';
import DatePicker from "react-datepicker";
const axios = require('axios');

export default class TaskModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            members:[],
            id:'',
            title:'',
            description:'',
            start_date:new Date(),
            due_date:new Date(),
            assignee_id:'',
            errors:{}
        };
        this.showModal = this.showModal.bind(this);


    }
    componentDidMount = async () => {
        var users = await axios.get('http://localhost:3001/users?role=engineer').then(result => {
            return result.data;
        }).catch(err => console.log(err));

        this.setState({members : users})
    }

    showModal =  () => {
        console.log('asdasd')
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


    render(){
        return (
            <>
                <Modal show={this.state.show} onHide={this.hideModal}>
                    <Modal.Header >
                    <Modal.Title>{this.state.id === '' ? 'Add' : 'Edit'} Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form name="memberForm" autoComplete="off" className="memberForm" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Task Title</label>
                            <input type="text" name="title" className="form-control" placeholder="Enter Title" required="required" value={this.state.title} onChange={(event) => {this.setState({title:event.target.value})}} />
                        </div>
                        <div className="form-group">
                            <label >Task Description</label>
                            <textarea className="form-control" name="description" cols="10" rows="7" onChange={(event) => {this.setState({description:event.target.value})}}>{this.state.description}</textarea>
                        </div>
                        <div className="form-group">
                            <label >Set a start date </label>
                            <DatePicker selected={this.state.start_date} onChange={date => this.setState({start_date:date})}className="form-control" dateFormat="Y-MM-dd" minDate={new Date()} required="required" />
                        </div>
                        <div className="form-group">
                            <label >Set a due date </label>
                            <DatePicker selected={this.state.due_date} onChange={date => this.setState({due_date:date})} className="form-control" dateFormat="Y-MM-dd" minDate={new Date()} required="required" />
                            {Object.keys(this.state.errors).length > 0 ? <span className="text-danger font-weight-bold">{this.state.errors.due_date}</span> : ''}
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
            </>

        )
    }

}

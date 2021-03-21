
import React from "react";
import NavBar from './navbar';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed
import bootstrapPlugin from '@fullcalendar/bootstrap';
const axios = require('axios');
const user = JSON.parse(localStorage.getItem('user'));

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks :{},
            calendarTasks:{}
        };
    }

    componentDidMount = async () => {
        var tasks = {};
        if( user.role ==='admin'){
            tasks =  await axios.get('http://localhost:3001/tasks?status=P').then(result => {
               return result.data;
           }).catch(err => console.log(err));
        }else{
            tasks =  await axios.get('http://localhost:3001/tasks?assignee_id='+user.id+'&status=P').then(result => {
                return result.data;
            }).catch(err => console.log(err));
        }

        var calendarTask = await tasks.map((value,i) => {
            return {
                start:value.start_date,
                end: value.due_date,
                title:value.title,
                url:`/task_show/${value.id}`,
                description:value.description
            }
        });

        this.setState({calendarTasks:calendarTask})
    }



 render() {
    return (
        <>
            <NavBar />
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12">

                        <FullCalendar
                            plugins={[ dayGridPlugin,interactionPlugin,bootstrapPlugin ]}
                            themeSystem='bootstrap'
                            initialView="dayGridMonth"
                            events={this.state.calendarTasks}
                            eventClick={
                                function(arg){

                                }
                            }
                        />

                    </div>
                </div>
            </div>

        </>
        );
    }
}

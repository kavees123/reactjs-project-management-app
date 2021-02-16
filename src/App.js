
import './App.css';
import Modal from './component/Modal';
import { Component } from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import reactDom from 'react-dom';
import Card from './component/Cards';
import Progresscard from './component/progresscards';
class App extends Component {
  state = {
    modal: false,
    name: "",
    modalInputName: "",
    tasks:[],
    in_progress_tasks: [],
    finished_tasks: []
  };

  componentDidMount(){
    console.log("Component did mount is called");
    axios.get('https://react-tasks-7a5ce-default-rtdb.firebaseio.com/tasks.json')
    .then(res=> {
    

      const fetchedRequest = [];

      for(let key in res.data){
        fetchedRequest.push({
          ...res.data[key],
          id:key
        })
      }

      this.setState({tasks: fetchedRequest});
    
    
    });

    axios.get('https://react-tasks-7a5ce-default-rtdb.firebaseio.com/progress.json')
    .then(res=> {
      

      const fetchedRequest = [];

      for(let key in res.data){
        fetchedRequest.push({
          ...res.data[key],
          id:key
        })
      }

      this.setState({in_progress_tasks: fetchedRequest});
    
    
    });

    axios.get('https://react-tasks-7a5ce-default-rtdb.firebaseio.com/finshed.json')
    .then(res=> {
      

      const fetchedRequest = [];

      for(let key in res.data){
        fetchedRequest.push({
          ...res.data[key],
          id:key
        })
      }

      this.setState({finished_tasks: fetchedRequest});
    
    
    });
  }

handleChange = (e) =>  {
  const target = e.target;
  const name = target.name;
  const value = target.value;

  this.setState({
    [name]: value
  });
}

handleSubmit = (e) =>  {

  this.setState({ name: this.state.modalInputName });
  var old_tasks = this.state.tasks;
  old_tasks.push(this.state.modalInputName);
  this.setState({tasks: old_tasks});

  this.modalClose();
  const tasks = {
    name: this.state.tasks
  };
 
  axios.post(`https://react-tasks-7a5ce-default-rtdb.firebaseio.com/tasks.json`, {name:this.state.modalInputName})
      .then(res => {
        console.log(res);
        console.log(res.data);
        window.location.reload(false);
      });


     
}

modalOpen = () => {
  this.setState({ modal: true });
}

modalClose = () => {
  this.setState({
    modalInputName: "",
    modal: false
  });
}
delete_task = (index) => {
  console.log("The delete task is getting called " + "https://react-tasks-7a5ce-default-rtdb.firebaseio.com/tasks" + index +".json");
  axios.delete("https://react-tasks-7a5ce-default-rtdb.firebaseio.com/tasks/" + index +".json")
  .then(() => {
    var test_in = this.state.tasks;
    for(let i =0; i< test_in.length; i++){
      if(test_in[i].id === index){
        test_in.splice(i,1);
      }
    }
    this.setState({tasks: test_in});
  });
}

delete_task_in_progress = (index) => {
  axios.delete("https://react-tasks-7a5ce-default-rtdb.firebaseio.com/progress/" + index +".json")
  .then(() => {
    var test_in = this.state.in_progress_tasks;
    for(let i =0; i< test_in.length; i++){
      if(test_in[i].id === index){
        test_in.splice(i,1);
      }
    }
    this.setState({in_progress_tasks: test_in});
  });
}

delete_task_finished_tasks = (index) => {
  axios.delete("https://react-tasks-7a5ce-default-rtdb.firebaseio.com/finshed/" + index +".json")
  .then(() => {
    var test_in = this.state.finished_tasks
    for(let i =0; i< test_in.length; i++){
      if(test_in[i].id === index){
        test_in.splice(i,1);
      }
    }
    this.setState({finished_tasks: test_in});
  });
}

move_to_in_progress= (index) => {
  console.log("Inside the move to function" + index.name);
  axios.post(`https://react-tasks-7a5ce-default-rtdb.firebaseio.com/progress.json`, {name:index.name})
      .then(res => {
        this.delete_task(index.id);
        let old = this.state.in_progress_tasks;
        old.push(index);
        this.setState({in_progress_tasks: old});
       // window.location.reload(false);
      });
}

move_back_to_active= (index)=> {
  console.log("Move back to active is called "+ index.id  );
  axios.delete("https://react-tasks-7a5ce-default-rtdb.firebaseio.com/progress/" + index.id +".json")
  .then(() => {
    var test_in = this.state.in_progress_tasks;
    for(let i =0; i< test_in.length; i++){
      if(test_in[i].id === index.id){
        test_in.splice(i,1);
      }
    }
    this.setState({in_progress_tasks: test_in});
    axios.post(`https://react-tasks-7a5ce-default-rtdb.firebaseio.com/tasks.json`, {name:index.name})
    .then(res => {
      console.log(res);
      console.log(res.data);
      window.location.reload(false);
    });
  });

}

finshed_tasks_section = (item) => {
  axios.post(`https://react-tasks-7a5ce-default-rtdb.firebaseio.com/finshed.json`, {name:item.name})
  .then(res => {
    this.delete_task_in_progress(item.id);
    let old = this.state.finished_tasks;
    old.push(item);
    this.setState({finished_tasks: old});
   // window.location.reload(false);
  });
}

finshed_to_in_progess= (index) => {
  axios.post(`https://react-tasks-7a5ce-default-rtdb.firebaseio.com/progress.json`, {name:index.name})
  .then(res => {
    this.delete_task_finished_tasks(index.id);
    let old = this.state.in_progress_tasks;
    old.push(index);
    this.setState({in_progress_tasks: old});
   // window.location.reload(false);
  });
}

  render()
{
  console.log("The length of the finshed map is " + this.state.finished_tasks.length);
  const divStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const divcss = {
    float: 'left',
 
    padding: '5px 10px',
    marginright: '10px',
  }

  let test_const = this.state.tasks.map( (item,index) => 
       <span style={divStyle}  key={index}> 
        <Card id={index} key={index} label={item.name} delete_function={() => this.delete_task(item.id)}></Card> 
      
        <button onClick={() => this.move_to_in_progress(item)}>Work on this task</button>
       </span>
      );

      let in_progress_display = this.state.in_progress_tasks.map( (item,index) => 
      <span style={divStyle}  key={index}> 
      <button onClick={() => this.move_back_to_active(item)} >Send Task Back to Queue</button>
       <Progresscard id={index} key={index} label={item.name} ></Progresscard> 
       <button onClick={() => this.finshed_tasks_section(item)}>Finsh Task</button>
     
      </span>
     );

     let finished_display =  this.state.finished_tasks.map((item,index) => (
     <span key={index}>
      <Progresscard id={index} key={index} label={item.name} ></Progresscard> 
      <button onClick={() => this.finshed_to_in_progess(item)}>Work on this task</button>
  </span>      
    )
    );
    
    return(
      <div  >
        <div style={divcss} >
        <h4>Active tasks</h4>
     
        {test_const}
        
        {/*   <ul>
          {this.state.tasks.map((item,index) => 
               <li key={index}>{item.name}</li>
          )}
        </ul> */}
      <a href="javascript:;" onClick={e => this.modalOpen(e)}>
        Click To add New Active Task
      </a>
      <Modal show={this.state.modal} handleClose={e => this.modalClose(e)}>
        
        <div className="form-group">
          <label>Enter Task Info Below:</label>
          <input
            type="text"
            value={this.state.modalInputName}
            name="modalInputName"
            onChange={e => this.handleChange(e)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button onClick={e => this.handleSubmit(e)} type="button">
            Save
          </button>
        </div>
      </Modal>
      </div>
      <div  style={divcss}  >
        <h4>In progress tasks</h4>
        {in_progress_display}
      
      </div>
      <div   style={divcss}>
        
        <h4>Finshed Tasks</h4>
        {finished_display}
      </div>
    </div>
    );
}  
}

export default App;

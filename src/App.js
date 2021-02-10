
import './App.css';
import Modal from './component/Modal';
import { Component } from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import reactDom from 'react-dom';
class App extends Component {
  state = {
    modal: false,
    name: "",
    modalInputName: "",
    tasks:[]
  };

  componentDidMount(){
    console.log("Component did mount is called");
    axios.get('https://react-tasks-7a5ce-default-rtdb.firebaseio.com/tasks.json')
    .then(res=> {
      console.log(res);
      console.log("The data is " + res.data);

      const fetchedRequest = [];

      for(let key in res.data){
        fetchedRequest.push({
          ...res.data[key],
          id:key
        })
      }

      this.setState({tasks: fetchedRequest});
    
    
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

  render()
{


 

    return(
      <div className="App">
        <h4>Active tasks</h4>
       
          <ul>
          {this.state.tasks.map((item,index) => 
               <li key={index}>{item.name}</li>
          )}
        </ul>
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
    );
}  
}

export default App;

import React, { Component } from "react";
import Modal from "./components/Modal";
import ParticleBackground from "./components/ParticleBackground";
import axios from "axios";



class App extends Component {
  state = {
    viewCompleted: false,
    activeItem: {
      title: "",
      description: "",
      completed: false,
      startDatetime: "",
      endDatetime: ""
    },
    todoList: [],
    modal: false
  };

  async componentDidMount() {
    try {
      const res = await fetch("http://localhost:8000/api/todos/");
      const todoList = await res.json();
      this.setState({
        todoList
      });
    } catch (e) {
      console.log(e);
    }
  }

  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal
    }));
  };

  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios.put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then(() => {
          this.setState(prevState => ({
            todoList: prevState.todoList.map(todo =>
              todo.id === item.id ? item : todo
            )
          }));
        })
        .catch(error => {
          console.error("Error updating item:", error);
        });
    } else {
      axios.post("http://localhost:8000/api/todos/", item)
        .then(response => {
          this.setState(prevState => ({
            todoList: [...prevState.todoList, response.data]
          }));
        })
        .catch(error => {
          console.error("Error creating item:", error);
        });
    }
  };
  

  createItem = () => {
    const item = {
      title: "",
      description: "",
      completed: false,
      startDatetime: "",
      endDatetime: ""
    };
    this.setState({
      activeItem: item,
      modal: true
    });
  };

  displayCompleted = status => {
    this.setState({
      viewCompleted: status
    });
  };

  handleItemClick = item => {
    const updatedItem = { ...item, completed: !item.completed };
    axios
      .put(`http://localhost:8000/api/todos/${item.id}/`, updatedItem)
      .then(() => {
        this.setState(prevState => ({
          todoList: prevState.todoList.map(todo =>
            todo.id === item.id ? updatedItem : todo
          )
        }));
      })
      .catch(error => {
        console.error("Error updating item:", error);
      });
  };

  renderTabList = () => {
    const { viewCompleted } = this.state;
    return (
      <div className="my-5 text-center">
        <button
          onClick={() => this.displayCompleted(true)}
          className={`btn mr-2 ${viewCompleted ? "btn-primary" : "btn-light"}`}
        >
          Complete
        </button>
        <button
          onClick={() => this.displayCompleted(false)}
          className={`btn ${viewCompleted ? "btn-light" : "btn-primary"}`}
        >
          Incomplete
        </button>
      </div>
    );
  };
  

  renderItems = () => {
    const { viewCompleted, todoList } = this.state;
    const newItems = todoList.filter(item => item.completed === viewCompleted);
    return newItems.map(item => {
      const startDate = new Date(item.startDatetime).toLocaleString();
      const endDate = new Date(item.endDatetime).toLocaleString();
      
      return (
        <li
          key={item.id}
          className={`list-group-item d-flex justify-content-between align-items-center ${
            item.completed ? "completed" : ""
          }`}
          onClick={() => this.handleItemClick(item)}
          style={{ cursor: "pointer" }}
        >
          <span>{item.title}</span>
          <span>{startDate} - {endDate}</span>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => {}}
          />
        </li>
      );
    });
  };
  

  render() {
    const { modal } = this.state;
  
    return (
      <main className="content">
      <ParticleBackground />
        <div className="row my-5">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
            <div className="card-header">
            <h1 className="text-center">To-do App</h1>
            </div>
              <div className="card-body">
                {this.renderTabList()}
                <ul className="list-group list-group-flush">
                  {this.renderItems()}
                </ul>
              </div>
              <div className="card-footer text-center">
                <button
                  onClick={this.createItem}
                  className="btn btn-success"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
        {modal && (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        )}
      </main>
    );
  }  
}

export default App;

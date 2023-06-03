import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class CustomModal extends Component {
  state = {
    title: "",
    description: "",
    startDatetime: "",
    endDatetime: ""
  };

  componentDidMount() {
    const { activeItem } = this.props;
    if (activeItem) {
      this.setState({
        title: activeItem.title,
        description: activeItem.description,
        startDatetime: activeItem.startDatetime,
        endDatetime: activeItem.endDatetime
      });
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { title, description, startDatetime, endDatetime } = this.state;
    const { activeItem } = this.props;

    const newItem = {
      title,
      description,
      startDatetime,
      endDatetime,
      completed: false
    };

    if (activeItem) {
      newItem.id = activeItem.id;
    }

    this.props.onSave(newItem);
    this.setState({ title: "", description: "", startDatetime: "", endDatetime: "" });
  };

  render() {
    const { toggle } = this.props;
    const { title, description, startDatetime, endDatetime } = this.state;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title ? "Edit Task" : "Add Task"}</ModalHeader>
        <ModalBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={this.handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                id="description"
                name="description"
                value={description}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="startDatetime">Start Date/Time</Label>
              <Input
                type="datetime-local"
                id="startDatetime"
                name="startDatetime"
                value={startDatetime}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDatetime">End Date/Time</Label>
              <Input
                type="datetime-local"
                id="endDatetime"
                name="endDatetime"
                value={endDatetime}
                onChange={this.handleChange}
              />
            </FormGroup>
            <ModalFooter>
              <Button color="primary">Save</Button>
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

export default CustomModal;

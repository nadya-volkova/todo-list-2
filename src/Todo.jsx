import React from "react";
import "./Todo.css";

export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isEditing: false,
      newName: props.todo.name,
      newDescription: props.todo.description,
      editError: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo.id !== this.props.todo.id ||
      nextProps.todo.checked !== this.props.todo.checked ||
      nextProps.todo.severity !== this.props.todo.severity ||
      nextState.isHovered !== this.state.isHovered ||
      nextState.isEditing !== this.state.isEditing ||
      nextState.newName !== this.state.newName ||
      nextState.newDescription !== this.state.newDescription ||
      nextState.editError !== this.state.editError
    );
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleEditClick = () => {
    const { todo } = this.props;
    this.setState({
      isEditing: true,
      newName: todo.name,
      newDescription: todo.description,
      editError: false,
    });
  };

  handleSaveClick = () => {
    const { newName, newDescription } = this.state;
    if (!newName.trim()) {
      this.setState({ editError: true });
      return;
    }
    const { todo, onTodoEdit } = this.props;
    onTodoEdit(todo.id, newName, newDescription);
    this.setState({ isEditing: false, editError: false });
  };

  handleCancelClick = () => {
    this.setState({ isEditing: false, editError: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { todo, onTodoChecked, onTodoDelete } = this.props;
    const { isHovered, isEditing, newName, newDescription, editError } =
      this.state;
    console.log("render " + todo.name);

    const severityClasses = {
      Срочно: "severity-high",
      Средне: "severity-medium",
      "Не срочно": "severity-low",
    };

    const severityClass = !todo.checked
      ? severityClasses[todo.severity] || ""
      : "";

    return (
      <li
        className={`todo-item ${
          todo.checked ? "checked" : ""
        } ${severityClass}`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <input
          type="checkbox"
          checked={todo.checked}
          onChange={onTodoChecked}
          className="checkbox"
        />
        {isEditing ? (
          <div className="edit-mode">
            <input
              type="text"
              name="newName"
              value={newName}
              onChange={this.handleChange}
              className={`edit-name ${editError ? "error" : ""}`}
            />
            <textarea
              name="newDescription"
              value={newDescription}
              onChange={this.handleChange}
              className="edit-description"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/14090/14090371.png"
              alt="Сохранить"
              onClick={this.handleSaveClick}
              className="save-icon"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/4225/4225690.png"
              alt="Отмена"
              onClick={this.handleCancelClick}
              className="cancel-icon"
            />
          </div>
        ) : (
          <div className="todo-text">
            <div className="todo-name">{todo.name}</div>
            <div className="todo-description">{todo.description}</div>
            <span className="todo-severity">{todo.severity}</span>
          </div>
        )}
        <div className="todo-info">
          <span className="todo-date">{todo.createdAt}</span>
          {isHovered && (
            <>
              <img
                src="https://cdn-icons-png.flaticon.com/128/2921/2921222.png"
                alt="Изменить"
                onClick={this.handleEditClick}
                className="edit-icon"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/3807/3807871.png"
                alt="Удалить"
                onClick={onTodoDelete}
                className="delete-icon"
              />
            </>
          )}
        </div>
      </li>
    );
  }
}

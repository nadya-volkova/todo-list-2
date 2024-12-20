import React from "react";
import "./App.css";
import Todo from "./Todo.jsx";
import Filters from "./Filters.jsx";
import Chance from "chance";
import { v4 as uuidv4 } from "uuid";

const chance = new Chance();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      value: "",
      description: "",
      todos: [],
      showIncomplete: false,
      inputError: false,
      search: "",
      severity: [],
      selectedSeverity: "Средне",
    };
    this.nameInput = React.createRef();
    this.descriptionInput = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.value !== this.state.value ||
      nextState.description !== this.state.description ||
      nextState.todos !== this.state.todos ||
      nextState.showIncomplete !== this.state.showIncomplete ||
      nextState.inputError !== this.state.inputError ||
      nextState.search !== this.state.search ||
      nextState.severity !== this.state.severity ||
      nextState.selectedSeverity !== this.state.selectedSeverity
    );
  }

  handleNameChange = (e) => {
    if (e.key === "ArrowDown") {
      this.descriptionInput.current.focus();
    } else if (e.key === "Enter") {
      this.addTodo();
    } else {
      this.setState({ value: e.target.value });
    }
  };

  handleDescriptionChange = (e) => {
    if (e.key === "ArrowUp") {
      this.nameInput.current.focus();
    } else if (e.key === "Enter") {
      this.addTodo();
    } else {
      this.setState({ description: e.target.value });
    }
  };

  addTodo = () => {
    const { value, description, selectedSeverity } = this.state;
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      this.setState({ inputError: true });
      return;
    }
    const newTodo = {
      id: uuidv4(),
      name: trimmedValue,
      description: description.trim(),
      checked: false,
      createdAt: new Date().toLocaleString(),
      severity: selectedSeverity,
    };

    this.setState((prevState) => ({
      value: "",
      description: "",
      todos: [newTodo, ...prevState.todos],
      inputError: false,
    }));
  };

  handleTodoChecked = (id) => (e) => {
    this.setState((prevState) => ({
      todos: prevState.todos
        .map((todo) =>
          todo.id === id ? { ...todo, checked: e.target.checked } : todo
        )
        .sort((a, b) => a.checked - b.checked),
    }));
  };

  handleTodoDelete = (id) => () => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== id),
    }));
  };

  handleTodoEdit = (id, newName, newDescription) => {
    const updatedTodo = {
      ...this.state.todos.find((todo) => todo.id === id),
      name: newName,
      description: newDescription,
    };
    const newTodos = this.state.todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    this.setState({ todos: newTodos });
  };

  toggleShowIncomplete = () => {
    this.setState((prevState) => ({
      showIncomplete: !prevState.showIncomplete,
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value.toLowerCase() });
  };

  handleSeverityChange = (severity) => {
    const newSeverityArray = this.state.severity.includes(severity)
      ? this.state.severity.filter((s) => s !== severity)
      : [...this.state.severity, severity];

    this.setState({ severity: newSeverityArray });
  };

  generateTasks = () => {
    const tasks = Array.from({ length: 1000 }, () => ({
      id: uuidv4(),
      name: chance.sentence({ words: 3 }),
      description: `${chance.sentence({ words: 6 })} ${chance.sentence({
        words: 6,
      })} ${chance.sentence({ words: 6 })}`,
      checked: false,
      createdAt: new Date().toLocaleString(),
      severity: ["Срочно", "Средне", "Не срочно"][
        Math.floor(Math.random() * 3)
      ],
    }));

    this.setState((prevState) => ({
      todos: [...tasks, ...prevState.todos],
    }));
  };

  clearTodos = () => {
    this.setState({ todos: [] });
  };

  render() {
    const { showIncomplete, search, severity } = this.state;
    const searchValue = search.toLowerCase();
    const filteredTodos = this.state.todos.filter((todo) => {
      const isSeverityMatch =
        severity.length === 0 || severity.includes(todo.severity);

      const nameIncludesSearch = todo.name.toLowerCase().includes(searchValue);
      const descriptionIncludesSearch = todo.description
        .toLowerCase()
        .includes(searchValue);

      return (
        (!showIncomplete || !todo.checked) &&
        (nameIncludesSearch || descriptionIncludesSearch) &&
        isSeverityMatch
      );
    });

    const filters = [
      {
        label: "Только невыполненные",
        type: "checkbox",
        checked: showIncomplete,
        onChange: this.toggleShowIncomplete,
      },
      {
        label: "Не срочно",
        type: "checkbox",
        value: "Не срочно",
        checked: severity.includes("Не срочно"),
        onChange: () => this.handleSeverityChange("Не срочно"),
      },
      {
        label: "Средне",
        type: "checkbox",
        value: "Средне",
        checked: severity.includes("Средне"),
        onChange: () => this.handleSeverityChange("Средне"),
      },
      {
        label: "Срочно",
        type: "checkbox",
        value: "Срочно",
        checked: severity.includes("Срочно"),
        onChange: () => this.handleSeverityChange("Срочно"),
      },
    ];

    return (
      <div className="container">
        <div className="header">
          <h1>TODO LIST</h1>
        </div>
        <div className="input-group">
          <div>
            <input
              ref={this.nameInput}
              value={this.state.value}
              onChange={this.handleNameChange}
              onKeyDown={this.handleNameChange}
              placeholder="Введите название задачи"
              className={`input-field ${this.state.inputError ? "error" : ""}`}
            />
            <input
              ref={this.descriptionInput}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
              onKeyDown={this.handleDescriptionChange}
              placeholder="Введите описание задачи"
              className="input-field"
            />
          </div>
          <div className="severity-buttons">
            <label>
              <input
                type="radio"
                name="severity"
                value="Срочно"
                checked={this.state.selectedSeverity === "Срочно"}
                onChange={() => this.setState({ selectedSeverity: "Срочно" })}
              />
              Срочно
            </label>
            <label>
              <input
                type="radio"
                name="severity"
                value="Средне"
                checked={this.state.selectedSeverity === "Средне"}
                onChange={() => this.setState({ selectedSeverity: "Средне" })}
              />
              Средне
            </label>
            <label>
              <input
                type="radio"
                name="severity"
                value="Не срочно"
                checked={this.state.selectedSeverity === "Не срочно"}
                onChange={() =>
                  this.setState({ selectedSeverity: "Не срочно" })
                }
              />
              Не срочно
            </label>
          </div>
          <button onClick={this.addTodo} className="add-button">
            ДОБАВИТЬ
          </button>
        </div>
        <button onClick={this.generateTasks} className="generate-button">
          Сгенерировать 1000 задач
        </button>
        <button onClick={this.clearTodos} className="clear-button">
          Удалить все задачи
        </button>
        <div className="group">
          <Filters
            showIncomplete={showIncomplete}
            toggleShowIncomplete={this.toggleShowIncomplete}
            search={this.state.search}
            handleSearchChange={this.handleSearchChange}
            filters={filters}
          />

          <ul className="todo-list">
            {this.state.todos.length === 0 ? null : filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  severity={todo.severity}
                  onTodoChecked={this.handleTodoChecked(todo.id)}
                  onTodoDelete={this.handleTodoDelete(todo.id)}
                  onTodoEdit={this.handleTodoEdit}
                />
              ))
            ) : (
              <li className="no-todos-message">
                Нет задач по заданным фильтрам....
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

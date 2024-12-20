import React from "react";
import "./Filters.css";

export default class Filters extends React.Component {
  render() {
    const {
      showIncomplete,
      toggleShowIncomplete,
      search,
      handleSearchChange,
      filters,
    } = this.props;

    return (
      <div className="filter-section">
        <input
          className="search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Поиск"
        />
        {filters.map((filter, index) => (
          <label key={index} className="filter-label">
            <input
              type={filter.type}
              checked={filter.checked}
              onChange={filter.onChange}
              value={filter.value}
            />
            {filter.label}
          </label>
        ))}
      </div>
    );
  }
}

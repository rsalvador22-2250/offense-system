import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const FilterBar = ({
  monthFilter, setMonthFilter,
  yearFilter, setYearFilter,
  sortFilter, setSortFilter,
  availableYears,
  onApplyFilters,
  onResetFilters,
  filteredCount,
  totalCount
}) => {
  const { toggleDarkMode } = useDarkMode();

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <i className="fas fa-filter"></i>
        <h3>Filter Records by Date</h3>
      </div>
      <div className="filter-controls">
        <div className="filter-group">
          <label><i className="fas fa-calendar-alt"></i> Select Month</label>
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="filter-select">
            <option value="all">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="filter-group">
          <label><i className="fas fa-calendar"></i> Select Year</label>
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="filter-select">
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label><i className="fas fa-sort"></i> Sort By</label>
          <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)} className="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
      <div className="filter-actions">
        <button className="filter-btn apply" onClick={onApplyFilters}>
          <i className="fas fa-check-circle"></i> Apply Filters
        </button>
        <button className="filter-btn reset" onClick={onResetFilters}>
          <i className="fas fa-undo-alt"></i> Reset
        </button>
        <button className="filter-btn dark-mode-toggle" onClick={toggleDarkMode}>
          <i className="fas fa-moon"></i> Dark Mode
        </button>
        <div className="filter-status">
          <i className="fas fa-info-circle"></i> Showing: <span>{filteredCount === totalCount ? `All (${totalCount})` : `${filteredCount} of ${totalCount}`}</span> records
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
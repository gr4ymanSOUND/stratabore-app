import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const MapFilters = ({filterState, setFilterState, jobList, setJobList, rigList, setFormType}) => {

  const [jobStatus, setJobStatus] = useState(filterState.jobStatus);
  const [client, setClient] = useState(filterState.client);
  const [startDate, setStartDate] = useState(filterState.startDate);
  const [endDate, setEndDate] = useState(filterState.endDate);
  const [rigsToShow, setRigsToShow] = useState(filterState.rigsToShow);

  // use state to fitler the joblist and set it to state
  const filterSubmit = (e) => {
    e.preventDefault();

    const newFilterState = {
      jobStatus: jobStatus,
      client: client,
      startDate: startDate,
      endDate: endDate,
      rigsToShow: rigsToShow,
    }
    setFilterState(newFilterState);
    setFormType("");
  }

  const handleMultiSelect = (selectedItems) => {
    console.log(selectedItems);
    const rigs = [];
    for (let i=0; i<selectedItems.length; i++) {
      rigs.push(selectedItems[i].value);
    }
    console.log(rigs);
    setRigsToShow(rigs);
  }

  return (
      <form className='form-container' onSubmit={filterSubmit}>
      <div className='job-form'>
        <div className="input-section">
          <label className="input-label">Job Status:</label>
          <select 
            id="jobStatus"
            name="jobStatus"
            value={jobStatus}
            onChange={({ target: { value } }) => setJobStatus(value)}
          >
            <option value="pending">All Pending</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
            <option value="complete">Complete</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>        
        <div className="input-section">
          <label className="input-label">Client:</label>
          <select 
            id="client"
            name="client"
            value={client}
            onChange={({ target: { value } }) => setClient(value)}
          >
            <option value="all">All</option>
            <option value="EWL">EWL</option>
            <option value="TER">TER</option>
            <option value="AAA">AAA</option>
            <option value="ZZZ">ZZZ</option>
          </select>
        </div>
        <div className="input-section">
          <label className="input-label">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={({ target: { value } }) => setStartDate(value)}
            className="form-control"
            id="StartDate"
            placeholder=""
          />
        </div>
        <div className="input-section">
          <label className="input-label">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={({ target: { value } }) => setEndDate(value)}
            className="form-control"
            id="endDate"
            placeholder=""
          />
        </div>
        <div className="input-section">
          <label className="input-label">Rig:</label>
          <select 
            id="rigsToShow"
            name="rigsToShow"
            value={rigsToShow}
            onChange={(e) => handleMultiSelect(e.target.selectedOptions)}
            multiple={true}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <button className="submit-button" type='submit'>Save</button>
      </div>
      </form>
  )
}

export default MapFilters;
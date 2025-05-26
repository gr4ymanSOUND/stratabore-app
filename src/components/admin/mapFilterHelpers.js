
export function statusFilter(job, filterState) {
  if (filterState.jobStatus == 'assigned') {
    return job.rigId != null;
  }
  if (filterState.jobStatus == 'unassigned') {
    return job.rigId == null;
  }
  return filterState.jobStatus == job.status;
}

export function clientFilter(job, filterState) {
  if (filterState.client == 'all') {
    return true;
  }
  return job.client == filterState.client;
}

export function rigFilter(job, filterState, rigList) {
  if (filterState.rigsToShow.length == rigList.length || filterState.rigsToShow.length == 0) {
    return true;
  }
  for (let i = 0; i < filterState.rigsToShow.length; i++) {
    if (job.rigId == filterState.rigsToShow[i]) {
      return job.rigId == filterState.rigsToShow[i];
    }
  }
}

export function dateFilter(job, filterState) {
  if (!filterState.startDate && !filterState.endDate) {
    return true;
  }
  if (!filterState.startDate && filterState.endDate) {
    return job.jobDate <= filterState.endDate;
  }
  if (filterState.startDate && !filterState.endDate) {
    return job.jobDate >= filterState.tartDate;
  }
  return job.jobDate >= filterState.startDate && jobDate <= filterState.endDate;
}
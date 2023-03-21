import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const Date = ({currentMonth, specificDate, jobList}) => {
  
  // split the date string into parts to create the date labels
  // check if the date is in the current month or not, and adjust the label appropriately
    const dateParts = specificDate.split("-");
    if (dateParts[1] != currentMonth + 1) {
      dateParts[2] = `(${dateParts[2]})`;
    }

  return (
    <div>{dateParts[2]}</div>
  )

}

export default Date;
import React, {  forwardRef, useImperativeHandle, useEffect, useState } from 'react';

export default forwardRef((props, ref) => {

  const [ filterState, setFilterstate ] = useState('off');

  // these are required for the filter to work
  // won't be using the model functions, those are related to saving a filter state and using it later
  useImperativeHandle(ref, () => {
    return {
      isFilterActive() {
        return filterState !== 'off';
      },
      doesFilterPass(params) {
        const field = props.colDef.field;
        return params.data[field] == filterState;
      },
      getModel() {
        return undefined;
      },
      setModel() {
      }
    };

  });

  // this tells the grid that the filter changed
  useEffect(() => props.filterChangedCallback(), [filterState])

  return (
    <div className='custom-filter'>
      <label htmlFor='off'className='filter-option'>
        <input
          name='off'
          type='radio' 
          onChange={()=> {setFilterstate('off')}}
          checked={filterState === 'off'}
          />
        None
      </label>
      {
        props.values.map( value => {
          const str = value;
          const displayValue = str.charAt(0).toUpperCase() + str.slice(1);

          return (
            <label className='filter-option' key={value}>
              <input
                type='radio' 
                onChange={()=> {setFilterstate(value)}}
                checked={filterState === value}
              />
              {displayValue}
            </label>
          )
        })
      }
    </div>
  )

})


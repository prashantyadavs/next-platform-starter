import React from 'react';

const Down = (props) => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props} // Allow passing additional props
  >
<path d="M24 10V38M24 38L38 24M24 38L10 24" stroke="red" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

  </svg>
);

export default Down;

import React from 'react';

const Up = (props) => (
  <svg 
    width="38" 
    height="38" 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props} // Allow passing additional props
  >
   <path d="M24 38V10M24 10L10 24M24 10L38 24" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

  </svg>
);

export default Up;

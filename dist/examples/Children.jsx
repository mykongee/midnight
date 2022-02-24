import React from 'react';
import Nested from './Nested.jsx.js';

const Children = (props) => {
  return (
      <div>
        <Nested propName='testing'/>
      </div>
  )
};

export default Children;
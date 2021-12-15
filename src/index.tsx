import React from 'react';
import ReactDOM from 'react-dom';

import App from './App'

const Page = () => {
  return <>
    <App />
  </>;
};

ReactDOM.render(<Page />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept(function () {
    console.log('Accepting the updated printMe module!')
  })
}
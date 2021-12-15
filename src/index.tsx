import React from 'react';
import ReactDOM from 'react-dom';

import ReduxTest from './components/ReduxTest'
import Dot from './components/Dot'

const App = () => {
  return <>
    <ReduxTest />
    {/* <Dot /> */}
  </>;
};

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept(function () {
    console.log('Accepting the updated printMe module!')
  })
}
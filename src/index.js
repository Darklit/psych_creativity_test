import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import PsychTest2 from './Components/PsychTest2';
import * as firebase from 'firebase';
import config from './config';
import Test from './Components/testing';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/memory" component={PsychTest2}/>
      <Route path="/test" component={Test}/>
    </div>
  </BrowserRouter>,document.getElementById('root'));
registerServiceWorker();

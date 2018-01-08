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

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/test" component={PsychTest2}/>
    </div>
  </BrowserRouter>,document.getElementById('root'));
registerServiceWorker();

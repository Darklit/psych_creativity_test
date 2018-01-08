import * as firebase from 'firebase';
import React, { Component } from 'react';
import '../App.css';
import databaseFunctions from '../Functions/databaseFunctions.js';

class TestComp extends Component {
  constructor(props){
    super();
  }

  async handleClick(){
    let dat = await databaseFunctions.getData('answers',['-L0qoVQTIxzLh9uw6k-J']);
    console.log(dat["1"]);
  }

  render(){
    return (
      <div className="App">
        <div className="container fluid add">
          <div className="jumbotron">
            <button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this)}>Click!</button>
          </div>
        </div>
      </div>
    )
  }
}

export default TestComp;

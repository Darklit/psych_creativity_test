import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from './Components/timer.js';

class App extends Component {
  constructor(props){
    super();
    let minute = new Date();
    let details = {
      1: ["empty"],
      2: ["empty"],
      3: ["empty"],
      4: ["empty"],
      5: ["empty"],
      6: ["empty"],
      7: ["empty"],
      8: ["empty"],
      9: ["empty"],
      10: ["empty"]
    };
    this.state = {
      buttonName: "Click to start.",
      time: minute.getMinutes(),
      clicked: false,
      minutes: -1,
      seconds: -1,
      answers: details,
      answerIndex: 0,
      drawing: 0,
      answers2: 0
    }
    //this.clicked = this.clicked.bind(this);
    this.handleTime = this.handleTime.bind(this);
  }

  static defaultProps = {
      questions: [
        (<img src="http://freevector.co/wp-content/uploads/2009/06/29942-triangular-silhouette-shapes.png" width="30%" height="30%"/>),
        (<img src="http://freevector.co/wp-content/uploads/2009/05/32263-explosion-variant-with-silhouettes-and-shapes.png" width="30%" height="30%"/>),
        (<img src="https://www.shareicon.net/download/2015/12/04/682209_line.svg" width="30%" height="30%"/>)
      ]
  }
  handleTime(){
  let timer = setInterval(()=>{
      this.setState({
        seconds: this.state.seconds-1
      });
      if(this.state.seconds < 0){
        this.setState({
          seconds: 59,
          minutes: this.state.minutes-1
        });
      }
      if(this.state.minutes < 0){
        if(this.state.answerIndex+1 >= this.props.questions.length){
          clearInterval(timer);
          this.setState({
            clicked: false,
            drawing: 2
          });
        }else{
          this.setState({
            answerIndex: this.state.answerIndex+1,
            minutes: 1,
            seconds: 0
          });
        }
      }
    },1000);
  }
  clicked(){
    if(!this.state.clicked){
      this.setState({
        buttonName: "Click to stop.",
        clicked: true,
        minutes: 1,
        seconds: 0
      });
      this.handleTime();
    }else{
      this.setState({
        buttonName: "Click to start.",
        clicked: false,
        minutes: 1,
        seconds: 0
      });
    }
  }

  clicked2(){
    this.setState({drawing: 1});
  }

  handleAnswer(answer){
    const data = this.refs.example.value;
    answer.preventDefault();
    let answers = this.state.answers;
    for(var i = 0; i < Object.keys(answers).length; i++){
      if(i == this.state.answerIndex){
        answers[Object.keys(answers)[i]][this.state.answers2] = data;
        this.setState({
          answers2: this.state.answers2+1
        });
        this.refs.example.value = "";
      }
    }
    this.setState({
      answers: answers
    });
    console.log(this.state.answers);
  }

  render() {
    let startUp = (
      <body>
        <div className="App" id="startUp">
          <div className="container" id="page-wrap">
            <h1>Welcome!</h1>
            <h5>This is the psychology creativity test! It works likes this: You have 2 minutes to come up with as many uses as you can for an abstract Object. It will cycle through 8 different objects then we will tell you your percentile against those who also took it!</h5>
            <button type="button" className="btn btn-warning" onClick={this.clicked2.bind(this)}>Click to begin</button>
          </div>
        </div>
      </body>
    );

    let answersArray = this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]];

    const listItems = answersArray.map((answer) => {
      if(answer != "empty") return(<li>{answer}</li>);
    });

    let questionArray = this.props.questions;
    let allAnswers = [];


    for(var i = 0; i < questionArray.length; i++){
      allAnswers[i] = this.state.answers[Object.keys(this.state.answers)[i]].map((answer) => {
        if(answer != "empty") return(<li>{answer}</li>);
      });
    }

    let drawAns = allAnswers.map((answer) => {
      <div className="col-sm">
        {answer}
      </div>
    });

    console.log(drawAns);

    let ending = (
      <div className="App">
        <h2>Your guesses!</h2>
        <div className="container">
          <div className="row">
            {drawAns}
          </div>
        </div>
      </div>
    );

    let started = (
      <div className="App">
        {this.state.clicked ? <Timer minutes={this.state.minutes} seconds={this.state.seconds} startMinutes="1" /> : <p></p>}
        <p></p>
          {!this.state.clicked ? <button type="button" className="btn btn-primary" onClick={this.clicked.bind(this)}>{this.state.buttonName}</button> : <p></p>}
          <p></p>
          <br/>
          <div className="container">
            <form onSubmit={this.handleAnswer.bind(this)}>
            <div className="row">
              <div className="col-sm">
              <label htmlFor="examples">{this.props.questions[this.state.answerIndex]}</label>
                <input ref="example" type="text" id="examples" className="form-control" onSubmit={this.handleAnswer.bind(this)}/>
              </div>
            </div>
          </form>
          </div>
          <ol>
            {listItems}
          </ol>
      </div>
    );
    if(this.state.drawing == 0) return startUp;
    else if(this.state.drawing == 1) return started;
    else if(this.state.drawing == 2) return ending;
    else return(<div>Error!</div>);
  }

}

export default App;

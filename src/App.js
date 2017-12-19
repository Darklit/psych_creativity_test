import React, { Component } from 'react';
import './App.css';
import Timer from './Components/timer.js';
import Ths from 'thesaurus';

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
    this.checkSynonyms = this.checkSynonyms.bind(this);
    this.checkDuplicates = this.checkDuplicates.bind(this);
  }

  static defaultProps = {
      questions: [
        (<img src="http://freevector.co/wp-content/uploads/2009/06/29942-triangular-silhouette-shapes.png" width="30%" height="30%" alt="Image 1"/>),
        (<img src="http://freevector.co/wp-content/uploads/2009/05/32263-explosion-variant-with-silhouettes-and-shapes.png" width="30%" height="30%" alt="Image 2"/>),
        (<img src="https://www.shareicon.net/download/2015/12/04/682209_line.svg" width="30%" height="30%" alt="Image 3"/>),
        (<img src="http://bryanbeus.com/wp-content/uploads/2014/10/001-007-Emotion-Shapes-5.jpg" width="30%" height="30%" alt="Image 4"/>)
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

  checkSynonyms(answer){
    let synonyms = Ths.find(answer.toLowerCase());
    for(var i = 0; i < this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]].length; i++){
      if(this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]][i] !== undefined){
        for(var g = 0; g < synonyms.length; g++){
            if(this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]][i].toLowerCase() === synonyms[g].toLowerCase()) return false;
        }
      }
    }
    return true;
  }

  checkDuplicates(answer){
    let answers = this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]];
    for(var i = 0; i < this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]].length; i++){
      if(answers[i] !== undefined){
        if(answer.toLowerCase() === answers[i].toLowerCase()) return false;
      }
    }
    return true;
  }

  handleAnswer(answer){
    const data = this.refs.example.value;
    answer.preventDefault();
    let answers = this.state.answers;
    for(var i = 0; i < Object.keys(answers).length; i++){
      if(i == this.state.answerIndex){
        if(this.checkSynonyms(data) && this.checkDuplicates(data)) answers[Object.keys(answers)[i]][this.state.answers2] = data;
        else alert("Too similar to one of your other answers!");
        this.setState({
          answers2: this.state.answers2+1
        });
        this.refs.example.value = "";
      }
    }
    this.setState({
      answers: answers
    });
  }

  skipMinute(){
    this.setState({
      seconds: 0
    });
  }

  render() {
    let startUp = (
        <div className="App" id="startUp">
          <div className="container" id="page-wrap">
            <h1>Welcome!</h1>
            <h5>This is the psychology creativity test! It works likes this: You have 2 minutes to come up with as many uses as you can for an abstract Object. It will cycle through 8 different objects then we will tell you your percentile against those who also took it!</h5>
            <button type="button" className="btn btn-warning" onClick={this.clicked2.bind(this)}>Click to begin</button>
          </div>
        </div>
    );

    let answersArray = this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]];

    const listItems = answersArray.map((answer) => {
      if(answer !== "empty") return(<li>{answer}</li>);
    });

    let questionArray = this.props.questions;
    let allAnswers = [];


    for(var i = 0; i < questionArray.length; i++){
      allAnswers[i] = this.state.answers[Object.keys(this.state.answers)[i]].map((answer) => {
        if(answer !== "empty") return(<li>{answer}</li>);
      });
    }

    let drawAns1 = allAnswers.map((answer,i) => {
      if(i<=2)return(<div className="col-sm">
          {this.props.questions[i]}
          {answer}
        </div>
      );
    });

    let drawAns2 = allAnswers.map((answer,i) => {
      if(i<=5 && i>2)return(<div className="col-sm">
          {this.props.questions[i]}
          {answer}
        </div>
      );
    });

    let drawAns3 = allAnswers.map((answer,i) => {
      if(i>5)return(
        <div className="col-sm">
          {this.props.questions[i]}
          {answer}
        </div>
      );
    });

    let answerNum = 0;

    for(var i = 0; i < Object.keys(this.state.answers).length; i++){
      for(var g = 0; g < this.state.answers[Object.keys(this.state.answers)[i]].length; g++){
        if(this.state.answers[Object.keys(this.state.answers)[i]][g] !== "empty" && this.state.answers[Object.keys(this.state.answers)[i]][g] !== undefined) answerNum++;
      }
    }

    let form = (
      <form onSubmit={this.handleAnswer.bind(this)} autocomplete="off">
      <div className="row">
        <div className="col-sm">
        <label htmlFor="examples">{this.props.questions[this.state.answerIndex]}</label>
          <input ref="example" type="text" id="examples" className="form-control" onSubmit={this.handleAnswer.bind(this)}/>
        </div>
      </div>
    </form>
  );

    let ending = (
      <div className="App">
        <h2>Your guesses!</h2>
        <div className="container">
          <div className="row">
            {drawAns1}
          </div>
          <div className="row">
            {drawAns2}
          </div>
          <div className="row">
            {drawAns3}
          </div>
        </div>
        <h4>Your total amount of answers: {answerNum}</h4>
      </div>
    );

    let started = (
      <div className="App">
        {this.state.clicked ? <Timer minutes={this.state.minutes} seconds={this.state.seconds} startMinutes="1" /> : <p></p>}
        <p></p>
          {!this.state.clicked ? <button type="button" className="btn btn-primary" onClick={this.clicked.bind(this)}>{this.state.buttonName}</button> : <p></p>}
          {this.state.clicked ? <button type="button" className="btn btn-primary" onClick={this.skipMinute.bind(this)}>Skip</button> : <p></p>}
          <p></p>
          <br/>
          <div className="container">
            {this.state.clicked ? form : <p></p>}
          </div>
          <ol>
            {listItems}
          </ol>
      </div>
    );
    if(this.state.drawing === 0) return startUp;
    else if(this.state.drawing === 1) return started;
    else if(this.state.drawing === 2) return ending;
    else return(<div>Error!</div>);
  }

}

export default App;

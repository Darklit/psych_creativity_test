import React, { Component } from 'react';
import './App.css';
import Timer from './Components/timer.js';
import Ths from 'thesaurus';
import * as firebase from 'firebase';
import config from './config.js';
import plural from 'pluralize';
import fs from 'fs';
import englishDic from 'dictionary-en-us';
import path from 'path';
import Answers from './Components/answers.js';



firebase.initializeApp(config);
var database = firebase.database();
class App extends Component {
  constructor(props){
    super();
    let minute = new Date();
    let details = {
      1: ["empty"],
      2: ["empty"],
      3: ["empty"],
      4: ["empty"]
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
      answers2: 0,
      milliseconds: 0,
      signedIn: false
    }
    //this.clicked = this.clicked.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.checkSynonyms = this.checkSynonyms.bind(this);
    this.checkDuplicates = this.checkDuplicates.bind(this);
    this.handleAverage = this.handleAverage.bind(this);
    this.listenData = this.listenData.bind(this);
    this.checkPlural = this.checkPlural.bind(this);
    this.checkReal = this.checkReal.bind(this);
    this.clicked = this.clicked.bind(this);
    this.checkVague = this.checkVague.bind(this);
  }

  static defaultProps = {
      questions: [
        (<img src={require('./imgs/image1.jpeg')} className="rotate" width="30%" height="30%" alt="Image 1"/>),
        (<img src={require('./imgs/image2.jpeg')} className="rotate" width="30%" height="30%" alt="Image 2"/>),
        (<img src={require('./imgs/image3.jpeg')} className="rotate" width="30%" height="30%" alt="Image 3"/>),
        (<img src={require('./imgs/image4.JPG')} width="30%" height="30%" alt="Image 4"/>)
      ],
      questions2: [
        (<img src={require('./imgs/image1.jpeg')} className="rotate" width="70%" height="70%" alt="Image 1"/>),
        (<img src={require('./imgs/image2.jpeg')} className="rotate" width="70%" height="70%" alt="Image 2"/>),
        (<img src={require('./imgs/image3.jpeg')} className="rotate" width="70%" height="70%" alt="Image 3"/>),
        (<img src={require('./imgs/image4.JPG')} width="70%" height="70%" alt="Image 4"/>)
      ]
  }
  handleTime(){
  let timer = setInterval(()=>{
      this.setState({
        milliseconds: this.state.milliseconds-50
      });
      if(this.state.milliseconds<=0){
        this.setState({
          seconds: this.state.seconds-1,
          milliseconds: 1000
        });
      }
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
          let answers = this.state.answers;
          this.listenData();
          database.ref('answers').push(answers,function(e){
            if(e) console.log("failed!");
            else console.log("worked!");
          });
        }else{
          this.setState({
            answerIndex: this.state.answerIndex+1,
            minutes: 2,
            seconds: 0,
            answers2: 0
          });
        }
      }
    },50);
  }
  clicked(){
    if(!this.state.clicked){
      this.setState({
        buttonName: "Click to stop.",
        clicked: true,
        minutes: 2,
        seconds: 0,
        milliseconds: 0
      });
      this.handleTime();
    }else{
      this.setState({
        buttonName: "Click to start.",
        clicked: false,
        minutes: 2,
        seconds: 0,
        milliseconds: 0
      });
    }
  }

  clicked2(){
    this.setState({drawing: 1, clicked: true});
    firebase.auth().signInAnonymously().catch(function(err){
      console.log(err.message);
    });
    this.clicked();
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


  checkReal(answer){
    /*
    let answers = this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]];
    let words = checkWord('en');

    let answerArr = answer.split(" ");

    for(var i = 0; i < answerArr.length; i++){
      if(!words.check(answerArr[i])) return false;
    }
    */
    //Broken, need new library :(
    return new Promise((fulfill,reject)=> {
      let bannedWords = firebase.database().ref('deleted');
      bannedWords.once('value',).then((dat)=>{
        let data = dat.val();
        let keys = Object.keys(data);
        for(var i = 0; i < keys.length; i++){
          if(data[keys[i]].toLowerCase() == answer.toLowerCase()) fulfill(false);
        }
        fulfill(true);
      });
    });

    return true;
  }

  checkVague(answer){
    const vagueAnswers = [
      "stuff",
      "things",
      "thing",
      "object",
      "rectangle",
      "square",
      "circle",
    ];

    let ansArr = answer.toLowerCase().split(" ");
    for(var i = 0; i < ansArr.length; i++){
      for(var g = 0; g < vagueAnswers.length; g++){
        if(ansArr[i].toLowerCase() == vagueAnswers[g]) return false;
      }
    }
    return true;
  }

  toXamplr(){
    window.location.href = 'http://www.xamplr.com';
  }

  checkPlural(answer){
    let answers = this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]];

    for(var i = 0; i < this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]].length; i++){
      if(answers[i] !== undefined){
        let singleWord1 = plural.singular(answers[i].toLowerCase());
        let singleWord2 = plural.singular(answer.toLowerCase());
        let pluralWord1 = plural.plural(answers[i].toLowerCase());
        let pluralWord2 = plural.plural(answer.toLowerCase());
        if(pluralWord1 === pluralWord2 || singleWord1 === singleWord2) return false;
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
        if(this.checkVague(data)){
        if(this.checkSynonyms(data) && this.checkDuplicates(data) && this.checkPlural(data)){
          let num = i;
          let test = this;
            this.checkReal(data).then((res)=>{
              if(res) answers[Object.keys(answers)[num]][test.state.answers2] = data;
              else alert("Sorry! You can't use that answer.");
              this.setState({
                answers2: this.state.answers2+1
              });
            }).catch(console.error);
          }
          else alert("Too similar to one of your other answers!");
        }else alert("Too vague!");
        this.refs.example.value = "";
      }
    }
    this.setState({
      answers: answers
    });
  }

  skipMinute(){
    this.setState({
      seconds: 0,
      minutes: 0
    });
  }

  signInEmail(input){
    input.preventDefault();
    console.log("here!!");
    let worked = false;
    firebase.auth().signInWithEmailAndPassword(this.refs.email.value,this.refs.pass.value).then((res)=>{
      this.setState({
      signedIn: true,
      drawing: 3
    });
    }).catch(e => {this.setState({
      signedIn: false,
      drawing: 3
    }); console.log(e); alert("Wrong email/password!");});
    this.setState({
      email: this.refs.email.value,
      pass: this.refs.pass.value,
      drawing: 4
    });
  }

  listenData(){
    let answersData = database.ref('answers');

    answersData.on('value',(dat)=>{
      let answersArr = [];
      var ans = dat.val();
      var key = Object.keys(ans);
      for(var i = 0; i < key.length; i++){
        answersArr[i] = ans[key[i]];
      }
      this.handleAverage(answersArr);
    });
  }

  clicked4(){
    this.setState({
      drawing: 3
    });
  }

  backToStart(){
    firebase.auth().signOut();
    this.setState({
      drawing: 0,
      signedIn: false,
      email: "",
      pass: ""
    });
  }

  handleAverage(answersArr){
    let totalPeople = answersArr.length;
    let totalAnswers = 0;

    let totalAnswersArr = [0,0,0,0];

    //Id:, Id
    for(var i = 0; i < answersArr.length; i++){
      var keys = Object.keys(answersArr[i]);
      //1:, 2:
      for(var g = 0; g < keys.length; g++){
        var keys2 = Object.keys(answersArr[i][keys[g]]);
        //[answers]
        totalAnswersArr[g]+=answersArr[i][keys[g]].length;
        for(var q = 0; q < keys2.length; q++){
          if(answersArr[i][keys[g]][keys2[q]] !== undefined && answersArr[i][keys[g]][keys2[q]] !== "empty"){
             totalAnswers++;
           }
        }
      }
    }
    this.setState({
      averageTotal: totalAnswers/totalPeople,
      average1: totalAnswersArr[0]/totalPeople,
      average2: totalAnswersArr[1]/totalPeople,
      average3: totalAnswersArr[2]/totalPeople,
      average4: totalAnswersArr[3]/totalPeople
    });
  }

  render() {
    let startUp = (
      <div className="App">
        <div className="container-fluid add">
          <div className="jumbotron">
            <h1>Welcome!</h1>
            <h5>This is Perdue's Creativity Test! It works likes this: You have 2 minutes to come up with as many possible uses as you can for an Abstract Object. It will cycle through 4 different objects then it'll tell you your percentile against those who also took it!</h5>
            <button type="button" className="btn btn-warning" onClick={this.clicked2.bind(this)}>Click to begin</button>
            <span></span>

          </div>
        </div>
      </div>
    );

    //<button type="button" className="btn btn-primary" onClick={this.clicked4.bind(this)}>Teacher tools</button>

    let answersArray = this.state.answers[Object.keys(this.state.answers)[this.state.answerIndex]];

    const listItems = answersArray.map((answer,i) => {
      if(answer !== "empty") return(<li>{answer}</li>);
    });

    let questionArray = this.props.questions;
    let question2Array = this.props.questions2;
    let allAnswers = [];

    let questionImgs = question2Array.map((q,i) => {
      return(
        <div className="col">
          {q}
        </div>
      );
    });

    for(var i = 0; i < questionArray.length; i++){
      allAnswers[i] = this.state.answers[Object.keys(this.state.answers)[i]].map((answer) => {
        if(answer !== "empty") return(<li>{answer}</li>);
      });
    }

    let drawAns1 = allAnswers.map((answer,i) => {
      if(i<=4)return(
        <div className="col">
          <ul>
            {answer}
          </ul>
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
      <form onSubmit={this.handleAnswer.bind(this)} autoComplete="off">
      <h2>What are the possible uses for this object?</h2>
      <br/>
      <div className="row">
        <div className="col-sm">
        <label htmlFor="examples">{this.props.questions[this.state.answerIndex]}</label>
          <input ref="example" type="text" id="examples" className="form-control" onSubmit={this.handleAnswer.bind(this)}/>
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  );

  let signIn = (
    <form onSubmit={this.signInEmail.bind(this)}>
        <div className="row">
          <label htmlFor="email">Email address: </label>
            <input ref="email" type="email" id="email" className="form-control" onSubmit={this.signInEmail.bind(this)}/>
        </div>
        <div className="row">
          <label htmlFor="pass">Password: </label>
            <input ref="pass" type="password" id="pass" className="form-control" onSubmit={this.signInEmail.bind(this)}/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );

  let teacherTools = (
    <div className="App">
      <div className="container-fluid add">
        <div className="jumbotron">
        <button type="button" className="btn btn-primary" onClick={this.backToStart.bind(this)}>Back</button>
          <div className="container">
          {this.state.signedIn ? <Answers email={this.state.email} pass={this.state.pass}/> : signIn }
          </div>
        </div>
      </div>
    </div>
  );

    let ending = (
      <div className="App">
        <div className="container-fluid add">
          <div className="jumbotron">
            <div className="container">
              <h1>Your guesses!</h1>
              <div className="row">
                {questionImgs}
              </div>
                <div className="row">
                  {drawAns1}
                </div>
              </div>
          </div>
        </div>
        <div className="container-fluid add">
          <div className="jumbotron">
            <div className="container">
            <h3>The average total answers for people was {Math.round(this.state.averageTotal)}. You had {answerNum} total answers!</h3>
            <br/>
              <div className="row">
                <div className="col">
                  <p>Most people had {Math.round(this.state.average1)} answers for Question 1</p>
                </div>
                <div className="col">
                  <p>Most people had {Math.round(this.state.average2)} answers for Question 2</p>
                </div>
                <div className="col">
                  <p>Most people had {Math.round(this.state.average3)} answers for Question 3</p>
                </div>
                <div className="col">
                  <p>Most people had {Math.round(this.state.average4)} answers for Question 4</p>
                </div>
              </div>
            </div>
              <button type="button" className="btn btn-primary" onClick={this.toXamplr.bind(this)}>Back to Xamplr</button>
          </div>
        </div>
      </div>
    );

    let listStyle = {
      width: "100"
    };

    let loading = (
      <div className="App">
        <div className="container-fluid add">
          <div className="jumbotron">
              <img src={require('./loading.gif')}/>
          </div>
        </div>
      </div>
    );
    let started = (
      <div className="App">
      {this.state.clicked ? <Timer minutes={this.state.minutes} seconds={this.state.seconds} startMinutes="2" milliseconds={this.state.milliseconds}/> : <span></span>}
        <div className="container-fluid add">
        <div className="jumbotron">
          <p></p>
            <p></p>
            <button type="button" className="btn btn-primary" onClick={this.skipMinute.bind(this)}>Skip</button>
            <br/>
            <div className="container">
              {this.state.clicked ? form : <span></span>}
            </div>
            <br/>
            <div className="container" style={listStyle}>
              {listItems}
              </div>
            </div>
          </div>
      </div>
    );
    if(this.state.drawing === 0) return startUp;
    else if(this.state.drawing === 1) return started;
    else if(this.state.drawing === 2) return ending;
    else if(this.state.drawing === 3) return teacherTools;
    else if(this.state.drawing === 4) return loading;
    else return(<div>Error!</div>);
  }

}

export default App;

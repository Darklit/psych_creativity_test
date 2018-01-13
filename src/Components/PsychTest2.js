import React, { Component } from 'react';
import * as firebase from 'firebase';
import config from '../config.js';
import '../App.css';
import Timer from './timer.js';

class PsychTest2 extends Component {
  constructor(props){
    super();

    this.state = {
      seconds: 5,
      milliseconds: 0,
      stage2: false,
      stage3: false,
      stage1: true,
      answerCirs: {},
      ending: false,
      correctAll: [],
      userClick: 0,
      fillAmount: []
    };

    this.beginTest = this.beginTest.bind(this);
    this.sendAnswers = this.sendAnswers.bind(this);
    this.getAnswers = this.getAnswers.bind(this);
  }

  beginTest(){
    var test = [];
    let test2 = [];
    var col = 4;
    var row = 4;
    var filledCircles = 0;
    let tempUser = [];
    let presetNums = [
      [0,4,13,20,23], //25
      [4,8,12,21,25,32], //36
      [2,10,19,20,29,40,48], //49
      [0,12,16,23,27,33,44,60], //64
      [3,7,18,24,35,50,67,72,79] //81
    ];
    for(var i = 0; i < 5; i++){
      test[i] = [];
      test2[i] = [];
      col++;
      row++;
      filledCircles = 0;
      let curCol = 0;
      let curRow = 0;
      for(let g = 0; g < col*row; g++){
        let tri = 0;
        for(let q = 0; q < presetNums[i].length; q++){
          if(g == presetNums[i][q]){
            test[i][g] = {
              fill: true,
              col: curCol,
              row: curRow,
              maxCol: col,
              maxRow: row,
              clicked: false
            };
            test2[i][g] = {
              fill: true,
              col: curCol,
              row: curRow,
              maxCol: col,
              maxRow: row,
              clicked: false
            };
            filledCircles++;
          }else tri++;
        }
        if(tri == presetNums[i].length){
          test[i][g] = {
            fill: false,
            col: curCol,
            row: curRow,
            maxCol: col,
            maxRow: row,
            clicked: false
          };
          test2[i][g] = {
            fill: false,
            col: curCol,
            row: curRow,
            maxCol: col,
            maxRow: row,
            clicked: false
          };
        }
        if(curRow==row-1){
          curCol++;
          curRow = 0;
        }else curRow++;
      }
      tempUser[i] = filledCircles;
    }

    //REMEMBER testCirs is array of circle objects, fillAmount is amount of filledCircles
    /*
    test2[i][g] = {
      fill: filled,
      col: curCol,
      row: curRow,
      maxCol: col,
      maxRow: row,
      clicked: false
    };
    */
    console.log(test);
    this.setState({
      testCirs: test,
      answerCirs: test2,
      currentQuestion: 0,
      fillAmount: tempUser
    });
    this.handleTime();
  }

  handleTime(){
    let timer = setInterval(()=>{
      this.setState({
        milliseconds: this.state.milliseconds-1000
      });
      if(this.state.milliseconds<=0){
        this.setState({
          seconds: this.state.seconds-1,
          milliseconds: 1000
        });
      }
      if(this.state.seconds<0){
        clearInterval(timer);
        let blankCir = this.state.answerCirs;
        for(let i = 0; i < blankCir[this.state.currentQuestion].length; i++){
          blankCir[this.state.currentQuestion][i].fill = false;
        }
        this.setState({
          seconds: 5,
          milliseconds: 0,
          stage2: true,
          answerCirs: blankCir
        });
        console.log(this.state.testCirs);
      }
    },1000);
  }

  handleClick(id){
    let num = id.target.id;
    let cir = this.state.answerCirs;
    let currentFill = 0;
    for(let i = 0; i < cir[this.state.currentQuestion].length; i++){
      if(cir[this.state.currentQuestion][i].fill) currentFill++;
    }
    if(!cir[this.state.currentQuestion][num].fill && currentFill+1 <= this.state.fillAmount[this.state.currentQuestion]){
      cir[this.state.currentQuestion][num].fill = true;
    }else if(currentFill+1 > this.state.fillAmount[this.state.currentQuestion] && !cir[this.state.currentQuestion][num].fill){
      alert(`There are only ${this.state.fillAmount[this.state.currentQuestion]} circles on the grid!`);
    }else if(cir[this.state.currentQuestion][num].fill){
      cir[this.state.currentQuestion][num].fill = false;
    }
    if(cir[this.state.currentQuestion][num].fill) cir[this.state.currentQuestion][num].clicked = true;
    else cir[this.state.currentQuestion][num].clicked = false;
    this.setState({
      answerCirs: cir
    });
  }

  submitAnswers(){
    let total = this.state.testCirs[this.state.currentQuestion].length;
    let correct = 0;
    let wrong = 0;
    let missed = 0;
    console.log(this.state.answerCirs);
    let cirs = this.state.testCirs;
    let totalFilled = 0;
    for(var i = 0; i < total; i++){
      if(this.state.testCirs[this.state.currentQuestion][i].fill) totalFilled++;
    }
    console.log(`Total filled is ${totalFilled}`);
    for(var i = 0; i < total; i++){
      if(this.state.answerCirs[this.state.currentQuestion][i].fill && this.state.testCirs[this.state.currentQuestion][i].fill){
        correct++;
      }else if(this.state.answerCirs[this.state.currentQuestion][i].fill){ wrong++;
      }else if(this.state.testCirs[this.state.currentQuestion][i].fill){ missed++;
      } else {
        console.log(`fill: ${this.state.answerCirs[this.state.currentQuestion][i]} testcirs: ${this.state.testCirs[this.state.currentQuestion][i]}`);
      }
    }
    let c = this.state.correctAll;
    c[this.state.currentQuestion] = Math.round((correct/totalFilled)*100);
    console.log(c[this.state.currentQuestion]);
    this.setState({
      correctPercentage: (correct/totalFilled),
      stage3: true,
      stage2: false,
      missed: missed,
      wrong: wrong,
      correctAll: c
    });
  }

  nextQuestion(){
    if(this.state.currentQuestion+1 < 5){
      this.setState({
        currentQuestion: this.state.currentQuestion+1,
        stage3: false
      });
      this.handleTime();
    }else{
      this.sendAnswers();
      this.setState({
        ending: true
      });
    }
  }

  nextScreen(){
    this.setState({
      stage1: false
    });
    this.beginTest();
  }

  sendAnswers(){
    firebase.auth().signInAnonymously().catch(function(err){
      console.log(err.message);
    });
   firebase.database().ref('memoryAnswers').push(this.state.correctAll);
   this.getAnswers();
  }

  getAnswers(){
    const answerRef = firebase.database().ref('memoryAnswers');
    answerRef.on('value',(snap) => {
      this.setState({
        dataAnswers: snap.val()
      });
    });
  }

  toXamplr(){
    window.location.href = 'http://www.xamplr.com';
  }

  render(){

    let col = [];
    let row = [];
    let col2 = [];
    let row2 = [];
    if(this.state !== null && this.state.testCirs !== undefined){
      let arrayNum = 0;
      for(let i = 0; i < this.state.testCirs[this.state.currentQuestion][0].maxCol; i++){
        for(let g = 0; g < this.state.testCirs[this.state.currentQuestion][0].maxRow; g++){
          let filledCircle = (
              <svg width="30" height="30">
                <circle cx="15" cy="15" r="15" fill="black" stroke="black"/>
              </svg>
          );
          let blankCircle = (
              <svg width="30" height="30">
                <circle cx="15" cy="15" r="15" fill="white" stroke="black"/>
              </svg>
          );
          let blankClick = (
              <svg width="30" height="30">
                <circle id={arrayNum} cx="15" cy="15" r="15" fill="white" stroke="black" onClick={this.handleClick.bind(this)}/>
              </svg>
          );

          let filledClick = (
              <svg width="30" height="30">
                <circle id={arrayNum} cx="15" cy="15" r="15" fill="black" stroke="black" onClick={this.handleClick.bind(this)}/>
              </svg>
          );

          let rightClick = (
            <svg width="30" height="30">
              <circle cx="15" cy="15" r="15" fill="red" stroke="black"/>
            </svg>
          );

          if(!this.state.stage2 && !this.state.stage3){
            row.push(
              <td>
              {this.state.testCirs[this.state.currentQuestion][arrayNum].fill ? filledCircle : blankCircle}
              </td>
            );
          }else if(this.state.stage2){
            console.log("Stage 2!");
            row.push(
              <td>
                {this.state.answerCirs[this.state.currentQuestion][arrayNum].fill ? filledClick : blankClick}
              </td>
            );
          }else if(this.state.stage3){
            console.log("stage 3");
            let circle;
            if(this.state.testCirs[this.state.currentQuestion][arrayNum].clicked) circle = rightClick;
            else circle=filledCircle;
            row.push(
              <td>
                {this.state.testCirs[this.state.currentQuestion][arrayNum].fill ? circle : blankCircle}
              </td>
            );
            row2.push(
              <td>
                {this.state.answerCirs[this.state.currentQuestion][arrayNum].fill ? filledCircle : blankCircle}
              </td>
            );
          }
          arrayNum++;
        }
        col.push(<tr>{row}</tr>);
        col2.push(<tr>{row2}</tr>);
        row = [];
        row2 = [];
      }
    }

    let title = (
      <div className="App">
        <div className="container-fluid add">
          <div className="jumbotron">
            <h2>Eidetic Memory Test</h2>
            <h5>Welcome to the Eidetic Memory Test! This is made to test how well your Eidetic Memory (also known as Photographic Memory) is. It works like this: You will see a grid of circles and your goal is to remember where they are on the grid and then select them on the blank grid.</h5>
            <button type="button" className="btn btn-warning" onClick={this.nextScreen.bind(this)}>Begin</button>
          </div>
        </div>
      </div>
    );

    let review = (
      <div className="App">
        <div className="container-fluid add">
          <div className="jumbotron">
            <h2>Here are the correct answers.</h2>
              <div className="container whatever">
                <table className="whatever">
                  <tbody>
                    {col}
                  </tbody>
                </table>
              </div>
              <h3>{`You got ${Math.round(this.state.correctPercentage*100)}% of the circles correct!`}</h3>
              <h5>{`${this.state.wrong} of the circle(s) you clicked were wrong!`}</h5>
              <h5>{`You missed ${this.state.missed} circle(s)!`}</h5>
              <button type="button" className="btn btn-primary" onClick={this.nextQuestion.bind(this)}>Continue</button>
          </div>
          <div className="jumbotron">
            <h2>Your answers.</h2>
            <div className="container whatever">
              <table className="whatever">
                <tbody>
                  {col2}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );


    let yourAnswers = this.state.correctAll.map((val,index) => {
      return(
        <div className="col-sm"><h5>{`You got ${val}% of the circles correct for question ${index+1}`}</h5></div>
      );
    });

    let allAnswers;
    if(this.state.dataAnswers !== undefined){
      console.log('dataAnswers');
      let total = [0,0,0,0,0];
      let keys = Object.keys(this.state.dataAnswers);
      for(let i = 0; i < Object.keys(this.state.dataAnswers).length; i++){
        for(let g = 0; g < this.state.dataAnswers[`${Object.keys(this.state.dataAnswers)[i]}`].length; g++){
          console.log(this.state.dataAnswers[`${keys[i]}`]);
          console.log(this.state.dataAnswers[`${keys[i]}`][g]);
          total[g]+=this.state.dataAnswers[`${keys[i]}`][g];
        }
      }
      console.log(Object.keys(this.state.dataAnswers).length);
      let length = Object.keys(this.state.dataAnswers).length;
      allAnswers = total.map((val,index)=>{
        console.log(`Val: ${val}`);
        return(
          <div className="col-sm"><h5>{`People got an average of ${Math.round(val/length)}% correct for question ${index+1}`}</h5></div>
        );
      });
    }

    let end = (
      <div className="App">
        <div className="container-fluid add">
          <div className="jumbotron">
            <h3>Here are your scores compared to others!</h3>
            <div className="container">
              <div className="row">
                {yourAnswers}
              </div>
              <hr />
              <div className="row">
                {allAnswers}
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={this.toXamplr.bind(this)}>Back to Xamplr</button>
          </div>
        </div>
      </div>
    );

    if(this.state.stage1){
      return title;
    }
    else if(!this.state.stage3){
      return(
        <div className="App">
          <div className="container-fluid add">
            <div className="jumbotron">
              {this.state.stage2 ? <h2 className="noSelect">Click all the circles you remember being filled</h2> : <h2 className="noSelect">Try to remember this image</h2>}
              <div className="container whatever">
                <table className="whatever">
                  <tbody>
                    {col}
                  </tbody>
                </table>
              </div>
              {this.state.stage2 ? <button type="button" className="btn btn-primary" onClick={this.submitAnswers.bind(this)}>Submit</button> : <h4>{`You have ${this.state.seconds} seconds remaining`}</h4>}
            </div>
          </div>
        </div>
      );
    }else if(this.state.ending){
      return end;
    }else{
      return review;
    }

  }
}

export default PsychTest2;

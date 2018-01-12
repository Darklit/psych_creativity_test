import React, {Component} from 'react';
import '../App.css';
import * as firebase from 'firebase';
import config from '../config.js';


class Answers extends Component {

  constructor(props){
    super(props);

    this.state = {
      answerList: <h1>Nothing!</h1>
    };

    this.removeTerm = this.removeTerm.bind(this);
  }

  componentDidMount(){
    let answersData = firebase.database().ref('answers');
    answersData.on('value',(dat)=>{
      let answersArr = [];
      var ans = dat.val();
      var key = Object.keys(ans);
      let allAnswers = [];
      for(var i = 0; i < key.length; i++){
        answersArr[i] = ans[key[i]];
        for(var g = 0; g < ans[key[i]].length; g++){
          if(ans[key[i]][g] !== undefined){
            for(var q = 0; q < ans[key[i]][g].length; q++){
              allAnswers[allAnswers.length] = ans[key[i]][g][q];
            }
          }
        }
      }
        let answerList;
        answerList = allAnswers.map((value,i)=>{
          return(
            <button type="button" className="list-group-item list-group-item-action" value={value} onClick={this.removeTerm.bind(this)}>{value}</button>
          );
        });
        this.setState({
          answerList: answerList
        });
      });
    }

    removeTerm(d){
      let term = d.target.value;
      let answersData = firebase.database().ref('answers');
      answersData.once('value').then(function(dat){
        //Data IDs
        let data = dat.val();
        let keys = Object.keys(data);
        for(var i = 0; i < keys.length; i++){
          //Cycle through ids
          let dataObject = data[keys[i]];
          let keys2 = Object.keys(data[keys[i]]);
          for(var g = 0; g < keys2.length; g++){
            //Cycle through 1,2,3,4
            if(dataObject[keys2[g]] != null){
              let dataArray = dataObject[keys2[g]];
              for(var q = 0; q < dataArray.length; q++){
                //Cycle through answers
                if(dataArray[q] == term){
                  let ans = dataObject;
                  let allAns = dataArray;
                  let newArr = [];
                  for(var l = 0; l < allAns.length; l++){
                    if(allAns[l]!==term) newArr[newArr.length] = allAns[l];
                    else console.log(keys[i]);
                  }

                  ans[keys2[g]]= newArr;
                  let answersDat = firebase.database().ref(`answers/${keys[i]}`);
                  answersDat.set(ans);
                  let deletedWords = firebase.database().ref('deleted');
                  deletedWords.push(term);
                }
              }
            }
          }
        }
      });
    }

  render(){
    return(
      <div className="list-group">
        {this.state.answerList}
      </div>
    );
  }
}

export default Answers;

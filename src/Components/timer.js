import React, {Component} from 'react';
import '../App.css';

class Timer extends Component {
    render(){
      console.log("more than you can ever know");
      let totalTime = 60*this.props.startMinutes;
      let sec = this.props.seconds;
      let min = this.props.minutes;
      if(sec<0) sec = 0;
      if(min<0) min = 0;
      let currentTime = (min*60)+sec;
      let w = window.innerWidth;
      let d = document.documentElement.clientWidth;
      let translate = "translate(" + -(d/6) + " 0)";
      const rectStyle = {
        fill: "00F"
      };
      return(
        <svg width={d} height="40" viewbox="0 0 {d} 40">
          <rect width={(currentTime/totalTime)*(d)} height="40" style={rectStyle}/>
        </svg>
      );
    }
}

export default Timer;

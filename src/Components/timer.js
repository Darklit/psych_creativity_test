import React, {Component} from 'react';
import '../App.css';

class Timer extends Component {
    render(){
      let totalTime = 60*this.props.startMinutes;
      let sec = this.props.seconds;
      let min = this.props.minutes;
      if(sec<0) sec = 0;
      if(min<0) min = 0;
      let currentTime = (min*60)+sec;
      let d = document.documentElement.clientWidth;
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

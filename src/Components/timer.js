import React, {Component} from 'react';
import '../App.css';

class Timer extends Component {
    render(){
      let totalTime = 60*this.props.startMinutes;
      totalTime*=1000;
      let sec = this.props.seconds;
      let min = this.props.minutes;
      let milli = this.props.milliseconds;
      if(sec<0) sec = 0;
      if(min<0) min = 0;
      if(milli<0)milli = 0;
      let currentTime = (min*60)+sec;
      currentTime*=1000;
      currentTime+=(milli);
      let d = document.documentElement.clientWidth;
      const rectStyle = {
        fill: "#353535"
      };
      return(
        <svg width={d} height="40">
          <rect width={(currentTime/totalTime)*(d)} height="40" style={rectStyle}/>
        </svg>
      );
    }
}

export default Timer;

import React, { Component,Ref } from 'react';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier, NodeRef } from './lib/utils';
import { EventEmitter } from './lib/event';
import { last } from 'rxjs/operators';

export class Marble extends Component{
  @EventEmitter( ) timelineClick;
  eventStreamInput;
  time;
  value;
  constructor(props){
    super(props);
    this.time=props.time;
    this.value=props.value;
  }
  render(){
    return <g transform={ `translate(${this.props['pos-x']},30)` }>
      <circle r="10" style={{ fill:this.props['svg-color'] }}/>
      <text text-anchor="middle" y="5">{this.props.children}</text>
    </g>
  }
}

export class SvgTimeline extends Component{
  @EventEmitter( )
  timelineClick;
  eventStreamInput;
  
  state={
    buffer:[],
    interval:{minT:-1,maxT:1,deltaT:1} 
  }
  constructor(props){
    super(props);
    this.eventStreamInput = this.props["event-stream"].subscribe( this.bufferInputValue.bind(this) );
  }
  bufferInputValue(v){
    const __bufLength = this.props['buffer-length'];
    let __buffer=this.state.buffer;
    __buffer.push(v);
    if(__buffer.length > __bufLength ){
      __buffer=__buffer.slice(-__bufLength);
    }
    const __interval = {
      minT : __buffer[0].time,
      maxT : __buffer[__buffer.length-1].time,
      deltaT : __buffer[__buffer.length-1].time-__buffer[0].time
    };
    this.setState({...this.state,buffer:__buffer,interval:__interval});
  }
  componentWillUnmount(){
     this.eventStreamInput.unsubscribe();
  }

  render(){
    console.log(this.state);
    return <svg width="300" height="60" style={{width: "300px", height: "60px", overflow: "visible", display: 'block', marginLeft:'30px' }} viewBox="0 0 300 60">
      <line x1="0" y1="30" x2="300" y2="30" style={{stroke:'rgb(255,0,0)',strokeWidth:2}}></line>
      { this.state.buffer.map( it => <Marble svg-color={it.color} pos-x={ (it.time - this.state.interval.minT)/20}>{it.value}</Marble>) }
    </svg>
  }
}
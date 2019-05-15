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
    return <g transform={ `translate(0,${this.props['pos-x']})` }>
      <circle r="3" style={{ fill:this.props['color'] }}/>
      <text text-anchor="middle" y="1.5"/>
    </g>
  }
}

export class SvgTimeline extends Component{
  @EventEmitter( )
  timelineClick;
  eventStreamInput;
  _buffer=[];
  constructor(props){
    super(props);
    eventStreamInput = this.props["event-stream"].subscribe( this.bufferInputValue )
  }

  bufferInputValue(v){
    this._buffer.push(v);
    if(this._buffer.length > 5 ){
      this._buffer=this._buffer.slice(1);
    }
  }

  render(){
    const interval= this._buffer.reduce(function(a,v){
      if(v.time<a.minT){
        a.minT=v.time;
      }else if(v.time>a.maxT){
        a.maxT=v.time;
      }
      return a;
    },{
      minT:Number.MAX_VALUE,maxT:Number.MIN_VALUE
    });
    const translate;
    return <svg>
      { this._buffer.items.map( it => <Marble pos-t=""></Marble>) }
    </svg>
  }
}
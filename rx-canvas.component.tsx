
import React, { Component,createRef } from 'react';
import { EventPipeDirective,EventEmitter } from './lib/event';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier, NodeRef } from './lib/utils';
import { debounceTime,map,merge,mergeAll } from 'rxjs/operators';
import { Point,point } from '@flatten-js/core';

export class RXCanvas extends Component implements TaggedChildrenClassifier{
  canvasRef;
  divRef;
  divEvPipeRef;
  static eventMapper=ev => { return {
      type: ev.type,
      //target: ev,
      point: point(ev.clientX,ev.clientY)
    } }
  @EventEmitter( map(RXCanvas.eventMapper) ) onKeyDown;
  @EventEmitter( map(RXCanvas.eventMapper) ) onKeyUp;
  @EventEmitter( map(RXCanvas.eventMapper) ) onMouseDown;
  @EventEmitter( map(RXCanvas.eventMapper) ) onDragOver;
  @EventEmitter( map(RXCanvas.eventMapper) ) ondrop;
  @EventEmitter( map(RXCanvas.eventMapper) ) onMouseMove;
  @EventEmitter( map(RXCanvas.eventMapper) ) onMouseUp;
  @EventEmitter( map(RXCanvas.eventMapper) ) onWheel;
  @EventEmitter( map(RXCanvas.eventMapper) ) staticEvent;

  @EventEmitter( mergeAll(
    this.onKeyDown,this.onKeyUp,this.onMouseDown,this.onDragOver,this.ondrop,this.onMouseMove,this.onMouseUp,this.onWheel
  ),map(RXCanvas.eventMapper),
    debounceTime(5) ) event;
    
  _subscriptions=[];
  canvasRenderer;
  canvasModel;
  constructor( props ){
    super( props );
    this.canvasRef = React.createRef();
    this.divRef = React.createRef();
    this.divEvPipeRef = React.createRef();
    
  }
  componentDidMount(){
    this.init();
  }
  componentWillUnmount(){
    this._subscriptions.forEach( s => s.unsubscribe() );
    this._subscriptions = [];
  }
  init(){
    console.log(this.canvasRef);
    console.log(this.divRef);
    console.log(this.divEvPipeRef);
    console.log(this.props);
    this._subscriptions.push(
      this.event.subscribe(this.props['on-inputEvent']),
    );
    if( !this.props['renderer-factory'] ){
      throw new Error("rx-canvas has no renderer assigned, use <rx-canvas renderer-factory={rendererFactory}");
    }else{
      this.canvasRenderer=this.props['renderer-factory'](this.canvasRef.current.getContext('2d'));
    }
    if( !this.props['canvas-model'] ){
      throw new Error("rx-canvas has no model assigned, use <rx-canvas canvas-model={canvasModel}");
    }else{
      this.canvasModel=this.props['canvas-model'];
    }
  }
  classify(){
    return this.props.children.length?classifyItems(this.props.children,[EventPipeDirective]):{"default":[],"EventPipeDirective":[]}
  }
  render(){
    const items=this.classify();
    return <div ref={this.divRef}
        className="rx-canvas"
        { ... this.props}>
      <div ref={this.divEvPipeRef}>{items['EventPipeDirective']}</div>
      <canvas ref={this.canvasRef}
        droppable={true} 
        onKeyDown={ this.onKeyDown.notify.bind(this.onKeyDown) }
        onKeyUp={ this.onKeyUp.notify.bind(this.onKeyUp) }
        onMouseDown={ this.onMouseDown.notify.bind(this.onMouseDown) }
        onDragOver={ this.onDragOver.notify.bind(this.onDragOver) }
        ondrop={ this.ondrop.notify.bind(this.ondrop) }
        onMouseMove={ this.onMouseMove.notify.bind(this.onMouseMove) }
        onMouseUp={ this.onMouseUp.notify.bind(this.onMouseUp) }
        onWheel={ this.onWheel.notify.bind(this.onWheel) }
        width={this.props['width']||768}
        height={this.props['height']||384}></canvas>
    </div>;
  }
}
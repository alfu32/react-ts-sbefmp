
import React, { Component,createRef } from 'react';
import { EventPipeDirective,EventEmitter } from './lib/event';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier, NodeRef } from './lib/utils';
import { debounceTime,map } from 'rxjs/operators';

export class RXCanvas extends Component implements TaggedChildrenClassifier{
  canvasRef;
  divRef;
  divEvPipeRef;
  static eventMapper=ev => { return {
      type: ev.type,
      //target: ev,
      point:{ x:ev.clientX, y:ev.clientY }
    } }
  @EventEmitter( map(RXCanvas.eventMapper) ) staticEvent;
  @EventEmitter( map(RXCanvas.eventMapper) ) dynamicEvent;
  @EventEmitter( 
    map(RXCanvas.eventMapper),
    debounceTime(100),
    map( v => {
      return {...v,type:v.type+"-stopped",subtype:"dynamic"}
    }),
  ) dynamicEventStoppedEvents;
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
  handleStaticEvent(name){
    return ((event)=>{
      this.staticEvent.notify(event);
    }).bind(this)
  }
  handleDynamicEvent(name){
    return ((event)=>{
      this.dynamicEvent.notify(event);
      this.dynamicEventStoppedEvents.notify(event)
    }).bind(this)
  }
  init(){
    console.log(this.canvasRef);
    console.log(this.divRef);
    console.log(this.divEvPipeRef);
    console.log(this.props);
    this._subscriptions.push(
      this.staticEvent.subscribe(this.props['on-inputEvent']),
      this.dynamicEvent.subscribe(this.props['on-inputEvent']),
      this.dynamicEventStoppedEvents.subscribe(this.props['on-inputEvent']),
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
        onKeyDown={this.handleStaticEvent('keyDown')}
        onKeyUp={this.handleStaticEvent('keyUp')}
        onMouseDown={this.handleStaticEvent('mouseDown')}
        onDragOver={this.handleDynamicEvent('dragOver')}
        ondrop={this.handleStaticEvent('drop')}
        onMouseMove={this.handleDynamicEvent('mouseMove')}
        onMouseUp={this.handleStaticEvent('mouseUp')}
        onWheel={this.handleDynamicEvent('wheel')}
        width={this.props['width']||768}
        height={this.props['height']||384}></canvas>
    </div>;
  }
}
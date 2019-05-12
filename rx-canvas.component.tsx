
import React, { Component,createRef } from 'react';
import { EventPipeDirective,EventEmitter } from './lib/event';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier, NodeRef } from './lib/utils';
import { debounceTime,map } from 'rxjs/operators';

export class RXCanvas extends Component implements TaggedChildrenClassifier{
  canvasRef;
  divRef;
  divEvPipeRef;
  @EventEmitter(
    map( ev => { return {
      type: ev.type,
      //target: ev,
      point:{ x:ev.clientX, y:ev.clientY }
    } } ),
  ) inputEvent;
  _subscriptions=[];
  constructor( props ){
    super( props );
    this.canvasRef = React.createRef();
    this.divRef = React.createRef();
    this.divEvPipeRef = React.createRef();
  }
  componentDidMount(){
    console.log(this.canvasRef);
    console.log(this.divRef);
    console.log(this.divEvPipeRef);
    this._subscriptions.push(
      this.inputEvent.subscribe(this.props['on-inputEvent']),
    );
  }
  componentWillUnmount(){
    this._subscriptions.forEach( s => s.unsubscribe() );
    this._subscriptions = [];
  }
  handleEvent(name){
    return ((event)=>{
      this.inputEvent.notify(event);
    }).bind(this)
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
        onKeyDown={this.handleEvent('keyDown')}
        onKeyUp={this.handleEvent('keyUp')}
        onMouseDown={this.handleEvent('mouseDown')}
        onDragOver={this.handleEvent('dragOver')}
        ondrop={this.handleEvent('drop')}
        onMouseMove={this.handleEvent('mouseMove')}
        onMouseUp={this.handleEvent('mouseUp')}
        onWheel={this.handleEvent('wheel')}
        width={this.props['width']||768}
        height={this.props['height']||384}></canvas>
    </div>;
  }
}
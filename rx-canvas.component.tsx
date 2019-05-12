
import React, { Component,createRef } from 'react';
import { EventPipeDirective,EventEmitter } from './lib/event';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier, NodeRef } from './lib/utils';
import { debounceTime } from 'rxjs/operators';

export class RXCanvas extends Component implements TaggedChildrenClassifier{
  canvasRef;
  divRef;
  divEvPipeRef;
  @EventEmitter( debounceTime(1000) ) complexEvent;
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
  }
  handleEvent(name){
    return function(event){
      this.complexEvent.next(event);
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
        onKeyDown={this.handleEvent('keyDown')}
        onKeyUp={this.handleEvent('keyUp')}
        onMouseDown={this.handleEvent('mouseDown')}
        onMouseUp={this.handleEvent('mouseUp')}
        onWheel={this.handleEvent('wheel')}
        width={this.props['width']||768}
        height={this.props['height']||384}></canvas>
    </div>;
  }
}
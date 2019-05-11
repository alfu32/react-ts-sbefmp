
import React, { Component,createRef } from 'react';
import { EventPipeDirective } from './lib/event';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';

export class RXCanvas extends Component implements TaggedChildrenClassifier{
  constructor(props){
    super(props);

  }
  classify(){
    return this.props.children.length?classifyItems(this.props.children,[EventPipeDirective]):{"default":[],"EventPipeDirective":[]}
  }
  render(){
    const items=this.classify();
    return <div
        className="rx-canvas"
        { ... this.props}>
      <canvas 
        width={this.props['width']||768}
        height={this.props['height']||384}></canvas>
    </div>;
  }
}

import React, { Component,createRef } from 'react';
import { EventPipeDirective } from './lib/event';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';

export class RXCanvas extends Component implements TaggedChildrenClassifier{
  
  classify(){
    return classifyItems(this.props.children,[EventPipeDirective])
  }
  render(){
    const items=classify();
    return <canvas { ... this.props}
      width={this.props['width']||678}
      height={this.props['height']||384}
      className="rx-canvas"></canvas>;
  }
}
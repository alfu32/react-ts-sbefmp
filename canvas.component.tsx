
import React, { Component,createRef } from 'react';

import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';

export class ReactCanvas extends Component implements TaggedChildrenClassifier{
  
  classify(){
    return classifyItems(this.props.children,[EventPipeDirective])
  }
  render(){
    return <canvas { ... this.props}></canvas>
  }
}
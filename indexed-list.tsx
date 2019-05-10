import React, { Component,Ref } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { detectVisibleChildren, kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';
import { EventEmitter,SingleEventObservable, MulticastEventObservable } from './lib/event';
Number.prototype.sign=function(){
  return Math.abs(this)/(this||1);
}
export class IndexView extends ComponentWrapper{}
export class IndexViewTemplate extends ComponentWrapper{
}
export class ItemViewTemplate extends ComponentWrapper{}
export class IndexedList extends Component implements TaggedChildrenClassifier{
  container;
  @EventEmitter()
  childrenVisibility;
  setContainer = event => this.container=event.element
  state={
    index:[]
  }
  scrollContent(evt){
    const index = detectVisibleChildren(evt.target);
    
    // console.log(index);
    this.setState({...this.state, index });
    
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }
  classify(){
    return classifyItems(this.props.children,[IndexView])
  }
  render(){
    this.childrenVisibility.subscribe(this.props['on-childrenVisibilityChange']);
    const indexer=this.props['indexer'];
    const classification=this.classify();

    return <div className="indexed-list">
      <div className="indexes-view">
       {indexer(this.state.index)}
      </div>
      <div className="list-view" ref={this.container} style={{...this.props.style,overflowY:'scroll'}} onScroll={this.scrollContent.bind(this)}>
      {this.props.children}
      </div>
    </div>
  }
}
import React, { Component,Ref } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { detectVisibleChildren, kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';
import { EventEmitter,SingleEventObservable, MulticastEventObservable } from './lib/event';
import './tab-layout.scss';

let tm=0;
function buffer(fn,time=0){
  clearTimeout(tm);
  tm=setTimeout(fn,time);
}

export class IndexedListTitle extends ComponentWrapper{}
export class IndexedList extends Component implements TaggedChildrenClassifier{
  @EventEmitter() childrenVisibility;
  @EventEmitter() reachedBottom;
  @EventEmitter() reachedTop;
  @EventEmitter() viewsetChanged;

  state={
    index:[]
  }
  scrollContent(evt){
    const index = detectVisibleChildren(evt.target);
    this.childrenVisibility.notify({target:this,data:index});
    if( index[index.length-1] && index[index.length-1]>=(evt.target.children.length-2)){
      buffer(() => this.reachedBottom.notify({target:this,data:index}));
    }
    // console.log(index);
    this.setState({...this.state, index });
    
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }
  classify(){
    return classifyItems(this.props.children,[IndexedListTitle])
  }
  render(){
    this.childrenVisibility.subscribe(this.props['$$childrenVisibilityChange']);
    this.reachedBottom.subscribe(this.props['$$reachedBottom']);
    this.reachedTop.subscribe(this.props['$$reachedTop']);
    //console.log("indexed-list:rendering",this.props.children)
    const indexer=this.props['indexer'];
    const classification=this.classify();
    console.log(classification)

    return <div className="indexed-list">
      <div className="list-title">
       {classification['IndexedListTitle'][0].props.children('')}
      </div>
      <div className="list-statusbar">
       {indexer(this.state.index)}
      </div>
      <div className="list-view" onScroll={this.scrollContent.bind(this)}>
      {classification['default'][0]('')}
      </div>
    </div>
  }
}
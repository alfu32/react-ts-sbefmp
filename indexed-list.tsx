import React, { Component,Ref } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { detectVisibleChildren, kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';
import { EventEmitter,SingleEventObservable, MulticastEventObservable } from './lib/event';
Number.prototype.sign=function(){
  return Math.abs(this)/(this||1);
}
let tm=0;
function buffer(fn,time=0){
  clearTimeout(tm);
  tm=setTimeout(fn,time);
}
export class IndexView extends ComponentWrapper{}
export class IndexViewTemplate extends ComponentWrapper{
}
export class ItemViewTemplate extends ComponentWrapper{}
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
    return classifyItems(this.props.children(''),[IndexView])
  }
  render(){
    this.childrenVisibility.subscribe(this.props['on-childrenVisibilityChange']);
    this.reachedBottom.subscribe(this.props['on-reachedBottom']);
    this.reachedTop.subscribe(this.props['on-reachedTop']);
    //console.log("indexed-list:rendering",this.props.children)
    const indexer=this.props['indexer'];
    const classification=this.classify();

    return <div className="indexed-list">
      <div className="indexes-view">
       {indexer(this.state.index)}
      </div>
      <div className="list-view" onScroll={this.scrollContent.bind(this)}>
      {classification['default']}
      </div>
    </div>
  }
}
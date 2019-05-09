import React, { Component } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';
import { SingleEventObservable, MulticastEventObservable } from './lib/event';
Number.prototype.sign=function(){
  return Math.abs(this)/(this||1);
}
export class IndexView extends ComponentWrapper{}

export class IndexedList extends Component implements TaggedChildrenClassifier{
  state={
    index:[]
  }
  scrollContent(evt){
    const parentRect=evt.target.getBoundingClientRect();
    let i=0,child=null;
    // console.log(evt.target)
    const index = Array.prototype.slice.call(evt.target.children)
    .map( (n,i) => {
      const rect = n.getBoundingClientRect();
      return (
        ((rect.top-parentRect.top)<0 || (rect.bottom-parentRect.top)<0)
        || ((rect.top-parentRect.bottom)>0 || (rect.bottom-parentRect.bottom)>0)
      )?false:i
    })
    .filter( v => v )
    
    //console.log(index);
    this.setState({...this.state, index });
    
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }
  classify(){
    return classifyItems(this.props.children,[IndexView])
  }
  render(){
    const indexer=this.props['indexer'];
    const classification=this.classify();

    return <div className="indexed-list">
      <div className="indexes-view">
       {indexer(this.state.index)}
      </div>
      <div className="list-view" style={{...this.props.style,overflowY:'scroll'}} onScroll={this.scrollContent.bind(this)}>
      {classification['default']}
      </div>
    </div>
  }
}
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
  @EventEmitter() childrenVisibility;
  @EventEmitter() reachedBottom;
  @EventEmitter() reachedTop;
  state={
    index:[]
  }
  scrollContent(evt){
    const index = detectVisibleChildren(evt.target);
    this.childrenVisibility.notify({target:this,data:index});
    if( index[index.length-1] && index[index.length-1]>=0.9*evt.target.children.length ){
      this.reachedBottom.notify({target:this,data:index});
    }
    // console.log(index);
    this.setState({...this.state, index });
    
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }
  constructor(props,state){
    super(props,state);
    this.setState({...this.props});
  }
  classify(){
    return classifyItems(this.props.children,[IndexView])
  }
  componentDidMount() {
    setTimeout(() => console.log("componentDidMount", this.props,this.state),100);
    this.setState({...this.props});
  }
  static getDerivedStateFromProps(nextProps, prevState){
    setTimeout(() => console.log("component Will Receive Props", nextProps,prevState),100);
    if(nextProps.children!==prevState.children){
      return { ...prevState,children: nextProps.children};
    }
    else return null;
  }
  render(){
    this.childrenVisibility.subscribe(this.props['on-childrenVisibilityChange']);
    this.reachedBottom.subscribe(this.props['on-reachedBottom']);
    this.reachedTop.subscribe(this.props['on-reachedTop']);
    console.log("indexed-list:rendering",this.state.children.length)
    const indexer=this.props['indexer'];
    const classification=this.classify();

    return <div className="indexed-list">
      <div className="indexes-view" data-length={this.state['data-length']}>
       {indexer(this.state.index)}
      </div>
      <div className="list-view" style={{...this.state.style,overflowY:'scroll'}} onScroll={this.scrollContent.bind(this)}>
      {this.state.children}
      </div>
    </div>
  }
}
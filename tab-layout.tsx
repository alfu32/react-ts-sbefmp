import React, { Component } from 'react';
import { hydrate } from 'react-dom';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './lib/utils';
import { Observable } from 'rxjs';

export class TabTitle extends ComponentWrapper{}
export class Tab extends Component implements TaggedChildrenClassifier{
  id=guid(3,5);
  state={}
  selected(evt){
    console.log(this);
      this.props['selected'](this.id);
  }
  getContentView(){
      const classification = this.classify();
      return classification['default'];
  }
  classify(){
    return classifyItems(this.props.children,[TabTitle])
  }
  render(){
    const classification = this.classify();
    return <div className="tab-title" onClick={this.selected.bind(this)}>{classification['TabTitle']}</div>
  }
}

export class Tabs extends Component implements TaggedChildrenClassifier{
  eventStream = new Observable((observer) => {
    const id=guid(5,5);
    this.observers[id]=observer;
    return {unsubscribe : function(){}}
  });
  id=id();
  classification = this.classify();
  state={
    currentId:guid(3,3),
    currentTabIndex:0,
    currentTab:null
  }
  observers={};
  
  
  notify(event){
    Object.keys(this.observers).forEach( k => this.observers[k].next(event) )
    console.log("notify",event);
  }
  classify() {
    return classifyItems(this.props.children, [Tab] )['Tab']
      .reduce( (a,tab) => {
        const cls = classifyItems(tab.props.children, [TabTitle] );
        a['titles'].push(cls['TabTitle']);
        a['content'].push(cls['default']);
        return a;
      },{titles:[],content:[]});
  }
  createClickTabHandler(n){
    return ( (evt)=>{
      this.setState({ ...this.state, currentTabIndex:n });
      this.notify({emitter:this,state:n});
    }).bind(this);
  }
  render(){
    this.eventStream.subscribe(this.props['tab-click']);
    
    this.eventStream.subscribe(function(o){ console.log("sub",o)});
    return <div className="tabs-layout" >
      <div className="tabs-titles">
        {this.classification['titles'].map( (x,i) => <div className='tab-title' tab-selected={(this.state.currentTabIndex === i).toString()} onClick={this.createClickTabHandler(i)}>{(this.state.currentTabIndex == i)} {x}</div> ) }
      </div>
      <div className="tabs-contents">
        {this.classification['content'].map( (x,i) => <div className='tab-content' style={{display:(this.state.currentTabIndex === i)?'':'none'}}>{x}</div> ) }
      </div>
    </div>;
  }
}
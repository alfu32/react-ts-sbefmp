import React, { Component } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './lib/utils';

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
  
  state={
    currentId:guid(3,3)
  }
  currentTab=0;
  classify() {
    let tabs = classifyItems(this.props.children, [Tab] );
    tabs = tabs['Tab'].reduce( (a,tab) => {
      const cls = classifyItems(tab.props.children, [TabTitle] );
      a['titles'].push(cls['TabTitle'][0]);
      a['content'].push(cls['default'][0]);
      return a;
    },{titles:[],content:[]});
    console.log(tabs);
    return tabs;
    return this.props.children;
  }
  showTab(n){
    return ( (evt)=>{
      console.log(n,this,evt)
      this.currentTab=n;
      this.forceUpdate();
    }).bind(this)
  }
  getCurrentTab(){
    const classification = this.classify();
    console.log("currentTab",classification['content'][this.currentTab]);
    return classification['content'][this.currentTab];
  }
  render(){
    const classification = this.classify();
    console.log('render',classification);
    return <div className="tabs-layout" >
      <div className="tabs-titles">
        {classification['titles'].map( (x,i) => <div className='tab-title' tab-selected={this.currentTab == i} onClick={this.showTab(i)}>{x}</div> ) }
      </div>
      <div className="tabs-content">{this.getCurrentTab()}</div>
    </div>
  }
}
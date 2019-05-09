import React, { Component } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './lib/utils';

export class TabTitle extends ComponentWrapper{}
export class Tab extends Component implements TaggedChildrenClassifier{
  id=guid(3,5);
  state={}
  selected(evt){
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
  classify() {
    let tabs = classifyItems(this.props.children, [Tab] );
    tabs = tabs['Tab'].reduce( (a,tab) => {
      a.push(classifyItems(tab.props.children, [TabTitle] )['TabTitle'][0])
      return a;
    },[]);
    console.log(tabs);
    return tabs;
    return this.props.children;
  }
  switchTab(evt){
    //this.setState({...this.state,currenttab:e});
    console.log('toggleSidebar',this.state);
  }
  getCurrentTab(){
    return Array.prototype.slice.call(this.props.children)
      .filter( tab => tab.id===this.state.currentId )
  }
  render(){
    const classification = this.classify();
    console.log(classification);
    return <div className="tabs-layout" >
      <div className="tabs-titles"><div className='layout-button'></div>{classification['TabTitle']}</div>
      <div className="tabs-content">{this.getCurrentTab()}</div>
    </div>
  }
}
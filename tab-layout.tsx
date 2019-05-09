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
    const tabs = classifyItems(this.props.children, [Tab] )[ Tab.toString() ]
    tabs( tab => {

    })
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

    return <div className="tabs-layout" sidebar-collapsed={this.state.sidebar.toString()}>
      <div className="tabs-titles"><div className='layout-button' onClick={this.toggleSidebar.bind(this)}></div>{classification['AppTitle']}</div>
      <div className="tabs-content">{this.getCurrentTab()}</div>
    </div>
  }
}
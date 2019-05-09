import React, { Component } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './lib/utils';

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
  id=id();
  classification = this.classify();
  state={
    currentId:guid(3,3),
    currentTabIndex:0,
    currentTab:null
  }
  classify() {
    let tabs = classifyItems(this.props.children, [Tab] );
    tabs = tabs['Tab'].reduce( (a,tab) => {
      const cls = classifyItems(tab.props.children, [TabTitle] );
      a['titles'].push(cls['TabTitle'][0]);
      a['content'].push(cls['default']);
      return a;
    },{titles:[],content:[]});
    console.log(tabs);
    return tabs;
    return this.props.children;
  }
  componentDidMount(){
  }
  showTab(n){
    return ( (evt)=>{
      // console.log(n,this,evt)
      this.setState({ ...this.state,currentTabIndex:n, currentTab:this.classification['content'][n] });
      //this.forceUpdate();
    }).bind(this)
  }
  render(){
    // console.log('render',this.classification);
    console.log("render:TabHost",this.id);
    return <div className="tabs-layout" >
      <div className="tabs-titles">
        {this.classification['titles'].map( (x,i) => <div className='tab-title' tab-selected={(this.state.currentTabIndex === i).toString()} onClick={this.showTab(i)}>{x}</div> ) }
      </div>
      <div className="tabs-content">{this.state.currentTab}</div>
    </div>
  }
}
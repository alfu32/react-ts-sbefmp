import React, { Component } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './base.components';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from '../lib/utils';
import { EventEmitter } from '../lib/event';
import { debounceTime } from 'rxjs/operators';

export class AppTitle extends ComponentWrapper { }
export class AppSidebar extends ComponentWrapper { }
export class AppToolbar extends ComponentWrapper { }
export class AppContent extends ComponentWrapper { }
export class AppStatusbar extends ComponentWrapper { }

export class AppLayout extends Component implements TaggedChildrenClassifier {
  @EventEmitter( debounceTime(1000) ) sidebarEmitter;
  @EventEmitter( debounceTime(1000) ) shrinkEmitter;
  _subscriptions=[];
  state={
    sidebar:"true",
    color:true,
    scrolled:'inside',
    delta:0
  };
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this._subscriptions.push(
      this.sidebarEmitter.subscribe(this.props['on-SidebarToggle']),
      this.shrinkEmitter.subscribe(this.props['on-ShrinkChange']),
    );
  }
  componentWillUnmount(){
    this._subscriptions.forEach( s => s.unsubscribe() );
    this._subscriptions = [];
  }
  classify(){
    return classifyItems(this.props.children,[AppTitle, AppSidebar, AppToolbar, AppContent, AppStatusbar])
  }
  scrollContent(evt){
    const d=evt.target.getBoundingClientRect().top - evt.target.children[0].getBoundingClientRect().top;
    const newState=d<=0?'inside':'outside';
    if(newState!=this.state.scrolled){
      this.shrinkEmitter.notify({emitter:this,state:newState});
    }
    this.setState({...this.state, scrolled: newState,delta:d});
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }
  toggleSidebar(){
    this.setState({...this.state,sidebar:(!(this.state.sidebar==="true")).toString()});
    this.sidebarEmitter.notify({emitter:this,state:this.state.sidebar});
  }
  render(){
    const classification = this.classify();
    return <div className="app-layout" sidebar-collapsed={this.state.sidebar} content-scroll={this.state.scrolled}>
      <div className="app-title"><div className='layout-button' onClick={this.toggleSidebar.bind(this)}></div>{classification['AppTitle']}</div>
      <div className="app-sidebar">{classification['AppSidebar']}</div>
      <div className="app-toolbar">{classification['AppToolbar']}</div>
      <div className="app-content" onScroll={this.scrollContent.bind(this)}>{classification['AppContent']}</div>
      <div className="app-statusbar">{classification['AppStatusbar']}</div>
    </div>
  }
}
export default ({ name }) => <h1>Hello {name}!</h1>;
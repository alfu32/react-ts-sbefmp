import React, { Component } from 'react';
import { ComponentWrapper,MultislotTransclusionComponent } from './lib/base.components';
import { kebapCase, classifyItems, guid, id, TaggedChildrenClassifier } from './lib/utils';

export class AppTitle extends ComponentWrapper { }
export class AppSidebar extends ComponentWrapper { }
export class AppToolbar extends ComponentWrapper { }
export class AppContent extends ComponentWrapper { }
export class AppStatusbar extends ComponentWrapper { }

export class AppLayout extends Component implements TaggedChildrenClassifier {
    /** order counts */
  state={
    sidebar:"true",
    color:true,
    scrolled:'inside'
  };
  classify(){
    return classifyItems(this.props.children,[AppTitle, AppSidebar, AppToolbar, AppContent, AppStatusbar])
  }
  scrollContent(evt){
    const d=evt.target.getBoundingClientRect().top - evt.target.children[0].getBoundingClientRect().top;
    this.setState({...this.state, scrolled: d<0?'inside':'outside'});
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }
  toggleSidebar(){
    this.setState({...this.state,sidebar:(!(this.state.sidebar==="true")).toString()});
    console.log('toggleSidebar',this.state);
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

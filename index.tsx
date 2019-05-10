import React, { Component,createRef } from 'react';
import { render } from 'react-dom';
import {
  AppTitle,
  AppSidebar,
  AppToolbar,
  AppContent,
  AppStatusbar,
  AppLayout
} from './layout';
import {
  TabTitle,
  Tab,
  Tabs
} from './tab-layout';
import { IndexedList,IndexViewTemplate, ItemViewTemplate } from './indexed-list';
import { range } from './lib/utils';
import './index.scss';
import './layout.scss';
import './tab-layout.scss';

function genericDirective(component){
  console.log('generic directive',component,this)
}
class App extends Component {
  state = {
    name: 'React'
  };
  tabChangedReceiver(event){
    console.log("tabChangedReceiver:received",event);
  }
  shrinkChangedReceiver(event){
    console.log("shrinkChangedReceiver:received",event);
  }
  sidebarToggleReceiver(event){
    console.log("sidebarToggleReceiver:received",event);
  }
  listData=range(1000).map( i => `ListItem ${i}` );
  listIndexer(visibleIndices){
    /// console.log("visibleIndices",visibleIndices)
    const [min,max] = [(visibleIndices[0]||0),(visibleIndices[visibleIndices.length-1]||0)];
    return <div>First:{min} - Last:{max}</div>
  }
  onChildrenVisibilityChange(indices){
    console.log("onChildrenVisibilityChange:received",indices);
  }
  onReachedBottom(indices){
    console.log("onReachedBottom:received",indices);
  }
  render() {
    return (
      <AppLayout
        on-ShrinkChange={this.shrinkChangedReceiver}
        on-SidebarToggle={this.sidebarToggleReceiver}>
        <AppTitle>Title</AppTitle>
        <AppSidebar>Sidebar</AppSidebar>
        <AppToolbar>Toolbar</AppToolbar>
        <AppContent>
            <Tabs
              on-TabChange={this.tabChangedReceiver}>
              <Tab>
                <TabTitle>app layout 1</TabTitle>
                  <h1 {... genericDirective(this)}>It Works</h1>
                  <p>message</p>
                  <b>  tabs </b>
                  <b> one app layout inside another one's content</b>
                  <div style={{ position:"relative", minHeight:'440px',margin:'20px' }}>
                    <AppLayout>
                      <AppTitle>Layout 1</AppTitle>
                      <AppSidebar>Sidebar</AppSidebar>
                      <AppToolbar>Toolbar</AppToolbar>
                      <AppContent>
                          <p>message 1</p>
                          <IndexedList 
                            style={ {maxHeight:'200px'} }
                            indexer={this.listIndexer}
                            on-childrenVisibilityChange={this.onChildrenVisibilityChange}
                            on-reachedBottom={this.onReachedBottom}>
                          {this.listData.map(v => <div className="item">{v}</div>)}
                          </IndexedList>
                      </AppContent>
                    </AppLayout>
                  </div>
              </Tab>
              <Tab>
                <TabTitle>app layout 2</TabTitle>
                <div>
                  <b> another app layout inside another one's content</b>
                  <div style={{ position:"relative", minHeight:'440px',margin:'20px' }}>
                    <AppLayout>
                      <AppTitle>Layout 2</AppTitle>
                      <AppSidebar>Sidebar</AppSidebar>
                      <AppToolbar>Toolbar</AppToolbar>
                      <AppContent>
                          <p>message 2</p>
                          
                          <b> multiple nested layouts </b>
                          <div style={{ position:"relative", minHeight:'840px',margin:'20px' }}>
                            <AppLayout>
                              <AppTitle>subLayout 2.4</AppTitle>
                              <AppSidebar>Sidebar</AppSidebar>
                              <AppToolbar>Toolbar</AppToolbar>
                              <AppContent>
                                  <p>message 2.4</p>
                                  { range(100).map( (v,i) => <pre>Line {i}</pre> )}
                              </AppContent>
                            </AppLayout>
                          </div>
                      </AppContent>
                    </AppLayout>
                  </div>
                </div>
              </Tab>
              <Tab>
                <TabTitle>app layout 3</TabTitle>
                <div>
                  <b> a third app layout inside main app layout </b>
                  <div style={{ position:"relative", minHeight:'440px',margin:'20px' }}>
                    <AppLayout>
                      <AppTitle>Layout 2</AppTitle>
                      <AppSidebar>Sidebar</AppSidebar>
                      <AppToolbar>Toolbar</AppToolbar>
                      <AppContent>
                          <p>message 3</p>
                      </AppContent>
                      <AppStatusbar>
                        <em>status 3</em>
                      </AppStatusbar>
                    </AppLayout>
                  </div>
                </div>
              </Tab>
              <Tab>
                <TabTitle>more tabs </TabTitle>
                <Tabs>
                  { range(7).map( (v,i) => <Tab>
                    <TabTitle>sub tab 4.{i}</TabTitle>
                    <div>
                      content 4.{i}
                    </div>
                  </Tab>)}
                </Tabs>
              </Tab>
            </Tabs>
        </AppContent>
      </AppLayout>
    );
  }
}

render(<App />, document.getElementById('root'));

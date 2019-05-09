import React, { Component } from 'react';
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
import { range } from './lib/utils';
import './layout.scss';
import './tab-layout.scss';

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
  render() {
    return (
      <AppLayout>
        <AppTitle>Title</AppTitle>
        <AppSidebar>Sidebar</AppSidebar>
        <AppToolbar>Toolbar</AppToolbar>
        <AppContent>
            <Tabs 
              on-TabChange={this.tabChangedReceiver}
              on-ShrinkChange={this.shrinkChangedReceiver}>
              <Tab>
                <TabTitle>app layout 1</TabTitle>
                  <h1>It Works</h1>
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
                          { range(100).map( (v,i) => <pre>Line {i}</pre> )}
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

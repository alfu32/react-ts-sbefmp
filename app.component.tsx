
import React, { Component,createRef } from 'react';
import {
  AppTitle,
  AppSidebar,
  AppToolbar,
  AppContent,
  AppStatusbar,
  AppLayout
} from './app-layout.component';
import {
  TabTitle,
  Tab,
  Tabs
} from './tab-layout.component';
import { RXCanvas } from './rx-canvas.component';
import { Marble, SvgTimeline } from './svg-timeline';
import { IndexedList,IndexedListTitle,IndexedListStatus } from './indexed-list.component';
import { range } from './lib/utils';
import { EventPipeDirective } from './lib/event';
import { interval,Subject } from 'rxjs';

  function intervalSubject(t){
    let i = 0;
    let sub = new Subject();
    let _stop = false;
    fun();
    return {
      stop : function stop(){ _stop=true; },
      subscribe: sub.subscribe
    }
    function fun(){
      sub.next(this.i++);
      if(!this._stop){
        setTimeout(this.fun,t);
      }else{
        this.sub.complete;
      }
    }
  }
export class App extends Component {
  state = {
    listData:range(100).map( i => `ListItem ${i}` ),
    key: 1
  };
  canvasRendererFactory(context){
    return {
      _type:"CanvasRenderer",
      context: context
    }
  }
  interval = intervalSubject(1000);
  canvasModel={
    _type:"CanvasRenderer",
  }
  componentWillUnmount(){
    this.interval.stop();
  }
  tabChangedReceiver(event){
    console.log("tabChangedReceiver:received",event);
  }
  shrinkChangedReceiver(event){
    console.log("shrinkChangedReceiver:received",event);
  }
  sidebarToggleReceiver(event){
    console.log("sidebarToggleReceiver:received",event);
  }
  listIndexer(visibleIndices){
    /// console.log("visibleIndices",visibleIndices)
    const [min,max] = [(visibleIndices[0]||0),(visibleIndices[visibleIndices.length-1]||0)];
    return <div>First:{min} - Last:{max}</div>
  }
  onChildrenVisibilityChange(event){
    //console.log("onChildrenVisibilityChange:received",indices);
  }
  onReachedBottom(event){
    setTimeout( ()=>{
      let addRange = range(100).map(v => v + event.data[0]).map( i => `ListItem ${i}` );
      let newData=this.state.listData.concat(addRange);
      this.setState({ listData: newData,key:this.state.key+1 });
      //console.log(event);
      this.forceUpdate();
      event.target.forceUpdate();
      //Array.prototype.push.apply(this.listData,range(indices[indices.length+1],indices[indices.length+1]+100) )
    },1000)
  }
  onCanvasInputEvent(v){
    console.log("canvas input event",v)
  }
  render() {
    //setTimeout(()=>{this.setState({... this.state, listData: range(500).map( i => `ListItem ${i}` ) })},2000)
    //console.log("render:index");
    return (
      <AppLayout
        on-ShrinkChange={this.shrinkChangedReceiver}
        on-SidebarToggle={this.sidebarToggleReceiver}>
        <AppTitle>Title</AppTitle>
        <AppSidebar>
          <div>Sidebar</div>
          <SvgTimeline event-stream={this.interval}></SvgTimeline>
          <svg width="200" height="300" style={{width: "200px", height: "300px", overflow: "visible"}} viewBox="0 0 200 300">
          <g transform="translate(100, 100)">
            <circle r="10" />
            <circle cx="20" r="10" />
          </g>
          </svg>
          <div style={{ minHeight:'440px',margin:'20px' }}>
                  <p>list : { this.state.listData.length }</p>
                  <IndexedList
                    indexer={this.listIndexer}
                    $$childrenVisibilityChange={this.onChildrenVisibilityChange}
                    $$reachedBottom={this.onReachedBottom.bind(this)}
                    data-length={this.state.listData.length}>
                    <IndexedListTitle>{ (v) => <h4>My List : (length { this.state.listData.length })</h4> }</IndexedListTitle>
                    <IndexedListStatus>{this.listIndexer}</IndexedListStatus>
                    { () => this.state.listData.map( (v,i) => <div className="item">{v}</div>)}
                  </IndexedList>
                  <pre>{JSON.stringify(this.state.listData,null,"  ")}</pre>
          </div>
        </AppSidebar>
        <AppToolbar>Toolbar</AppToolbar>
        <AppContent>
            <Tabs
              on-TabChange={this.tabChangedReceiver}>
              <Tab>
                <TabTitle>rx-canvas</TabTitle>
                  <RXCanvas
                    on-inputEvent={this.onCanvasInputEvent}
                    renderer-factory={this.canvasRendererFactory}
                    canvas-model={this.canvasModel}><EventPipeDirective></EventPipeDirective></RXCanvas>
              </Tab>
              <Tab>
                <TabTitle>app layout 1</TabTitle>
                  <h1>It Works</h1>
                  <p>message</p>
                  <b>  canvas </b>
                  <RXCanvas
                    on-inputEvent={this.onCanvasInputEvent}
                    renderer-factory={this.canvasRendererFactory}
                    canvas-model={this.canvasModel}><EventPipeDirective></EventPipeDirective></RXCanvas>
              </Tab>
              <Tab>
                <TabTitle>app layout 2</TabTitle>
                <div>
                  <b> another app layout inside another one's content</b>
                  <div style={{ position:"relative", minHeight:'440px',margin:'20px' }}>
                    <AppLayout>
                      <AppTitle>Layout 2</AppTitle>
                      <AppSidebar>sb
                      </AppSidebar>
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

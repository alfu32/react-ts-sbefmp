import React, { Component,createRef } from 'react';
import {
  AppTitle,
  AppSidebar,
  AppToolbar,
  AppContent,
  AppStatusbar,
  AppLayout
} from '../components/app-layout.component';
import {
  TabTitle,
  Tab,
  Tabs
} from '../components/tab-layout.component';
import { RXCanvas } from '../components/rx-canvas.component';
import { Marble, SvgTimeline } from '../components/svg-timeline';
import { IndexedList,IndexedListTitle,IndexedListStatus } from '../components/indexed-list.component';
import { range } from '../lib/utils';
import { EventPipeDirective } from '../lib/event';
import Rx ,{ interval,Subject,forkJoin } from 'rxjs';
import RxOps,{ merge,zip } from 'rxjs/operators';
import './app.style.scss';


export function intervalSubject(t,color){
    let i = 0;
    let sub = new Subject();
    let _stop = false;
    fun();
    return {
      sub,
      stop : function stop(){ _stop=true; },
      subscribe: function(...args){ sub.subscribe(...args); }
    }
    function fun(){
      sub.next({time:new Date().getTime(),value:i++,color:color});
      if(!_stop){
        setTimeout(fun,t);
      }else{
        sub.complete();
      }
    }
  }
export class App extends Component {
  state = {
    listData:range(100).map( i => { return  { name: `ListItem ${i}`, type: 'string' } } ),
    key: 1
  };
  canvasRendererFactory(context){
    return {
      _type:"CanvasRenderer",
      context: context
    }
  }
  interval = intervalSubject(830,"#CC3333FF");
  interval1 = intervalSubject(1500,"#33CC33FF");
  interval2 = intervalSubject(2900,"#3333CCFF");
  zipped=new Subject().pipe(merge(
    this.interval.sub,this.interval1.sub,this.interval2.sub
  ));
  canvasModel={
    _type:"CanvasRenderer",
  }
  componentDidMount(){
    try{
      //console.log(RxOps);
      eval("console.warn(window['RXJS_MEMBERS']=Object.keys(rxjs_1))");
      eval("console.warn(window['RXJS_OPERATORS']=Object.keys(operators_1))");
    }catch(err){
      console.warn(err);
    }
    const _members=window['RXJS_MEMBERS'].map(v => {return { name:v, type:'rxjs' }} );
    const _operators = window['RXJS_OPERATORS'].map(v => {return { name:v, type:'operator' }} );
    console.error('RXJS_MEMBERS',window['RXJS_MEMBERS']);
    this.setState({ ...this.state, listData:_members.concat(_operators)})
    //
  }
  componentWillUnmount(){
    this.interval.stop();
    this.interval1.stop();
    this.interval2.stop();
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
    // {this.state.listData[visibleIndices[0]]['type']}
    return <div>ok</div>;
    console.log("visibleIndices",visibleIndices,this)
    const [min,max] = [(visibleIndices[0]||0),(visibleIndices[visibleIndices.length-1]||0)];
    return <div>First:{min} - Last:{max}</div>
  }
  onChildrenVisibilityChange(event){
    //console.log("onChildrenVisibilityChange:received",indices);
  }
  onReachedBottom(event){
    return;
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
    //return <div>coucou</div>
    //setTimeout(()=>{this.setState({... this.state, listData: range(500).map( i => `ListItem ${i}` ) })},2000)
    //console.log("render:index");
    return (
      <AppLayout
        on-ShrinkChange={this.shrinkChangedReceiver}
        on-SidebarToggle={this.sidebarToggleReceiver}>
        <AppTitle>Title</AppTitle>
        <AppSidebar>
          <div>Sidebar</div>
        </AppSidebar>
        <AppToolbar>Toolbar</AppToolbar>
        <AppContent>
            <Tabs
              on-TabChange={this.tabChangedReceiver}>
              <Tab>
                <TabTitle>dynamic rx marbles</TabTitle>
              <SvgTimeline event-stream={this.interval} timeframe-length="10000"></SvgTimeline>
              <SvgTimeline event-stream={this.interval1} timeframe-length="10000"></SvgTimeline>
              <SvgTimeline event-stream={this.interval2} timeframe-length="10000"></SvgTimeline>
              <SvgTimeline event-stream={this.zipped} timeframe-length="10000"></SvgTimeline>
              </Tab>
              <Tab>
                <TabTitle>rx-canvas</TabTitle>
                  <RXCanvas
                    on-inputEvent={this.onCanvasInputEvent}
                    renderer-factory={this.canvasRendererFactory}
                    canvas-model={this.canvasModel}><EventPipeDirective></EventPipeDirective></RXCanvas>
              </Tab>
              <Tab>
                <TabTitle>Indexed List</TabTitle>
                <div style={{ minHeight:'440px',margin:'20px' }}>
                        <p>list : { this.state.listData.length }</p>
                        <IndexedList
                          indexer={ this.listIndexer.bind(this) }
                          $$childrenVisibilityChange={this.onChildrenVisibilityChange}
                          $$reachedBottom={this.onReachedBottom.bind(this)}
                          data-length={this.state.listData.length}>
                          <IndexedListTitle>{ (v) => <h4>My List : (length { this.state.listData.length })</h4> }</IndexedListTitle>
                          <IndexedListStatus>{this.listIndexer}</IndexedListStatus>
                          { () => this.state.listData.map( (v,i) => <div className="item">{v}</div>)}
                        </IndexedList>
                        <pre>{JSON.stringify(this.state.listData,null,"  ")}</pre>
                </div>
              </Tab>
            </Tabs>
        </AppContent>
      </AppLayout>
    );
  }
}
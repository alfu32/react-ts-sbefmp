
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './utils';
import { Observable } from 'rxjs';

export function Event(){
  var _observer,observable=new Observable((observer) => {
    _observer=observer;
    return {
      unsubscribe(){
        this.observers=this.observers.filter( o => o!==observer )
      }
    }
  });;
  this.subscribe=(fn)=>{
    return observable.subscribe(fn);
  }
  this.notify=(fn)=>{
    _observer.next(event);
  }
}
export class EventObservable{
  private observers=[];
  private observer;
  private observable = new Observable((observer) => {
    if(this.observers.indexOf(observer) == -1 ){
      this.observers.push(observer);
    }
    return {
      id:guid(3,6),
      unsubscribe(){
        this.observers=this.observers.filter( o => o!==observer )
      }
    }
  });
  subscribe(fn){
    return this.observable.subscribe(fn)
  }
  notify(event){
    //Object.keys(this.observers).forEach( k => this.observers[k].next(event) );
    this.observers.forEach( o => o.next(event) );
  }
}
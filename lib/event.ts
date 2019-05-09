
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './utils';
import { Observable } from 'rxjs';

export class Event{
  private observers={};
  private observer;
  private observable = new Observable((observer) => {
    const id=guid(5,5);
    this.observer=observer;
    return {unsubscribe : function(){}}
  });
  subscribe(fn){
    return this.observable.subscribe(fn)
  }
  notify(event){
    //Object.keys(this.observers).forEach( k => this.observers[k].next(event) );
    this.observer.next(event);
  }
}
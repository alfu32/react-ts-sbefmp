
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './utils';
import { Observable } from 'rxjs';

export class Event{
  private observers={};
  private observable = new Observable((observer) => {
    const id=guid(5,5);
    this.observers[id]=observer;
    return {unsubscribe : function(){}}
  });
  public subscribe(fn){
    return this.observable.subscribe(fn)
  }
}
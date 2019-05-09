
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './utils';
import { Observable } from 'rxjs';

export class Event{
  observers={};
  eventStream = new Observable((observer) => {
    const id=guid(5,5);
    this.observers[id]=observer;
    return {unsubscribe : function(){}}
  });
}
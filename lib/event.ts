
import { id,guid,kebapCase,classifyItems,TaggedChildrenClassifier } from './utils';
import { Observable } from 'rxjs';

function waitPropsReady(instance,timeout=1000){
  return new Promise(function(resolve,reject){
    (function poll(){
      if(typeof(instance["props"])!=="undefined"){
        resolve(instance);
      }else{

        if(timeout-->0){
          setTimeout(poll,1);
        }else{
          reject({instance,error:"timed out"});
        }
      }
    })();
  })
}
export function EventEmitter(){
  return function(instance,_selector){

    instance[_selector] = new SingleEventObservable();
    /*delegateFn(instance[_selector],_selector);*/
    console.log( "EventEmitter",{instance,_selector} );
  }
}
export function SingleEventObservable(){
  let _observer;
  Observable.call(this,(observer) => {
    _observer=observer;
    return {
      unsubscribe(){
        this.observers=this.observers.filter( o => o!==observer )
      }
    }
  });
  this.prototype=Observable.prototype;
  this.notify=(event)=>{
    _observer.next(event);
  }
  console.log("new event emitter observable",this,Observable.prototype)
}
Object.keys(Observable.prototype).forEach( k => {
  SingleEventObservable.prototype[k]=Observable.prototype[k];
})
export class MulticastEventObservable{
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
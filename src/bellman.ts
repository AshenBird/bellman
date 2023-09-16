type CommonVoid = void | Promise<void>

type ObserverRecord<T> = {
  next: (val: T) => CommonVoid
  error?: (err: any) => CommonVoid
}
type Observer<T> = ObserverRecord<T> | ((val: T) => CommonVoid)


export class Bellman<T =void>{
  private promise: Promise<T>
  private value:T
  private subscribeMap = new Map<symbol, Observer<T>>()
  
  get signal(){
    return new Proxy(this.promise,{
      get:(target,p)=>{
        if(p==="subscribe"){
          return this.subscribe.bind(this)
        }
        // @ts-ignore
        return target[p]
      }
    }) 
  }
  constructor(val:T) {
    this.promise = new Promise<T>((_resolve, _reject) => {
      this.subscribe({
        next: (val) => _resolve(val),
        error: (err) => _reject(err)
      })
    })
    this.value = val
  }
  subscribe(observer: Observer<T>) {
    const k = Symbol()
    this.subscribeMap.set(k, observer);
    return () => {
      this.subscribeMap.delete(k);
    }
  }
  next(val: T) {
    for (const [k, observer] of this.subscribeMap) {
      if (typeof observer === "function") {
        observer(val);
        continue;
      }
      observer.next(val);
    }
  }
  error(err: any) {
    for (const [k, observer] of this.subscribeMap) {
      if (typeof observer === "function") {
        continue;
      }
      if (!observer.error) return;
      observer.error(err);
    }
  }
  resolve(info: T) {
    this.next(info)
  }
  reject(err: any) {
    this.error(err)
  }
}
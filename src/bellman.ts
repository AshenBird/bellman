type CommonVoid = void | Promise<void>

type ObserverRecord<T> = {
  next: (val: T) => CommonVoid
  error?: (err: any) => CommonVoid
}
type Observer<T> = ObserverRecord<T> | ((val: T) => CommonVoid)


export class Bellman<T =void>{
  private promise: Promise<T>
  private value?:T = undefined
  private subscribeMap = new Map<symbol, Observer<T>>()
  get signal(){
    const _ = this
    return new Proxy(this.promise,{
      get:(target,p)=>{
        if(p==="subscribe"){
          return _.subscribe.bind(_)
        }
        return Reflect.get(target,p).bind(_)
      }
    }) as Promise<T>&{subscribe:(observer: Observer<T>)=>(() => void)}
  }
  constructor() {
    this.promise = new Promise<T>((_resolve, _reject) => {
      this.subscribe({
        next: (val) => _resolve(val),
        error: (err) => _reject(err)
      })
    })
  }
  subscribe(observer: Observer<T>) {
    const k = Symbol()
    this.subscribeMap.set(k, observer);
    if(this.value){
      if(typeof observer === "function"){
        observer(this.value)
      }else{
        observer.next(this.value)
      }
    }
    return () => {
      this.subscribeMap.delete(k);
    }
  }
  next(val: T) {
    this.value = val
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
type CommonVoid = void | Promise<void>

type ObserverRecord<T> = {
  next: (val: T) => CommonVoid
  error?: (err: any) => CommonVoid
}
type Observer<T> = ObserverRecord<T> | ((val: T) => CommonVoid)

class Subject<T>{
  subscribeMap = new Map<symbol, Observer<T>>()
  constructor() { }
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
}

export class Bellman<T =void>{
  private promise: Promise<T>
  private subject = new Subject<T>();
  constructor() {
    this.promise = new Promise<T>((_resolve, _reject) => {
      this.subject.subscribe({
        next: (val) => _resolve(val),
        error: (err) => _reject(err)
      })
    })
  }
  get signal(){
    return this.promise
  }
  resolve(info: T) {
    this.subject.next(info)
  }
  reject(err: any) {
    this.subject.error(err)
  }
}
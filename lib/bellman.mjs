class Subject {
  subscribeMap = /* @__PURE__ */ new Map();
  constructor() {
  }
  subscribe(observer) {
    const k = Symbol();
    this.subscribeMap.set(k, observer);
    return () => {
      this.subscribeMap.delete(k);
    };
  }
  next(val) {
    for (const [k, observer] of this.subscribeMap) {
      if (typeof observer === "function") {
        observer(val);
        continue;
      }
      observer.next(val);
    }
  }
  error(err) {
    for (const [k, observer] of this.subscribeMap) {
      if (typeof observer === "function") {
        continue;
      }
      if (!observer.error)
        return;
      observer.error(err);
    }
  }
}
class Bellman {
  promise;
  subject = new Subject();
  constructor() {
    this.promise = new Promise((_resolve, _reject) => {
      this.subject.subscribe({
        next: (val) => _resolve(val),
        error: (err) => _reject(err)
      });
    });
  }
  get signal() {
    return this.promise;
  }
  resolve(info) {
    this.subject.next(info);
  }
  reject(err) {
    this.subject.error(err);
  }
}
export {
  Bellman
};

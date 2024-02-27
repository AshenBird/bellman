class Bellman {
  promise;
  value = void 0;
  subscribeMap = /* @__PURE__ */ new Map();
  get signal() {
    const _ = this;
    return new Proxy(this.promise, {
      get: (target, p) => {
        if (p === "subscribe") {
          return _.subscribe.bind(_);
        }
        return Reflect.get(target, p).bind(target);
      }
    });
  }
  constructor() {
    this.promise = new Promise((_resolve, _reject) => {
      this.subscribe({
        next: (val) => _resolve(val),
        error: (err) => _reject(err)
      });
    });
  }
  subscribe(observer) {
    const k = Symbol();
    this.subscribeMap.set(k, observer);
    if (this.value) {
      if (typeof observer === "function") {
        observer(this.value);
      } else {
        observer.next(this.value);
      }
    }
    return () => {
      this.subscribeMap.delete(k);
    };
  }
  next(val) {
    this.value = val;
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
  resolve(info) {
    this.next(info);
  }
  reject(err) {
    this.error(err);
  }
}
export {
  Bellman
};

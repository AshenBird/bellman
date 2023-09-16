class Bellman {
  promise;
  value;
  subscribeMap = /* @__PURE__ */ new Map();
  get signal() {
    return new Proxy(this.promise, {
      get: (target, p) => {
        if (p === "subscribe") {
          return this.subscribe.bind(this);
        }
        return target[p];
      }
    });
  }
  constructor(val) {
    this.promise = new Promise((_resolve, _reject) => {
      this.subscribe({
        next: (val2) => _resolve(val2),
        error: (err) => _reject(err)
      });
    });
    this.value = val;
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

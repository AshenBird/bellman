var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var bellman_exports = {};
__export(bellman_exports, {
  Bellman: () => Bellman
});
module.exports = __toCommonJS(bellman_exports);
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

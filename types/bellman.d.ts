type CommonVoid = void | Promise<void>;
type ObserverRecord<T> = {
    next: (val: T) => CommonVoid;
    error?: (err: any) => CommonVoid;
};
type Observer<T> = ObserverRecord<T> | ((val: T) => CommonVoid);
export declare class Bellman<T = void> {
    private promise;
    private value?;
    private subscribeMap;
    get signal(): Promise<T> & {
        subscribe: (observer: Observer<T>) => (() => void);
    };
    constructor();
    subscribe(observer: Observer<T>): () => void;
    next(val: T): void;
    error(err: any): void;
    resolve(info: T): void;
    reject(err: any): void;
}
export {};

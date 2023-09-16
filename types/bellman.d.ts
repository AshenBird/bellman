export declare class Bellman<T = void> {
    private promise;
    private subject;
    constructor();
    get signal(): Promise<T>;
    resolve(info: T): void;
    reject(err: any): void;
}

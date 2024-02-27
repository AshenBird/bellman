# BellMan

ok，this is a package what supply signal for asynchronous dependent. Support `promise` like style and `rxjs` like style api.

just directly see examples and type declare , you will can use this package.

```ts
import { Bellman } from "@mcswift/bellman"

const bellMan = new BellMan<string>();

const sub = bellMan.subscribe((val)=>{
  console.log(val)
})

bellMan.resolve("bar");
// will output: "bar"

await bellMan.signal; 
// signal is a promise proxy , you can provide it for module which dependent your code.

```

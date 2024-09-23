# Can I use JSDoc instead of Typescript?

TLDR: Yes!

Our team likes the idea of type checking. We have a large codebase with some fairly large and complex data structures and being able to ship without having to worry about `Cannot read properties of null` errors would be pretty sweet.

However, we have Typescript hesitancy. In all honesty it's mainly the way it looks. There's a simplicity to plain Javascript that feels like it would be a shame to lose. On top of that we already use JSDoc to document large parts of our codebase. Currently the benefits fall into IDE autocompletion and just getting a good idea of function params and what they're for, but it'd be great to keep this format and have it do even more for us.

So what would we want from a type checking system? We'd want to be able to explicitly state the type for a variable, but also infer the types where possible. We want our IDE to tell us what type of variable something is, as well as tell us what properties an object has. Finally, we want it to block us from shipping bad code.

Let's see how this would work with regular Typescript:

```ts
// Explicit type checks
// Try to add wrong type to the array
const myArray: string[] = ["a", "b", "c"];
myArray.push(1); // Should error

// Function with an arg that can be null
function myFunction(myArg: string|null) {
  console.log(myArg.length); // Should error if `strictNullChecks` is true
}

// Inferred type check
const myOtherArray = ["a", "b", "c"];
myOtherArray.push(1); // Should error

// Autocomplete
interface MyInterface {
    myProperty: string;
}

function myOtherFunction(myArg: MyInterface) {
    // Try typing `myArg.` and see if you get the list of properties for MyInterface
}

// No type definition
function myFunctionWithoutType(myArg) { // Should error if `noImplicitAny` is true
  console.log(myArg.length);
}
```

Running the above `index.ts` file through Typescript's compiler gets us the following (example setup can be found in the `/typescript-flavour` folder):

```ts
src/index.ts:4:14 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
4 myArray.push(1); // Should error
               ~

src/index.ts:8:15 - error TS18047: 'myArg' is possibly 'null'.
8   console.log(myArg.length); // Should error if `strictNullChecks` is true
                ~~~~~

src/index.ts:13:19 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
13 myOtherArray.push(1); // Should error
                     ~

src/index.ts:25:32 - error TS7006: Parameter 'myArg' implicitly has an 'any' type.
25 function myFunctionWithoutType(myArg) { // Should error if `noImplicitAny` is true
                                  ~~~~~

Found 4 errors in the same file, starting at: src/index.ts:4
```

Awesome. But is there a way to get all of this without having to write Typescript?

Initially I assumed there'd be some fancy eslint plugin that does something similar to the above using JSDoc. And at first glance that's what I though `eslint-plugin-jsdoc` was for. But it turns out that plugin is mainly to check that you're writing good JSDocs, not to actually do the type checking itself.

But as it turns out... [Typescript supports JSDoc out of the box!](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)

With a quick change to `tsconfig.json` (setting `"allowJs": true`), and using the `--noEmit` flag (see the `/jsdoc-flavour` folder for setup), Typescript can now be used as a glorified linter to check that you're adhering to your JSDocs.

Let's try a JSDoc flavour of the above example:

```js
// Explicit type checks
// Try to add wrong type to the array

/**
 * @type {string[]}
 */
const myArray = ["a", "b", "c"];
myArray.push(1); // Should error

// Function with an arg that can be null

/**
 * @param {string | null} myArg
 */
function myFunction(myArg) {
  console.log(myArg.length); // Should error if `strictNullChecks` is true
}

// Inferred type checks
const myOtherArray = ["a", "b", "c"];
myOtherArray.push(1); // Should error

// Autocomplete

/**
 * @typedef MyInterface
 * @type {Object}
 * @property {string} myProperty
 */

/**
 * @param myArg {MyInterface}
 */
function myOtherFunction(myArg) {
    // Try typing `myArg.` and see if you get the list of properties for MyInterface
}

// No type definition
function myFunctionWithoutType(myArg) { // Should error if `noImplicitAny` is true
    console.log(myArg.length);
}
```

Running it through our typescript check gives us:

```js
src/index.js:8:14 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
8 myArray.push(1); // Should error
               ~

src/index.js:16:15 - error TS18047: 'myArg' is possibly 'null'.
16   console.log(myArg.length); // Should error if `strictNullChecks` is true
                 ~~~~~

src/index.js:21:19 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
21 myOtherArray.push(1); // Should error
                     ~

src/index.js:39:32 - error TS7006: Parameter 'myArg' implicitly has an 'any' type.
39 function myFunctionWithoutType(myArg) { // Should error if `noImplicitAny` is true
                                  ~~~~~

Found 4 errors in the same file, starting at: src/index.js:8
```

Sweet!

For an existing codebase this can also be implemented gradually. Just set `"checkJs": false` in `tsconfig.json` and add `// @ts-check` to the top of any file you want checked. Boom!

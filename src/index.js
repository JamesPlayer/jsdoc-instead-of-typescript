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
  console.log(myArg.length); // Should error
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


// But...
// Bad JSDoc
/**
 * @param myFirstArg {string}
 * @param mySecondArg {string}
 * Oops, forgot to add the type for myThirdArg
 */
function myFunctionWithBadJSDoc(myFirstArg, mySecondArg, myThirdArg) {
  // Try typing `myArg.` and see if you get the list of properties for MyInterface
}
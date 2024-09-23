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

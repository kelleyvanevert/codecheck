
// Exercise statement:

// Define a function named "average"
//  that averages a given array of numbers,
//  without using a any for-loops.

if (typeof average === "undefined") {
  throw new Error(`You didn't define the variable`)
}
else if (typeof average !== "function") {
  throw new Error(`The variable is not a function`)
}

{
  let res = average([4, 6, 2]);

  if (res !== 4) {
    throw new Error(`Expected average([4, 6, 2]) to be 4, but it was ${res}`)
  }
}

if (__static_analysis.for > 0) {
  throw new Error(`You're using a for-loop, which should not be necessary.`);
}

if (!__static_analysis.reduce) {
  throw new Error(`You're not using any reduce... how can this be?`);
}

// required
exit("OK")

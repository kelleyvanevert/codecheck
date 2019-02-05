
# POC of a simple code checker

## Install

Just run `npm install` and then `npm run dev`. The code-checking server listens to POST requests at `localhost:3000` and the app probably lives at `localhost:8080`.

## About

The problem statement:

* Provide a tool that check whether a student's code is OK, with respect to some JavaScript exercise.

Of course this problem is hard. There's a dynamic aspect to checking the code (you have to run it to see if it works), as well as a static aspect (because even though the code may work, it may be not what we want to see).

Although the general problem is quite hard (infeasible?), we of course only have to deal with a smaller version of the problem, because:

* We're testing code writting by students new to JavaScript, who will not even know how to write crazily devious code yet.
* We can get away with testing relatively simple aspects, especially if we make the exercises small and consise.

For instance, we want to check whether the student knows how to work with `map`, `filter`, and `reduce`. An exercise:

* Compute the average route length and assign it to a new variable `avgLength`, given the data:
  
  ```js
  // route lengths in kilometers
  let routes = [4.2, 1.5, 8, 9.1, 0.2];
  ```

  Use `map`, `filter`, or `reduce` instead of a `for` loop.

We can make our analysis easier with the following rules:

* Sanity check: only accept code under 1000 characters long.
* Testing a specific variable (`svgLength`) at the end of execution is easier.
* Checking whether a `for` loop is included in the code is not hard either, using any JavaScript parser library.
* Checking some other simple lexical statistics, that we know by experience are typical ways a student might produce ugly code, such as the number of functions, is also straightforward.

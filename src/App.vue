<template>
  <div id="app">
    <h1>Code checker</h1>
    <p>Define a function `average` that, given an array of numbers, computes the average. Use functional programming style instead of a `for`-loop.</p>
    <div>
      <textarea v-model="sourceCode"></textarea>
    </div>
    <button @click="evaluate()">Check my code!</button>
    
    <p v-if="computing">Computing...</p>

    <div v-if="!computing">
      <p v-if="status.sandbox_err">My bad!</p>

      <p v-if="status.err_parse">Your code didn't parse at all. Maybe you have a syntax error?</p>
      <p v-if="status.err">Computer says: <strong>{{ status.err }}</strong></p>
      <p v-if="status.ok">Hooray!</p>

      <hr />

      <pre>{{ staticAnalysis }}</pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data () {
    return {
      sourceCode: `
function average (arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}
`,
      computing: false,
      status: {
        // `sandbox_err` iff the sandbox failed somehow (the app's problem, not the student's)

        // `err_parse`   iff the student's code didn't parse
        // `err`         iff the student's code didn't run well (with some particular error)
        // `ok`          iff the code worked well :)
      },
      staticAnalysis: null,
    };
  },
  methods: {
    evaluate () {
      this.computing = true;
      this.status = {};

      axios.post("http://localhost:3000", {
        sourceCode: this.sourceCode,
      })
        .then(res => {
          console.log("result of computation", res);
          console.log("static analysis:", res.data.staticAnalysis)

          if (res.data.err_parse) {
            this.status.err_parse = true;
          }
          else if (res.data.err) {
            this.status.err = res.data.err;
          }
          else {
            this.status.ok = true;
          }

          this.staticAnalysis = res.data.staticAnalysis;
          this.computing = false;
        })
        .catch(e => {
          console.log("unknown error", e);
          this.status.sandbox_err = true;
          this.computing = false;
        });
    },
  },
}
</script>

<style>

code {
  background: #eee;
}

textarea {
  min-width: 400px;
  min-height: 140px;
  font-family: "Menlo", "Ubuntu Mono", "Courier New", Courier, monospace;
}

</style>

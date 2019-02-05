<template>
  <div id="app">
    <h1>Code checker</h1>
    <p>Try to write some JavaScript code so that, after running, the variable <code>some_variable</code> is defined and equal to <code>42</code>.</p>
    <div>
      <textarea v-model="sourceCode"></textarea>
    </div>
    <button @click="evaluate()">Check my code!</button>
    
    <p v-if="computing">Computing...</p>

    <div v-if="!computing">
      <p v-if="status.sandbox_err">My bad!</p>

      <p v-if="status.err_parse">Your code didn't parse at all. Maybe you have a syntax error?</p>
      <p v-if="status.err">Your code didn't run well.</p>
      <p v-if="status.undef">The variable <code>some_variable</code> is not defined.</p>
      <p v-if="status.incorrect">You defined the variable, but it doesn't have the right value.</p>
      <p v-if="status.ok">Hooray!</p>

      <p v-if="status.notHappy">
        <span v-if="status.ok">Except:</span>
        <span v-else>Also:</span>
        You seem to be using functions, where we feel this really shouldn't be necessary.
      </p>
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
console.log("hello");

let my_variable = 35;
// let some_variable = 42;
// let some_variable = (n => n + 2)(40);
`,
      computing: false,
      status: {
        // `sandbox_err` iff the sandbox failed somehow (the app's problem, not the student's)

        // `err_parse`   iff the student's code didn't parse
        // `err`         iff the student's code didn't run well
        // `undef`       iff the variable wasn't defined
        // `incorrect`   iff the variable is present, but incorrect
        // `ok`          iff the code worked well :)

        // `notHappy`    iff the code worked well, but isn't considered elegant enough
      },
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
          else if (!res.data.output) {
            this.status.err = true;
          }
          else if (res.data.output.undef) {
            this.status.undef = true;
          }
          else {
            if (res.data.output.value !== 42) {
              this.status.incorrect = true;
            }
            else {
              this.status.ok = true;
            }
          }

          if (res.data.staticAnalysis) {
            if (res.data.staticAnalysis.numFns > 0) {
              this.status.notHappy = true;
            }
          }

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

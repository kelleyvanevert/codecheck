
var route = [1,2,3];

let avg = route.reduce(function (accum, len) {
  return accum + len;
}, 0);

avg = avg / route.length;

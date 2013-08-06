var stack = require('./SbuzzMeStack.js');
//console.log(stack3.id)
//console.log(stack.HEAD);
var a = new stack.Stack();
var b = new stack.Stack();
a.push(1);
a.push(2);
a.push(3);
a.push(4);

console.log(a.pop());
b.push(2);
b = a.cloneInvert();

console.log(b.pop());
console.log(b.pop());
console.log(b.pop());
console.log(b.pop());
console.log(b.pop());

console.log(a.head());
console.log(a.pop());
console.log(a.pop());
console.log(a.pop());
console.log(a.pop());
console.log(a.pop());


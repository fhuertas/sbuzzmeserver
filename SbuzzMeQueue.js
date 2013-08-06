var queue = new Object();
var stack = require('./SbuzzMeStack.js');



module.exports = {
	add : function (origin, destination){
		if (typeof(queue[destination]) === 'undefined'){
			queue[destination] = new stack.Stack();
		}
		queue[destination].push(origin);
	},
	//dispatch 
	list: function(){
		for (stack in queue ){
			var newStack = queue[stack].cloneInvert();
			while (newStack.head() != null){
				console.log("Destination="+stack + ",Origen="+newStack.pop());
			}
		}
	}
	// Clean stack
}

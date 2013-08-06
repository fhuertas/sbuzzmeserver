// Constructor
var Stack = function () {
  // always initialize all instance properties
  this.first = new Object();
  this.first.next = this.first;
  this.first.element = null;
  
}
// class methods
Stack.prototype.head = function() {
	return this.first.element;
};
Stack.prototype.push = function(element) {
	var next = this.first;
	this.first = new Object();
	this.first.element = element;
	this.first.next = next;
};
Stack.prototype.pop = function() {
	var element = this.first.element;
	this.first = this.first.next;
	return element;
};

Stack.prototype.cloneInvert = function(){
	newStack = new Stack();
	position = this.first;
	while (position.element != null){
		newStack.push(position.element);
		position = position.next;
	}
	return newStack;
}
module.exports.Stack = Stack;



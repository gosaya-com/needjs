# needjs

needjs's maintenance is currently halted. We will monitor issues and pull requests, but there won't be any active development until further notice.

[![Build Status](https://travis-ci.org/gosaya-com/needjs.svg?branch=master)](https://travis-ci.org/gosaya-com/needjs)

needjs is a module that will help you satisfy your needs and handles their requirement.

# Installation
    $ npm install --save needjs

# Getting Started
``` javascript
// import needjs
var NeedJS = require('needjs');
var sys = new NeedJS();
var Need = NeedJS.Need;

// Now let's define our needs.
sys.register(new Need({
  name: 'audience',
  post: function(inputs){
    this.done('world');
  }
}));

sys.register(new Need({
  name: 'hello',
  req: ['audience'],
  post: function(inputs){
  console.log("Hello " + inputs['audience'] + "!");
  }
}));

// Finally trigger the hello Need
sys.trigger('hello');
```

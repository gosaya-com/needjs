var NeedJS = require('..');
var sys = new NeedJS();
var Need = NeedJS.Need;

var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

sys.register(new Need({
    name: 'BMI',
    req: ['height', 'weight'],
    post: function(inputs){
        var height = inputs['height'];
        var weight = inputs['weight'];
        this.done(weight/(height*height));
    }
}));

sys.register(new Need({
    name: 'height',
    req: [Need.OneOf(['heightASK', 'heightConst'])],
    post: function(inputs){
        this.done(inputs[Need.OneOf(['heightASK', 'heightConst'])]);
    }
}));

sys.register(new Need({
    name: 'heightASK',
    req: ['input'],
    pre: function(inputs){
        console.log('Enter your height in M');
        this.ok();
    },
    post: function(inputs){
        var inp = inputs['input'];
        sys.forget('input');
        var num = Number(inp);
        if (num > 0 && num < 200)
            this.done(num)
        else
            this.fail();
    }
}));

sys.register(new Need({
    name: 'heightConst',
    post: function(inputs){
        this.done(1.8);
    }
}));

sys.register(new Need({
    name: 'weight',
    req: [Need.OneOf(['weightASK', 'weightConst'])],
    post: function(inputs){
        this.done(inputs[Need.OneOf(['weightASK', 'weightConst'])]);
    }
}));

sys.register(new Need({
    name: 'weightASK',
    req: ['input'],
    pre: function(inputs){
        console.log('Enter your weight in Kg');
        this.ok();
    },
    post: function(inputs){
        var inp = inputs['input'];
        sys.forget('input');
        var num = Number(inp);
        if (num > 0 && num < 200)
            this.done(num)
        else
            this.fail();
    }
}));

sys.register(new Need({
    name: 'weightConst',
    post: function(inputs){
        console.log("I didn't get your weight, will use the default.")
        this.done(80);
    }
}));

sys.register(new Need({
    name: 'input',
    post: function(input){
        rl.question('> ', (answer) => {
            this.done(answer);
        });
    }
}));

sys.register(new Need({
    name: 'main',
    req: ['BMI'],
    post: function(inputs){
        console.log('BMI of someone with weight ' + inputs['weight'] + 'kg and height ' + 
            inputs['height'] + 'm is equal to: ' + inputs['BMI']);
        rl.close();
        this.done();
    }
}))

sys.trigger('main');

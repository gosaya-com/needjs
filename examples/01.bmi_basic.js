var NeedJS = require('..');
var sys = new NeedJS();
var Need = NeedJS.Need;

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
    post: function(inputs){
        this.done(1.8);
    }
}));

sys.register(new Need({
    name: 'weight',
    post: function(inputs){
        this.done(80);
    }
}));

sys.register(new Need({
    name: 'main',
    req: ['BMI'],
    post: function(inputs){
        console.log('BMI of someone with weight ' + inputs['weight'] + 'kg and height ' + 
            inputs['height'] + 'm is equal to: ' + inputs['BMI']);
        this.done();
    }
}))

sys.trigger('main');

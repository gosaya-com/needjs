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
    req: [Need.OneOf(['heightDB', 'heightConst'])],
    post: function(inputs){
        this.done(inputs[Need.OneOf(['heightDB', 'heightConst'])]);
    }
}));

sys.register(new Need({
    name: 'heightDB',
    post: function(inputs){
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
    req: [Need.OneOf(['weightDB', 'weightConst'])],
    post: function(inputs){
        this.done(inputs[Need.OneOf(['weightDB', 'weightConst'])]);
    }
}));

sys.register(new Need({
    name: 'weightDB',
    post: function(inputs){
        this.fail();
    },
    invokers: [
        {
            event: 'weight',
            callback: function(inputs, data){
                console.log('running weightDB.weight callback with value: ' +
                    JSON.stringify(data));
                if (data.trusted)
                    this.done(data.weight);
                else
                    this.fail();
            }
        },
        {
            event: ['forceWeight', 'setWeight'],
            callback: function(inputs, data){
                console.log('running weightDB.forceWeight callback with value: ' + 
                    JSON.stringify(data));
                this.done(data.weight);
            }
        }
    ]
}));

sys.register(new Need({
    name: 'weightConst',
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

sys.invoke('weight', {weight: 70, trusted: false});
sys.invoke('setWeight', {weight: 60});
sys.invoke('weight', {weight: 70, trusted: false});
sys.invoke('forceWeight', {weight: 90});

sys.trigger('main');

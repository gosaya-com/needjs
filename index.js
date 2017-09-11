var EventEmitter = require('events').EventEmitter
var verbose = process.env['verbose'] || false;

/**
 * The core NeedJS system. This class handles all calls and manages the needs and requests.
 * @module NeedJS
 */

/**
 * @alias module:NeedJS
 */
var System = function(options){
    EventEmitter.call(this);

    // Data Structures
    // Persistence
    this.data = {};
    this.triggers = {};
    this.queue = [];
    this.nextTick = false;

    // Dynamic
    this.needs = {};
    this.events = {};
    this.options = options || {};
}

System.prototype.on = EventEmitter.prototype.on;
System.prototype.emit = EventEmitter.prototype.emit;

System.prototype.call = function(name, func, ev_data){
    var sys = this;
    /**
     * @alias callee
     * @type Object
     */
    var obj = {
        /**
         * Call this function when your need is satisfied
         * @param {Object} data - Need's data
         */
        done: function(data){
            sys.inform(name, data);
        },
        /**
         * Call this function when the need has failed
         */
        fail: function(){
            sys.fail(name);
        },
        /**
         * Call this function when the need needs time
         */
        wait: function(){
            sys.triggers[name].wait = true;
            sys.emit('wait');
        },
        /**
         * Call this function for PRE only, when you have processed but have not failed or done
         */
        ok: function(){ // USED IN PRE
            sys.next();
        },
        sys: sys,
        options: sys.options
    };
    func.apply(obj, [this.data, ev_data]);
}

System.prototype.clearQueue = function(name){
    name = name.toString();
    this.queue = this.queue.filter(function(f){
        // Must be != don't change to !==
        return f != name;
    })
}

System.prototype.fail = function(name, dir, except){
    /*
     * dir:
     *  0: both parent and childs should fail
     *  1: only childs should fail
     *  2: only parents should fail
     */
    dir = dir || 0;
    except = except || [];
    var trigger = this.triggers[name];
    var need = this.needs[name];
    if ( name instanceof Array ){
        need = {
            req: name
        }
    }
    if( dir === 1 || dir === 0 ){
        // Down fail
        for(var i in need.req){
            var tmp_trig = this.triggers[need.req[i]];
            if(tmp_trig){ // It might have been forgotten
                if(except.indexOf(need.req[i]) || !tmp_trig.user_trigged){
                    tmp_trig.father = tmp_trig.father.filter(function(f){
                        return f !== name;
                    });
                    if (tmp_trig.father.length === 0){
                        // I was the only father, kill this.
                        this.fail(need.req[i], 1, except.concat([name]));
                    }
                }
            }
        }
    }
    if (dir === 2 || dir === 0){
        // Up fail
        if(trigger){ // It might be triggered without anything in mind
            for(var i in trigger.father){
                var tmp_name = trigger.father[i];
                if(except.indexOf(tmp_name) === -1){
                    if( tmp_name instanceof Array ){
                        var tmp_trig = this.triggers[tmp_name];
                        this.queue.push(tmp_name);
                        this.next();
                        // It's an array, let it sort itself out.
                    } else {
                        this.fail(tmp_name, 0, except.concat(name)); // SHOULD FAIL IN EVERY DIRECTION
                    }
                }
            }
        }
    }
    // Fail myself
    this.queue = this.queue.filter(function(f){
        return f !== name;
    });
    delete this.triggers[name];
    this.clearQueue(name);
}

/**
 * Forget a previous need's answer.
 *
 * Use this when you need to re-run a need in the future.
 * @param {String} need - Need's name
 */
System.prototype.forget = function(need){
    delete this.data[need];
    delete this.triggers[need];
    this.clearQueue(need);
}

/**
 * Inform a system about a need's value.
 *
 * @param {String} name - Need's name
 * @param {Object} info - Need's value
 */
System.prototype.inform = function(name, info){
    if(typeof info === 'undefined')
        info = true;
    this.data[name] = info;

    // Check child, kill if un needed
    var need = this.needs[name];
    if(need){ // It might be an Array
        for(var i in need.req){
            var tmp_trig = this.triggers[need.req[i]];
            if(tmp_trig && !tmp_trig.user_trigged){
                tmp_trig.father = tmp_trig.father.filter(function(f){
                    return f !== name;
                });
                if (tmp_trig.father.length === 1){
                    // I was the only father, kill this.
                    this.fail(need.req[i], 1, [name]);
                }
            }
        }
    }
    // Adding parents to queue
    if(this.triggers[name]){ // It might be informed from a direct inform.
        for (var i in this.triggers[name].father){
            this.queue.push(this.triggers[name].father[i]);
            this.next();
        }
    }

    delete this.triggers[name];
    this.clearQueue(name);
}

/**
 * Invoke an event
 *
 * @param {String} eventName - Event name
 * @param {Object} eventData - Event data
 */
System.prototype.invoke = function(eventName, eventData){
    var tmp = this.events[eventName];

    for(var i in tmp){
        var obj = tmp[i];

        if(this.isNeeded(obj.need)){
            this.call(obj.need, obj.callback, eventData);
        }
    }
}

System.prototype.isNeeded = function(name){
    return typeof this.data[name] === 'undefined';
}

/**
 * Load the system from previously saved state
 *
 * @param {Config} config -- A previously saved state
 */
System.prototype.load = function(config){
    this.data = config.data;
    this.triggers = config.triggers;
    this.queue = config.queue;
    if(config.nextTick)
        this.next();
}

/**
 * Load system's dynamics
 *
 * @param {Dynamics}
 */
System.prototype.loadDynamic = function(dynamics){
    this.events = dynamics.events;
    this.needs = dynamics.needs;
    this.options = dynamics.options;
}

/**
 * Process the system in the next tick
 */
System.prototype.next = function(){
    if(!this.nextTick){
        this.nextTick = true;
        process.nextTick(
            ()=>{
                this.process();
            }
        );
    }
}
System.prototype.process = function(){
    if(verbose)
        console.log('\n' + JSON.stringify(this.save(), null, 2) + '\n-----------');
    this.nextTick = false;
    if(this.queue.length === 0){
        if(Object.keys(this.triggers).length !== 0){
            // TODO do something
            this.queue.push(Object.keys(this.triggers)[0]);
        } else {
            this.emit('stop');
            return;
        }
    }
    var name = this.queue.pop();
    var trigger = this.triggers[name];
    var need = this.needs[name];

    if (trigger && !trigger.pre_done && need && need.pre){
        trigger.pre_done = true;
        this.queue.push(name);
        return this.call(name, need.pre);
    }

    if(trigger && trigger.wait){
        this.emit('wait');
        return this.next();
    }
    if(this.isNeeded(name)){
        if(name instanceof Array){
            if(trigger.branch !== -1){
                if( !this.isNeeded(name[trigger.branch]) ){
                    this.inform(name, this.data[name[trigger.branch]]);
                    return;
                }
            }
            trigger.branch++;
            if(trigger.branch === name.length){
                // Failed
                this.fail(name);
                this.next();
            } else {
                this.trigger(name[trigger.branch], name);
            }
        } else {
            var flag = true;
            for(var c in need.req){
                if(this.isNeeded(need.req[c])){
                    flag = false;
                    this.trigger(need.req[c],name);
                    this.next();
                }
            }
            if(flag){
                // Call post
                this.call(name, this.needs[name].post);
            }
        }
    } else {
        // Do nothing, this isn't needed.
        this.inform(name, this.data[name]);
        this.next();
    }
}

/**
 * Register a need into system
 *
 * @param {Need} need
 */
System.prototype.register = function(need){
    this.needs[need.name] = {
        req: need.req,
        post: need.post,
        pre: need.pre
    }

    for(var i in need.invokers){
        var invoke = need.invokers[i];
        if(invoke.event instanceof Array){
            for(var j in invoke.event){
                var ename = invoke.event[j];
                if(!this.events[ename])
                    this.events[ename] = [];
                this.events[ename].push({
                    need: need.name,
                    callback: invoke.callback
                });
            }
        } else {
            if(!this.events[invoke.event])
                this.events[invoke.event] = [];

            this.events[invoke.event].push({
                need: need.name,
                callback: invoke.callback
            });
        }
    }
}

/**
 * Save system's state
 *
 * @returns {Config} System's state
 */
System.prototype.save = function(){
    return {
        data: this.data,
        triggers: this.triggers,
        queue: this.queue,
        nextTick: this.nextTick
    }
}

/**
 * Save system's dynamics
 * @returns {Dynamic} System's dynamics.
 */
System.prototype.saveDynamic = function(){
    return {
        needs: this.needs,
        events: this.events,
        options: this.options
    }
}

/**
 * Trigger a need for the system.
 *
 * @param {String} name - Need's name
 * @param {String} father - [father=null] Do not set father, for internal purpose only
 */
System.prototype.trigger = function(name, father){
    if(! this.isNeeded(name)){
        // TODO?
        //return;
    }
    if(this.triggers[name]){
        if(father)
            this.triggers[name].father.push(father);
        this.queue.push(name);
        return;
    }
    var tmp = {
        father: [],
        pre_done: false
    };
    if(father)
        tmp.father.push(father);
    else
        tmp.user_trigged = true;

    if(name instanceof Array){
        tmp.branch = -1;
    }

    this.triggers[name] = tmp;
    this.queue.push(name);
    this.next();
}

/**
 * This callback is called after all requirements of the need are satisfied
 * @callback Need.post
 * @param {Object} inputs -- The data stored from needs
 * @this callee
 */

/**
 * This callback is called before any of the requirements are processed
 *  *Note*: If a requirement is satisfied before this need turn, it might be called before pre.
 *  @callback Need.pre
 *  @param {Object} inputs -- The data stored from needs
 *  @this callee
 */

/**
 * This callback is called when a registered event is invoked.
 * @callback eventCallback
 * @param {Object} inputs -- The data stored from needs
 * @param {Object} eventData - The data from the invoked event
 * @this callee
 */

/**
 * A need object
 *
 * @alias Need
 * @param Need {Object} Need - The need's config
 * @param Need.name {String} name - The need's name
 * @param Need.req {String[]} req - The required needs for this need
 * @param Need.post {post} post - The callback that is called after all requirements are satisfied
 * @param Need.pre {pre} pre - The callback that is called before any of the requirements are triggered
 * @param Need.invokers {Object[]} invokers - An array of invokers
 * @param Need.invokers[].event {String|String[]} event - Name of the event or events for this invoker
 * @param Need.invokers[].callback {System~eventCallback} callback - A callback for when the event is invoked.
 */
var Need = function(config){
    if (!config.name)
        throw "ERR: No name was assigned";
    if(!config.post)
        throw "ERR: No post function was assigned";
    this.name = config.name;
    this.req = config.req || [];
    this.post = config.post;
    this.invokers = config.invokers || [];
    this.pre = config.pre;
};

Need.OneOf = function(needs){
    return needs;
};

System.Need = Need;

module.exports = System;

## Modules

<dl>
<dt><a href="#module_NeedJS">NeedJS</a></dt>
<dd><p>The core NeedJS system. This class handles all calls and manages the needs and requests.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#callee">callee</a> : <code>Object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#Need">Need(Need)</a></dt>
<dd><p>A need object</p>
</dd>
</dl>

<a name="module_NeedJS"></a>

## NeedJS
The core NeedJS system. This class handles all calls and manages the needs and requests.


* [NeedJS](#module_NeedJS)
    * [System()](#exp_module_NeedJS--System) ⏏
        * _instance_
            * [.forget(need)](#module_NeedJS--System+forget)
            * [.inform(name, info)](#module_NeedJS--System+inform)
            * [.invoke(eventName, eventData)](#module_NeedJS--System+invoke)
            * [.load(config)](#module_NeedJS--System+load)
            * [.next()](#module_NeedJS--System+next)
            * [.register(need)](#module_NeedJS--System+register)
            * [.save()](#module_NeedJS--System+save) ⇒ <code>Config</code>
            * [.trigger(Need&#x27;s, [father])](#module_NeedJS--System+trigger)
        * _inner_
            * [~eventCallback](#module_NeedJS--System..eventCallback) : <code>function</code>

<a name="exp_module_NeedJS--System"></a>

### System() ⏏
**Kind**: Exported function  
<a name="module_NeedJS--System+forget"></a>

#### system.forget(need)
Forget a previous need's answer.

Use this when you need to re-run a need in the future.

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  

| Param | Type | Description |
| --- | --- | --- |
| need | <code>String</code> | Need's name |

<a name="module_NeedJS--System+inform"></a>

#### system.inform(name, info)
Inform a system about a need's value.

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Need's name |
| info | <code>Object</code> | Need's value |

<a name="module_NeedJS--System+invoke"></a>

#### system.invoke(eventName, eventData)
Invoke an event

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | Event name |
| eventData | <code>Object</code> | Event data |

<a name="module_NeedJS--System+load"></a>

#### system.load(config)
Load the system from previously saved state

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Config</code> | - A previously saved state |

<a name="module_NeedJS--System+next"></a>

#### system.next()
Process the system in the next tick

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  
<a name="module_NeedJS--System+register"></a>

#### system.register(need)
Register a need into system

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  

| Param | Type |
| --- | --- |
| need | [<code>Need</code>](#Need) | 

<a name="module_NeedJS--System+save"></a>

#### system.save() ⇒ <code>Config</code>
Save system's state

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  
**Returns**: <code>Config</code> - System's state  
<a name="module_NeedJS--System+trigger"></a>

#### system.trigger(Need&#x27;s, [father])
Trigger a need for the system.

**Kind**: instance method of [<code>System</code>](#exp_module_NeedJS--System)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| Need's | <code>String</code> |  | name |
| [father] | <code>String</code> | <code></code> | Do not set father, for internal purpose only |

<a name="module_NeedJS--System..eventCallback"></a>

#### System~eventCallback : <code>function</code>
This callback is called when a registered event is invoked.

**Kind**: inner typedef of [<code>System</code>](#exp_module_NeedJS--System)  
**this**: [<code>callee</code>](#callee)  

| Param | Type | Description |
| --- | --- | --- |
| inputs | <code>Object</code> | - The data stored from needs |
| evenetData | <code>Object</code> | The data from the invoked event |

<a name="callee"></a>

## callee : <code>Object</code>
**Kind**: global variable  

* [callee](#callee) : <code>Object</code>
    * [.done(data)](#callee.done)
    * [.fail()](#callee.fail)
    * [.wait()](#callee.wait)
    * [.ok()](#callee.ok)

<a name="callee.done"></a>

### callee.done(data)
Call this function when your need is saticfied

**Kind**: static method of [<code>callee</code>](#callee)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Need's data |

<a name="callee.fail"></a>

### callee.fail()
Call this function when the need has failed

**Kind**: static method of [<code>callee</code>](#callee)  
<a name="callee.wait"></a>

### callee.wait()
Call this function when the need needs time

**Kind**: static method of [<code>callee</code>](#callee)  
<a name="callee.ok"></a>

### callee.ok()
Call this function for PRE only, when you have proccessed but have not failed or done

**Kind**: static method of [<code>callee</code>](#callee)  
<a name="Need"></a>

## Need(Need)
A need object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Need | <code>Object</code> | Need - The need's config |
| Need.name | <code>String</code> | name - The need's name |
| Need.req | <code>Array.&lt;String&gt;</code> | req - The required needs for this need |
| Need.post | <code>post</code> | post - The callback that is called after all requirments are saticfied |
| Need.pre | <code>pre</code> | pre - The callback that is called before any of the requirments are triggered |
| Need.invokers | <code>Array.&lt;Object&gt;</code> | invokers - An array of invokers |
| Need.invokers[].event | <code>String</code> \| <code>Array.&lt;String&gt;</code> | event - Name of the event or events for this invoker |
| Need.invokers[].callback | <code>System~eventCallback</code> | callback - A callback for when the event is invoked. |


* [Need(Need)](#Need)
    * [.post](#Need.post) : <code>function</code>
    * [.pre](#Need.pre) : <code>function</code>

<a name="Need.post"></a>

### Need.post : <code>function</code>
This callback is called after all requirments of the need are saticfied

**Kind**: static typedef of [<code>Need</code>](#Need)  
**this**: [<code>callee</code>](#callee)  

| Param | Type | Description |
| --- | --- | --- |
| inputs | <code>Object</code> | - The data stored from needs |

<a name="Need.pre"></a>

### Need.pre : <code>function</code>
This callback is called before any of the requirments are processed
 *Note*: If a requirment is saticfied before this need turn, it might be called before pre.

**Kind**: static typedef of [<code>Need</code>](#Need)  
**this**: [<code>callee</code>](#callee)  

| Param | Type | Description |
| --- | --- | --- |
| inputs | <code>Object</code> | - The data stored from needs |


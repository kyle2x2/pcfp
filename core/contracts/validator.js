
// core/contracts/validator.js - lightweight JSON "contract" validator (v7.2)
(function(){
  window.PCFP = window.PCFP || {};
  var SCHEMAS = {};

  function register(name, schema){ SCHEMAS[name] = schema; }
  function require(path, msg){ 
    var segs = path.split('.'); var c = window; 
    for(var i=0;i<segs.length;i++){ if(c==null){ throw new Error(msg||("Missing: "+path)); } c = c[segs[i]]; }
    return c;
  }
  function assert(ok, msg){ if(!ok) throw new Error(msg||"Contract validation failed"); }
  function typeOf(v){ return (v===null)?"null":Array.isArray(v)?"array":typeof v; }

  function checkSchema(name, payload){
    var s = SCHEMAS[name]; if(!s) throw new Error("Unknown schema: "+name);
    if(s.type){ assert(typeOf(payload)===s.type, "Expected "+s.type); }
    if(s.required){ s.required.forEach(function(k){ assert(Object.prototype.hasOwnProperty.call(payload, k), "Missing "+k); }); }
    if(s.properties){
      Object.keys(s.properties).forEach(function(k){
        if(payload[k]===undefined) return;
        var prop = s.properties[k];
        if(prop.type){
          var t = Array.isArray(prop.type) ? prop.type : [prop.type];
          assert(t.indexOf(typeOf(payload[k]))>=0, "Bad type for "+k);
        }
      });
    }
    return true;
  }

  window.PCFP.contracts = { register: register, assert: assert, checkSchema: checkSchema, require: require };
})();

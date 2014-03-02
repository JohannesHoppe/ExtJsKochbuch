/*
 * Ext JS Library 3.0 Pre-alpha
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */


Ext.DomHelper = function(){
    var tempTableEl = null,
    	emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
    	tableRe = /^table|tbody|tr|td$/i,
    	pub,
    	// kill repeat to save bytes
    	afterbegin = "afterbegin",
    	afterend = "afterend",
    	beforebegin = "beforebegin",
    	beforeend = "beforeend",
    	ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;
        
    // private
    function doInsert(el, o, returnElement, pos, sibling, append){        
        var newNode = pub.insertHtml(pos, Ext.getDom(el), createHtml(o));        
        return returnElement ? Ext.get(newNode, true) : newNode;
    }

    // build as innerHTML where available
    function createHtml(o){
	    var b = "",
	    	attr,
	    	val,
	    	key,
	    	keyVal,
	    	cn;
	    	
        if(typeof o == 'string'){
            b = o;
        } else if (Ext.isArray(o)) {            
	        Ext.each(o, function(v) {    
                b += createHtml(v);
            });            
        } else {
	        b += "<" + (o.tag = o.tag || "div");
	        for(attr in o){		        
		        val = o[attr];		        	
		        if (!/tag|children|cn|html$/i.test(attr) && !Ext.isFunction(val)) {		            			        
		            if (Ext.isObject(val)) {	
		            	b += " " + attr + "='";
	                    for (key in val) {
		                    keyVal = val[key];
		                    b += !Ext.isFunction(keyVal) ? key + ":" + keyVal + ";" : "";	                        
	                    }
	                    b += "'";			          
	                } else {		                
		             	b += " " + ({cls : "class", htmlFor : "for"}[attr] || attr) + "='" + val + "'";   
	                }
	            }
	        }
	        // Now either just close the tag or try to add children and close the tag.
	        if (emptyTags.test(o.tag)) {
	            b += "/>";
	        } else {
	            b += ">";
	            if (cn = o.children || o.cn) {
	                b += createHtml(cn);
	            } else if(o.html){
	                b += o.html;
	            }
	            b += "</" + o.tag + ">";
        	}	        
        }        
        return b;
    };    

    function ieTable(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1, 
        	el = tempTableEl;
        while(++i < depth){
            el = el.firstChild;
        }
        return el;
    };

    
    function insertIntoTable(tag, where, el, html) {        
	    var node,
        	before;
        	
        tempTableEl = tempTableEl || document.createElement('div');        
        		
  	    if(tag == 'td' && (where == afterbegin || where == beforeend) ||
  	       !/td|tr|tbody/i.test(tag) && (where == beforebegin || where == afterend)) { 
            return;
        }
        before = where == beforebegin ? el :
		 		 where == afterend ? el.nextSibling :
				 where == afterbegin ? el.firstChild : null;
				    
        if (where == beforebegin || where == afterend) {	        
        	el = el.parentNode;
    	}
        
        if (tag == 'td' || (tag == "tr" && (where == beforeend || where == afterbegin))) {
	        node = ieTable(4, trs, html, tre);
        } else if ((tag == "tbody" && (where == beforeend || where == afterbegin)) || 
        		   (tag == "tr" && (where == beforebegin || where == afterend))) {
	        node = ieTable(3, tbs, html, tbe);
        } else {
	     	node = ieTable(2, ts, html, te);   
        }  
        el.insertBefore(node, before);
        return node;
    };


    pub = {
	    
	    markup : function(o){
	        return createHtml(o);
	    },	    
	
	    
	    insertHtml : function(where, el, html){
	        var hash = {},
	        	hashVal,
 	        	setStart,
	        	range,
	        	frag,
	        	rangeEl,
	        	rs;
	        
	        where = where.toLowerCase();	
	        // add these here because they are used in both branches of the condition.	
	        hash[beforebegin] = ['BeforeBegin', 'previousSibling'];	 
	        hash[afterend] = ['AfterEnd', 'nextSibling'];	            
	           
	        if (el.insertAdjacentHTML) {
	            if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
	            	return rs;	                
	            }
	            // add these two to the hash.
	            hash[afterbegin] = ['AfterBegin', 'firstChild'];
	            hash[beforeend] = ['BeforeEnd', 'lastChild'];	            
	            if (hashVal = hash[where]) {
		        	el.insertAdjacentHTML(hashVal[0], html);
	            	return el[hashVal[1]];           	
	            }	            
	        } else {
		        range = el.ownerDocument.createRange();	        		        
		        setStart = "setStart" + (/end/i.test(where) ? "After" : "Before");
		        if (hash[where]) {
			     	range[setStart](el);
			     	frag = range.createContextualFragment(html);
			     	el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);   
			     	return el[(where == beforebegin ? "previous" : "next") + "Sibling"];
		        } else {			        
			        rangeEl = (where == afterbegin ? "first" : "last") + "Child";
			        if (el.firstChild) {
				        range[setStart](el[rangeEl]);
				        frag = range.createContextualFragment(html);
				        where == afterbegin ? el.insertBefore(frag, el.firstChild) : el.appendChild(frag);			       	
			        } else {
		 	            el.innerHTML = html;	    	        
	 	            }
	 	            return el[rangeEl];
		        }
	        }
	        throw 'Illegal insertion point -> "' + where + '"';
	    },
	
	    
	    insertBefore : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, beforebegin);
	    },
	
	    
	    insertAfter : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, afterend, "nextSibling");
	    },
	
	    
	    insertFirst : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, afterbegin, "firstChild");
	    },	    
	
	    
	    append : function(el, o, returnElement){
		    return doInsert(el, o, returnElement, beforeend, "", true);
	    },
	
	    
	    overwrite : function(el, o, returnElement){
	        el = Ext.getDom(el);
	        el.innerHTML = createHtml(o);
	        return returnElement ? Ext.get(el.firstChild) : el.firstChild;
	    },
	    
	    createHtml : createHtml
    };    
    return pub;
}();

Ext.Template = function(html){
    var me = this,
    	a = arguments,
    	buf = [];

    if (Ext.isArray(html)) {
        html = html.join("");
    } else if (a.length > 1) {
	    Ext.each(a, function(v) {
            if (Ext.isObject(v)) {
                Ext.apply(me, v);
            } else {
                buf.push(v);
            }
        });
        html = buf.join('');
    }

    
    me.html = html;
    if (me.compiled) {
        me.compile();
    }
};
Ext.Template.prototype = {
    
    applyTemplate : function(values){
		var me = this;

        return me.compiled ?
        		me.compiled(values) :
				me.html.replace(me.re, function(m, name){
		        	return values[name] !== undefined ? values[name] : "";
		        });
	},

    
    set : function(html, compile){
	    var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },

    
    re : /\{([\w-]+)\}/g,

    
    compile : function(){
        var me = this,
        	sep = Ext.isGecko ? "+" : ",";

        function fn(m, name){
	        name = "values['" + name + "']";
	        return "'"+ sep + name + " == undefined ? '' : " + name + args + ")" + sep + "'";
        }

        eval("this.compiled = function(values){ return " + (Ext.isGecko ? "'" : "[") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Ext.isGecko ?  "';};" : "'].join('');};"));
        return me;
    },

    
    insertFirst: function(el, values, returnElement){
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    
    insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    
    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    
    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert : function(where, el, values, returnEl){
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    
    overwrite : function(el, values, returnElement){
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
};

Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;


Ext.Template.from = function(el, config){
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};

Ext.apply(Ext.Template.prototype, {
    
    applyTemplate : function(values){
		var me = this,
			useF = me.disableFormats !== true
        	fm = Ext.util.Format, 
        	tpl = me;	    
	    
        if(me.compiled){
            return me.compiled(values);
        }
        function fn(m, name, format, args){
            if (format && useF) {
                if (format.substr(0, 5) == "this.") {
                    return tpl.call(format.substr(5), values[name], values);
                } else {
                    if (args) {
                        // quoted values are required for strings in compiled templates,
                        // but for non compiled we need to strip them
                        // quoted reversed for jsmin
                        var re = /^\s*['"](.*)["']\s*$/;
                        args = args.split(',');
                        for(var i = 0, len = args.length; i < len; i++){
                            args[i] = args[i].replace(re, "$1");
                        }
                        args = [values[name]].concat(args);
                    } else {
                        args = [values[name]];
                    }
                    return fm[format].apply(fm, args);
                }
            } else {
                return values[name] !== undefined ? values[name] : "";
            }
        };
        return me.html.replace(me.re, fn);
    },
		
    
    disableFormats : false,				
	
    
    re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
    
    
    compile : function(){
        var me = this,
        	fm = Ext.util.Format,
        	useF = me.disableFormats !== true,
        	sep = Ext.isGecko ? "+" : ",",
        	body;
        
        function fn(m, name, format, args){
            if(format && useF){
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            }else{
                args= ''; format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'"+ sep + format + "values['" + name + "']" + args + ")"+sep+"'";
        }
        
        // branched to use + in gecko and [].join() in others
        if(Ext.isGecko){
            body = "this.compiled = function(values){ return '" +
                   me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
                    "';};";
        }else{
            body = ["this.compiled = function(values){ return ['"];
            body.push(me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return me;
    },
    
    // private function used to call members
    call : function(fnName, value, allValues){
        return this[fnName](value, allValues);
    }
}
);


Ext.DomQuery = function(){
    var cache = {}, 
    	simpleCache = {}, 
    	valueCache = {},
    	nonSpace = /\S/,
    	trimRe = /^\s+|\s+$/g,
    	tplRe = /\{(\d+)\}/g,
    	modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
    	tagTokenRe = /^(#)?([\w-\*]+)/,
    	nthRe = /(\d*)n\+?(\d*)/, 
    	nthRe2 = /\D/,
    	// This is for IE MSXML which does not support expandos.
	    // IE runs the same speed using setAttribute, however FF slows way down
	    // and Safari completely fails so they need to continue to use expandos.
	    isIE = window.ActiveXObject ? true : false,
	    key = 30803;
	    
    // this eval is stop the compressor from
	// renaming the variable to something shorter
	eval("var batch = 30803;");    	

    function child(p, index){
        var i = 0,
        	n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d){
        var n = d.firstChild, ni = -1,
        	nx;
 	    while(n){
 	        nx = n.nextSibling;
 	        if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    return this;
 	};

    function byClassName(c, a, v){
        if(!v){
            return c;
        }
        var r = [], ri = -1, cn;
        for(var i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr){
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }
        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };

    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        }else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.children || ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        }else if(mode == "~"){
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && (n.nodeType != 1 || (tagName == '*' || n.tagName.toLowerCase()!=tagName)));
                if(n){
                    result[++ri] = n;
                }
            }
        }
        return result;
    };

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var r = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var r = [], ri = -1;
        for(var i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };

    function byAttribute(cs, attr, value, op, custom){
        var r = [], 
        	ri = -1, 
        	st = custom=="{",
        	f = Ext.DomQuery.operators[op];
        for(var i = 0, ci; ci = cs[i]; i++){
            var a;
            if(st){
                a = Ext.DomQuery.getStyle(ci, attr);
            }
            else if(attr == "class" || attr == "className"){
                a = ci.className;
            }else if(attr == "for"){
                a = ci.htmlFor;
            }else if(attr == "href"){
                a = ci.getAttribute("href", 2);
            }else{
                a = ci.getAttribute(attr);
            }
            if((f && f(a, value)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value){
        return Ext.DomQuery.pseudos[name](cs, value);
    };

    function nodupIEXml(cs){
        var d = ++key, 
        	r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
        	r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
        	d = ++key,
        	r = [];
        if(!len1){
            return c2;
        }
        if(isIE && c1[0].selectSingleNode){
            return quickDiffIEXml(c1, c2);
        }        
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }

    return {
        getStyle : function(el, name){
            return Ext.fly(el).getStyle(name);
        },
        
        compile : function(path, type){
            type = type || "select";

            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
            	q = path, mode, lq,
            	tk = Ext.DomQuery.matchers,
            	tklen = tk.length,
            	mm;
            	// accept leading mode switch
            	lmode = q.match(modeRe);
            
            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                q = q.replace(lmode[1], "");
            }
            // strip leading slashes
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var tm = q.match(tagTokenRe);
                if(type == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }else if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else{
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < tklen; j++){
                        var t = tk[j];
                        var m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                                    return m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },

        
        select : function(path, root, type){
            if(!root || root == document){
                root = document;
            }
            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(","),
            	results = [];
            for(var i = 0, len = paths.length; i < len; i++){
                var p = paths[i].replace(trimRe, "");
                if(!cache[p]){
                    cache[p] = Ext.DomQuery.compile(p);
                    if(!cache[p]){
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },

        
        selectNode : function(path, root){
            return Ext.DomQuery.select(path, root)[0];
        },

        
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root),
            	v;
            n = n[0] ? n[0] : n;
            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        
        selectNumber : function(path, root, defaultValue){
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
            	result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                	m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                	f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                	r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();


Ext.query = Ext.DomQuery.select;

(function(){

var EXTUTIL = Ext.util;

EXTUTIL.Observable = function(){
    
    var me = this;
    if(me.listeners){
        me.on(me.listeners);
        delete me.listeners;
    }
    if(!me.events){
        me.events = {};
    }
};

EXTUTIL.Observable.prototype = function(){
	var filterOptRe = /^(?:scope|delay|buffer|single)$/;
		
	return {
	    
	
	    fireEvent : function(){
	        var a = Ext.toArray(arguments),
	        	ename = a[0].toLowerCase(),
	        	me = this,
				ret = true,
	        	ce = me.events[ename],
	        	q,
				c;
            if (me.eventsSuspended === true) {            
	            if (q = me.suspendedEventsQueue) {
	                q.push(a);
	            }
            }
            else if(Ext.isObject(ce) && ce.bubble){
				if(ce.fire.apply(ce, a.slice(1)) === false) {
					return false;
				}
                c = me.getBubbleTarget && me.getBubbleTarget();
				if(c && c.enableBubble) {
					c.enableBubble(ename);
					return c.fireEvent.apply(c, a);
				}
	        }
            else {            
	            if (Ext.isObject(ce)) {
	                a.shift();
	                ret = ce.fire.apply(ce, a);
	            }
	        }
	        return ret;
	    },
	
	    
	    addListener : function(eventName, fn, scope, o){
		    var me = this,
		    	e,
		    	oe,
		    	isF;
	        if (Ext.isObject(eventName)) {
	            o = eventName;
	            for (e in o){		            
		            oe = o[e];
	                if (!filterOptRe.test(e)) {	                
		                me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);              
	                }
	            }            
	        } else {	        
		        eventName = eventName.toLowerCase();
				if (typeof (ce = me.events[eventName] || true) == "boolean") {	            
		            me.events[eventName] = ce = new EXTUTIL.Event(me, eventName);
		        }
		        ce.addListener(fn, scope, !Ext.isObject(o) ? {} : o);
	    	}
	    },
	
	    
	    removeListener : function(eventName, fn, scope){
	        var ce = this.events[eventName.toLowerCase()];
	        if (Ext.isObject(ce)) {
	            ce.removeListener(fn, scope);
	        }
	    },
	
	    
	    purgeListeners : function(){
		    var events = this.events,
		    	evt,
		    	key;		    	
	        for(key in events){
		        evt = events[key];
	            if(Ext.isObject(evt)) evt.clearListeners();	            
	        }
	    },	    
	
	    
	    addEvents : function(o){
		    var me = this;
		    me.events = me.events || {};        
	        if (typeof o == 'string') {            
		        Ext.each(arguments, function(a) {
			        me.events[a] = me.events[a] || true;
	            });
	        } else {
	            Ext.applyIf(me.events, o);
	        }
	    },
	
	    
	    hasListener : function(eventName){
	        var e = this.events[eventName];
	        return Ext.isObject(e) && e.listeners.length > 0;
	    },
	
	    
	    suspendEvents : function(queueSuspended){
	        this.eventsSuspended = true;
	        if (queueSuspended) this.suspendedEventsQueue = [];	        
	    },
	
	    
	    resumeEvents : function(){
		    var me = this;
	        me.eventsSuspended = !delete me.suspendedEventQueue;        
	        Ext.each(me.suspendedEventsQueue, function(e) {
	            me.fireEvent.apply(me, e);
	        });     
	    }
	}
}();


EXTUTIL.Observable.prototype.on = EXTUTIL.Observable.prototype.addListener;

EXTUTIL.Observable.prototype.un = EXTUTIL.Observable.prototype.removeListener;


EXTUTIL.Observable.releaseCapture = function(o){
    o.fireEvent = EXTUTIL.Observable.prototype.fireEvent;
};

function createTargeted(h, o, scope){
    return function(){
        if(o.target == arguments[0]){
            h.apply(scope, Ext.toArray(arguments));
        }
    };
};

EXTUTIL.Event = function(obj, name){
    this.name = name;
    this.obj = obj;
    this.listeners = [];
};

EXTUTIL.Event.prototype = {
    addListener : function(fn, scope, options){
        var me = this,
        	l;
        scope = scope || me.obj;
        if(!me.isListening(fn, scope)){
            l = me.createListener(fn, scope, options);
            if(me.firing){ // if we are currently firing this event, don't disturb the listener loop	                                
                me.listeners = me.listeners.slice(0);                
            }
            me.listeners.push(l);
        }
    },

    createListener : function(fn, scope, o){
        o = o || {};
        scope = scope || this.obj;
        var l = {fn: fn, scope: scope, options: o},
        	h = fn;
        if(o.target){
            h = createTargeted(h, o, scope);
        }
        l.fireFn = h;
        return l;
    },

    findListener : function(fn, scope){ 
        var ret = -1                    
        Ext.each(this.listeners, function(l, i) {               
            if(l.fn == fn && (l.scope == scope || l.scope == this.obj)){
                ret = i;
                return false;
            }
        },
        this);
        return ret;
    },

    isListening : function(fn, scope){
        return this.findListener(fn, scope) != -1;
    },

    removeListener : function(fn, scope){
        var index,
        	me = this,
        	ret = false;
        if((index = me.findListener(fn, scope)) != -1){                
            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }
            me.listeners.splice(index, 1);
            ret = true;
        }
        return ret;
    },

    clearListeners : function(){
        this.listeners = [];
    },

    fire : function(){
        var me = this,            	            	
        	args = Ext.toArray(arguments),
        	ret = true;                                                 
        
        Ext.each(me.listeners, function(l) {
            me.firing = true;
            if (l.fireFn.apply(l.scope || me.obj || window, args) === false) {
                return ret = me.firing = false;
            }
        });
        me.firing = false;
        return ret;
    }
};
})();

Ext.EventManager = function(){
    var docReadyEvent, 
    	docReadyProcId, 
    	docReadyState = false,    	
    	E = Ext.lib.Event,
    	D = Ext.lib.Dom,
    	DOC = document,
    	WINDOW = window,
    	IEDEFERED = "ie-deferred-loader",
    	DOMCONTENTLOADED = "DOMContentLoaded",
    	elHash = {};

    function addListener(el, ename, fn, wrap, scope){	    
        var id = Ext.id(el),
        	es = elHash[id] = elHash[id] || {};        	
       
        (es[ename] = es[ename] || []).push([fn, wrap, scope]);
        E.on(el, ename, wrap);

        if(ename == "mousedown" && el == DOC){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    }

    function fireDocReady(){
        if(!docReadyState){            
            Ext.isReady = docReadyState = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Ext.isGecko || Ext.isOpera) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Ext.isIE){
                var defer = DOC.getElementById(IEDEFERED);
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
            }
        }
    };

    function initDocReady(){
	    var COMPLETE = "complete";
	    	
        docReadyEvent = new Ext.util.Event();
        if (Ext.isGecko || Ext.isOpera) {
            DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
        } else if (Ext.isIE){
            DOC.write("<s"+'cript id=' + IEDEFERED + ' defer="defer" src="/'+'/:"></s'+"cript>");            
            DOC.getElementById(IEDEFERED).onreadystatechange = function(){
                if(this.readyState == COMPLETE){
                    fireDocReady();
                }
            };
        } else if (Ext.isSafari){
            docReadyProcId = setInterval(function(){                
                if(DOC.readyState == COMPLETE) {
                    fireDocReady();
                 }
            }, 10);
        }
        // no matter what, make sure it fires on load
        E.on(WINDOW, "load", fireDocReady);
    };

    function createTargeted(h, o){
        return function(){
	        var args = Ext.toArray(arguments);
            if(o.target == Ext.EventObject.setEvent(args[0]).target){
                h.apply(this, args);
            }
        };
    };    
    
    function createBuffered(h, o){
        var task = new Ext.util.DelayedTask(h);
        return function(e){
            // create new event object impl so new events don't wipe out properties            
            task.delay(o.buffer, h, null, [new Ext.EventObjectImpl(e)]);
        };
    };

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };

    function createDelayed(h, o){
        return function(e){
            // create new event object impl so new events don't wipe out properties   
            e = new Ext.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };

    function listen(element, ename, opt, fn, scope){
        var o = !Ext.isObject(opt) ? {} : opt,
        	el = Ext.getDom(element);
        	
        fn = fn || o.fn; 
        scope = scope || o.scope;
        
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Ext){// !window[xname]){  ==> can't we do this? 
                return;
            }
            e = Ext.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }            
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized) {
                e = e.browserEvent;
            }
            fn.call(scope || el, e, t, o);
        };
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }

        addListener(el, ename, fn, h, scope);
        return h;
    };

    var pub = {
	    
	    addListener : function(element, eventName, fn, scope, options){		     		     		     
        	listen(element, eventName, options, fn, scope);
        },

        
        removeListener : function(element, eventName, fn, scope){            
	        var id = Ext.id(el = Ext.getDom(element)),
	        	wrap;        
	        
	        Ext.each((elHash[id] || {})[eventName], function (v,i,a) {
			    if (Ext.isArray(v) && v[0] == fn && (!scope || v[2] == scope)) {		        			        
			        E.un(el, eventName, wrap = v[1]);
			        a.splice(i,1);
			        return false;			        
		        }
	        });	
	        
	        if(eventName == "mousedown" && el == DOC && wrap){ // fix stopped mousedowns on the document
	            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
	        }
        },

        
        removeAll : function(el){
	        var id = Ext.id(el = Ext.getDom(el)), 
				es = elHash[id], 				
				ename;
	       
	        for(ename in es){
	            if(es.hasOwnProperty(ename)){	                    
	                Ext.each(es[ename], function(v) {
	                    E.un(el, ename, v.wrap);                    
	                });
	            }            
	        }
	        elHash[id] = null;       
        },

        
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clearListeners();               
            } else {
                if(!docReadyEvent) initDocReady();
                options = options || {};
	            options.delay = options.delay || 1;	            
	            docReadyEvent.addListener(fn, scope, options);
            }
        },
        
        elHash : elHash   
    };
     
    pub.on = pub.addListener;
    
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();

Ext.onReady = Ext.EventManager.onDocumentReady;


//Initialize doc classes
(function(){
    
    var initExtCss = function(){
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if(!bd){ return false; }
        var cls = [' ',
                Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : 'ext-ie8'))
                : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
                : Ext.isOpera ? "ext-opera"
                : Ext.isSafari ? "ext-safari"
                : Ext.isChrome ? "ext-chrome" : ""];

        if(Ext.isMac){
            cls.push("ext-mac");
        }
        if(Ext.isLinux){
            cls.push("ext-linux");
        }
        if(Ext.isBorderBox){
            cls.push('ext-border-box');
        }
        if(Ext.isStrict){ // add to the parent to allow for selectors like ".ext-strict .ext-ie"
            var p = bd.parentNode;
            if(p){
                p.className += ' ext-strict';
            }
        }
        bd.className += cls.join(' ');
        return true;
    }

    if(!initExtCss()){
        Ext.onReady(initExtCss);
    }
})();



Ext.EventObject = function(){
    var E = Ext.lib.Event,
    	// safari keypress events for special keys return bad keycodes
    	safariKeys = {
	        3 : 13, // enter
	        63234 : 37, // left
	        63235 : 39, // right
	        63232 : 38, // up
	        63233 : 40, // down
	        63276 : 33, // page up
	        63277 : 34, // page down
	        63272 : 46, // delete
	        63273 : 36, // home
	        63275 : 35  // end
    	},
    	// normalize button clicks
    	btnMap = Ext.isIE ? {1:0,4:1,2:2} :
                (Ext.isWebKit ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Ext.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };

    Ext.EventObjectImpl.prototype = {
           
        setEvent : function(e){
	        var me = this;
            if(e == me || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            me.browserEvent = e;
            if(e){
                // normalize buttons
                me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if(e.type == 'click' && me.button == -1){
                    me.button = 0;
                }
                me.type = e.type;
                me.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                me.ctrlKey = e.ctrlKey || e.metaKey;
                me.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                me.keyCode = e.keyCode;
                me.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                me.target = E.getTarget(e);
                // same for XY
                me.xy = E.getXY(e);
            }else{
                me.button = -1;
                me.shiftKey = false;
                me.ctrlKey = false;
                me.altKey = false;
                me.keyCode = 0;
                me.charCode = 0;
                me.target = null;
                me.xy = [0, 0];
            }
            return me;
        },

        
        stopEvent : function(){
	        var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopEvent(me.browserEvent);
            }
        },

        
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },        

        
        stopPropagation : function(){
	        var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
        },

        
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        
        getKey : function(){
            var k = this.keyCode || this.charCode;
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

        
        getPageX : function(){
            return this.xy[0];
        },

        
        getPageY : function(){
            return this.xy[1];
        },

//         
//         getTime : function(){
//             if(this.browserEvent){
//                 return E.getTime(this.browserEvent);
//             }
//             return null;
//         },

        
        getXY : function(){
            return this.xy;
        },

        
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
        },

        
        getRelatedTarget : function(){
            return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
        },

        
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ 
                delta = e.wheelDelta/120;
            }else if(e.detail){ 
                delta = -e.detail/3;
            }
            return delta;
        },
		
		
		within : function(el, related, allowEl){
			var t = this[related ? "getRelatedTarget" : "getTarget"]();
			return t && ((allowEl ? (t == Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
		}
	 };

    return new Ext.EventObjectImpl();
}();

Ext.apply(Ext.EventManager, function(){
	var resizeEvent, 
    	resizeTask, 
    	textEvent, 
    	textSize,
    	D = Ext.lib.Dom,
    	E = Ext.lib.Event,
    	propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
    
    /// There is some jquery work around stuff here that isn't needed in Ext Core.
    function addListener(el, ename, fn, wrap, scope){	    
        var id = Ext.id(el),
        	es = Ext.EventManager.elHash[id] = Ext.EventManager.elHash[id] || {};        	
       
        (es[ename] = es[ename] || []).push([fn, wrap, scope]);
        E.on(el, ename, wrap);

        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
        	var args = ["DOMMouseScroll", wrap, false];
        	el.addEventListener.apply(el, args);
            E.on(window, 'unload', function(){
	            el.removeEventListener.apply(el, args);                
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    };
    
    function createBuffered(h, o){
        var task = new Ext.util.DelayedTask(h);
        return function(e){
            // create new event object impl so new events don't wipe out properties            
            task.delay(o.buffer, h, null, [new Ext.EventObjectImpl(e)]);
        };
    };

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };

    function createDelayed(h, o){
        return function(e){
            // create new event object impl so new events don't wipe out properties   
            e = new Ext.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };
    
    /// this is here because the private addListerner needs to rebind (There is some jquery work around stuff there that isn't needed in Ext Core).	
    function listen(element, ename, opt, fn, scope){
        var o = !Ext.isObject(opt) ? {} : opt,
        	el = Ext.getDom(element);
        	
        fn = fn || o.fn; 
        scope = scope || o.scope;
        
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Ext){// !window[xname]){  ==> can't we do this? 
                return;
            }
            e = Ext.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }            
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized) {
                e = e.browserEvent;
            }

            fn.call(scope || el, e, t, o);
        };
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }

        addListener(el, ename, fn, h, scope);
        return h;
    };  
      	
	return { 
		/// this is here because the private addListerner needs to rebind (There is some jquery work around stuff there that isn't needed in Ext Core).
		addListener : function(element, eventName, fn, scope, options){		     		     		     
            if(Ext.isObject(eventName)){                
	            var o = eventName, e, val;
                for(e in o){
	                val = o[e];
                    if(!propRe.test(e)){                            		         
	                    if(Ext.isFunction(val)){
	                        // shared options
	                        listen(element, e, o, val, o.scope);
	                    }else{
	                        // individual options
	                        listen(element, e, val);
	                    }
                    }
                }
            } else {
            	listen(element, eventName, options, fn, scope);
        	}
        },
        
        
        removeListener : function(element, eventName, fn, scope){            
	        var id = Ext.id(el = Ext.getDom(element)),
	        	wrap;        
	        
	        Ext.each((Ext.EventManager.elHash[id] || {})[eventName], function (v,i,a) {
			    if (Ext.isArray(v) && v[0] == fn && (!scope || v[2] == scope)) {		        			        
			        E.un(el, eventName, wrap = v[1]);
			        a.splice(i,1);
			        return false;			        
		        }
	        });	
	        
	        if(eventName == "mousewheel" && el.addEventListener && wrap){
	            el.removeEventListener("DOMMouseScroll", wrap, false);
	        }
	        if(eventName == "mousedown" && el == document && wrap){ // fix stopped mousedowns on the document
	            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
	        }
        },
		   	
		// private
	    doResizeEvent: function(){
	        resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
	    },
	    
	    
	    onWindowResize : function(fn, scope, options){
	        if(!resizeEvent){
	            resizeEvent = new Ext.util.Event();
	            resizeTask = new Ext.util.DelayedTask(this.doResizeEvent);
	            E.on(window, "resize", this.fireWindowResize, this);
	        }
	        resizeEvent.addListener(fn, scope, options);
	    },
	
	    // exposed only to allow manual firing
	    fireWindowResize : function(){
	        if(resizeEvent){
	            if((Ext.isIE||Ext.isAir) && resizeTask){
	                resizeTask.delay(50);
	            }else{
	                resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
	            }
	        }
	    },
	
	    
	    onTextResize : function(fn, scope, options){
	        if(!textEvent){
	            textEvent = new Ext.util.Event();
	            var textEl = new Ext.Element(document.createElement('div'));
	            textEl.dom.className = 'x-text-resize';
	            textEl.dom.innerHTML = 'X';
	            textEl.appendTo(document.body);
	            textSize = textEl.dom.offsetHeight;
	            setInterval(function(){
	                if(textEl.dom.offsetHeight != textSize){
	                    textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
	                }
	            }, this.textResizeInterval);
	        }
	        textEvent.addListener(fn, scope, options);
	    },
	
	    
	    removeResizeListener : function(fn, scope){
	        if(resizeEvent){
	            resizeEvent.removeListener(fn, scope);
	        }
	    },
	
	    // private
	    fireResize : function(){
	        if(resizeEvent){
	            resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
	        }
	    },
	    
	     
	    textResizeInterval : 50,
	    
	    
        ieDeferSrc : false   
    }
}());

Ext.EventManager.on = Ext.EventManager.addListener;


Ext.apply(Ext.EventObjectImpl.prototype, {
    
    BACKSPACE: 8,
    
    TAB: 9,
    
    NUM_CENTER: 12,
    
    ENTER: 13,
    
    RETURN: 13,
    
    SHIFT: 16,
    
    CTRL: 17,
    CONTROL : 17, // legacy
    
    ALT: 18,
    
    PAUSE: 19,
    
    CAPS_LOCK: 20,
    
    ESC: 27,
    
    SPACE: 32,
    
    PAGE_UP: 33,
    PAGEUP : 33, // legacy
    
    PAGE_DOWN: 34,
    PAGEDOWN : 34, // legacy
    
    END: 35,
    
    HOME: 36,
    
    LEFT: 37,
    
    UP: 38,
    
    RIGHT: 39,
    
    DOWN: 40,
    
    PRINT_SCREEN: 44,
    
    INSERT: 45,
    
    DELETE: 46,
    
    ZERO: 48,
    
    ONE: 49,
    
    TWO: 50,
    
    THREE: 51,
    
    FOUR: 52,
    
    FIVE: 53,
    
    SIX: 54,
    
    SEVEN: 55,
    
    EIGHT: 56,
    
    NINE: 57,
    
    A: 65,
    
    B: 66,
    
    C: 67,
    
    D: 68,
    
    E: 69,
    
    F: 70,
    
    G: 71,
    
    H: 72,
    
    I: 73,
    
    J: 74,
    
    K: 75,
    
    L: 76,
    
    M: 77,
    
    N: 78,
    
    O: 79,
    
    P: 80,
    
    Q: 81,
    
    R: 82,
    
    S: 83,
    
    T: 84,
    
    U: 85,
    
    V: 86,
    
    W: 87,
    
    X: 88,
    
    Y: 89,
    
    Z: 90,
    
    CONTEXT_MENU: 93,
    
    NUM_ZERO: 96,
    
    NUM_ONE: 97,
    
    NUM_TWO: 98,
    
    NUM_THREE: 99,
    
    NUM_FOUR: 100,
    
    NUM_FIVE: 101,
    
    NUM_SIX: 102,
    
    NUM_SEVEN: 103,
    
    NUM_EIGHT: 104,
    
    NUM_NINE: 105,
    
    NUM_MULTIPLY: 106,
    
    NUM_PLUS: 107,
    
    NUM_MINUS: 109,
    
    NUM_PERIOD: 110,
    
    NUM_DIVISION: 111,
    
    F1: 112,
    
    F2: 113,
    
    F3: 114,
    
    F4: 115,
    
    F5: 116,
    
    F6: 117,
    
    F7: 118,
    
    F8: 119,
    
    F9: 120,
    
    F10: 121,
    
    F11: 122,
    
    F12: 123,	
    
    
    isNavKeyPress : function(){
        var me = this,
        	k = me.keyCode;
        k = Ext.isSafari ? (safariKeys[k] || k) : k;
        return (k >= 33 && k <= 40) || k == me.RETURN || k == me.TAB || k == me.ESC;
    },

    isSpecialKey : function(){
        var k = this.keyCode;
        return (this.type == 'keypress' && 
        		this.ctrlKey) ||
        		k == 9 || 
        		k == 13  || 
        		k == 40 || 
        		k == 27 ||
	            (k == 16) || 
	            (k == 17) ||
	            (k >= 18 && k <= 20) ||
	            (k >= 33 && k <= 35) ||
	            (k >= 36 && k <= 39) ||
	            (k >= 44 && k <= 45);
    },
	
	getPoint : function(){
	    return new Ext.lib.Point(this.xy[0], this.xy[1]);
	},

    
    hasModifier : function(){
        return ((this.ctrlKey || this.altKey) || this.shiftKey);
    }
});

(function(){
var DOC = document;

Ext.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
              DOC.getElementById(element) : element,
    	id;

    if(!dom) return null;

    id = dom.id;

    if(!forceNew && id && Ext.Element.cache[id]){ // element object already exists
        return Ext.Element.cache[id];
    }

    
    this.dom = dom;

    
    this.id = id || Ext.id(dom);
};

var	D = Ext.lib.Dom,
	DH = Ext.DomHelper,
	E = Ext.lib.Event,
	A = Ext.lib.Anim,
	El = Ext.Element;

El.prototype = {
	
    set : function(o, useSet){
        var el = this.dom,
        	attr,
        	val;       	
       
        for(attr in o){
	        val = o[attr];
            if (attr != "style" && !Ext.isFunction(val)) {
	            if (attr == "cls" ) {
	                el.className = val;
	            } else if (o.hasOwnProperty(attr)) {
	                if (useSet || !!el.setAttribute) el.setAttribute(attr, val);
	                else el[attr] = val;
	            }
            }
        }
        if(o.style){
            Ext.DomHelper.applyStyles(el, o.style);
        }
        return this;
    },
	
//  Mouse events
    
    
    
    
    
    
    
    
    
    
//  Keyboard events
    
    
    


//  HTML frame/object events
    
    
    
    
    
    

//  Form events
    
    
    
    
    
    

//  User Interface events
    
    
    

//  DOM Mutation events
    
    
    
    
    
    
    

    
    defaultUnit : "px",

    
    is : function(simpleSelector){
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    
    focus : function(defer) {
	    var me = this;
        try{
            if(!isNaN(defer)){
                me.focus.defer(defer, me);
            }else{
                me.dom.focus();
            }
        }catch(e){}
        return me;
    },

    
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    
    getValue : function(asNumber){
	    var val = this.dom.value;
        return asNumber ? parseInt(val, 10) : val;
    },

    
    addListener : function(eventName, fn, scope, options){
        Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
        return this;
    },

    
    removeListener : function(eventName, fn, scope){
        Ext.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
        return this;
    },

    
    removeAllListeners : function(){
        Ext.EventManager.removeAll(this.dom);
        return this;
    },

    
    addUnits : function(size){
        if(size === "" || size == "auto" || size === undefined){
	        size = size || '';
	    } else if(!isNaN(size) || !unitPattern.test(size)){
	        size = size + (this.defaultUnit || 'px');
	    }
	    return size;
    },

    
    load : function(url, params, cb){
        Ext.Ajax.request(Ext.apply({
            params: params,
            url: url.url || url,
            callback: cb,
            el: this,
            indicatorText: url.indicatorText || ''
        }, Ext.isObject(url) ? url : {}));
        return this;
    },

    
    isBorderBox : function(){
        return noBoxAdjust[(this.dom.tagName || "").toLowerCase()] || Ext.isBorderBox;
    },

    
    remove : function(){
        Ext.removeNode(this.dom);
        delete El.cache[this.dom.id];
    },

    
    hover : function(overFn, outFn, scope, options){
        var me = this;
        me.on('mouseenter', overFn, scope || me.dom, options);
        me.on('mouseleave', outFn, scope || me.dom, options);
        return me;
    },

	
    contains : function(el){
        return !el ? false : Ext.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    
    getAttributeNS : Ext.isIE ? function(ns, name){
        var d = this.dom,
        	type = typeof d[ns + ":" + name];

        if(!Ext.isEmpty(type) && type != 'unknown'){
            return d[ns + ":" + name];
        }
        return d[name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
    },
    
    update : function(html) {
	    this.dom.innerHTML = html;
    }
};

var ep = El.prototype;

El.addMethods = function(o){
   Ext.apply(ep, o);
};


ep.on = ep.addListener;


ep.un = ep.removeListener;


ep.autoBoxAdjust = true;

// private
var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
	docEl;


El.cache = {};


El.get = function(el){
    var ex,
     	elm,
     	id;
    if(!el){ return null; }
    if (typeof el == "string") { // element id
        if (!(elm = DOC.getElementById(el))) {
            return null;
        }
        if (ex = El.cache[el]) {
            ex.dom = elm;
        } else {
            ex = El.cache[el] = new El(elm);
        }
        return ex;
    } else if (el.tagName) { // dom element
        if(!(id = el.id)){
            id = Ext.id(el);
        }
        if(ex = El.cache[id]){
            ex.dom = el;
        }else{
            ex = El.cache[id] = new El(el);
        }
        return ex;
    } else if (el instanceof El) {
        if(el != docEl){
            el.dom = DOC.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
                                                          // catch case where it hasn't been appended
            El.cache[el.id] = el; // in case it was created directly with Element(), let's cache it
        }
        return el;
    } else if(el.isComposite) {
        return el;
    } else if(Ext.isArray(el)) {
        return El.select(el);
    } else if(el == DOC) {
        // create a bogus element object representing the document object
        if(!docEl){
            var f = function(){};
            f.prototype = El.prototype;
            docEl = new f();
            docEl.dom = DOC;
        }
        return docEl;
    }
    return null;
};

// private
// Garbage collection - uncache elements/purge listeners on orphaned elements
// so we don't hold a reference and cause the browser to retain them
function garbageCollect(){
    if(!Ext.enableGarbageCollector){
        clearInterval(El.collectorThread);
    } else {
	    var eid,
	    	el,
	    	d;

	    for(eid in El.cache){
	        el = El.cache[eid];
	        d = el.dom;
	        // -------------------------------------------------------
	        // Determining what is garbage:
	        // -------------------------------------------------------
	        // !d
	        // dom node is null, definitely garbage
	        // -------------------------------------------------------
	        // !d.parentNode
	        // no parentNode == direct orphan, definitely garbage
	        // -------------------------------------------------------
	        // !d.offsetParent && !document.getElementById(eid)
	        // display none elements have no offsetParent so we will
	        // also try to look it up by it's id. However, check
	        // offsetParent first so we don't do unneeded lookups.
	        // This enables collection of elements that are not orphans
	        // directly, but somewhere up the line they have an orphan
	        // parent.
	        // -------------------------------------------------------
	        if(!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))){
	            delete El.cache[eid];
	            if(d && Ext.enableListenerCollection){
	                Ext.EventManager.removeAll(d);
	            }
	        }
	    }
    }
}
El.collectorThreadId = setInterval(garbageCollect, 30000);

var flyFn = function(){};
flyFn.prototype = El.prototype;

// dom is optional
El.Flyweight = function(dom){
    this.dom = dom;
};

El.Flyweight.prototype = new flyFn();
El.Flyweight.prototype.isFlyweight = true;
El._flyweights = {};


El.fly = function(el, named){
    var ret = null;
	named = named || '_global';

    if (el = Ext.getDom(el)) {
    	(El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
    	ret = El._flyweights[named];
	}
	return ret;
};


Ext.get = El.get;


Ext.fly = El.fly;

// speedy lookup for elements never to box adjust
var noBoxAdjust = Ext.isStrict ? {
    select:1
} : {
    input:1, select:1, textarea:1
};
if(Ext.isIE || Ext.isGecko){
    noBoxAdjust['button'] = 1;
}


Ext.EventManager.on(window, 'unload', function(){
    delete El.cache;
    delete El._flyweights;
});
})();


Ext.Element.addMethods({
    
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != "object" || Ext.isArray(key)){
            config = {
                key: key,
                fn: fn,
                scope: scope
            };
        }else{
            config = {
                key : key.key,
                shift : key.shift,
                ctrl : key.ctrl,
                alt : key.alt,
                fn: fn,
                scope: scope
            };
        }
        return new Ext.KeyMap(this, config);
    },

    
    addKeyMap : function(config){
        return new Ext.KeyMap(this, config);
    }
});

Ext.apply(Ext.Element.prototype, function() {
	var GETDOM = Ext.getDom,
		GET = Ext.get,
		DH = Ext.DomHelper;
	
	return {	
		
	    insertSibling: function(el, where, returnDom){
	        var me = this,
	        	rt;
	        	
	        if(Ext.isArray(el)){            
	            Ext.each(el, function(e) {
		            rt = me.insertSibling(e, where, returnDom);
	            });
	            return rt;
	        }
	                
	        where = (where || 'before').toLowerCase();
	        el = el || {};
	       	
	        if (Ext.isObject(el) && !el.nodeType && !el.dom) { // dh config
	            if (where == 'after' && !me.dom.nextSibling) {
	                rt = DH.append(me.dom.parentNode, el, !returnDom);
	            } else {		            
		            rt = DH[where == 'after' ? 'insertAfter' : 'insertBefore'](me.dom, el, !returnDom);
	            }
	        } else {
	            rt = me.dom.parentNode.insertBefore(GETDOM(el), where == 'before' ? me.dom : me.dom.nextSibling);
	            if (!returnDom) {
	                rt = GET(rt);
	            }
	        }
	        return rt;
	    }
    }
}());

Ext.Element.addMethods(
function() {
	var GETDOM = Ext.getDom,
		GET = Ext.get,
		DH = Ext.DomHelper;
	
	return {
	    
	    appendChild: function(el){        
	        return GET(el).appendTo(this);        
	    },
	
	    
	    appendTo: function(el){        
	        GETDOM(el).appendChild(this.dom);        
	        return this;
	    },
	
	    
	    insertBefore: function(el){  	          
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el);
	        return this;
	    },
	
	    
	    insertAfter: function(el){
	        GETDOM(el).parentNode.insertBefore(this.dom, el.nextSibling);
	        return this;
	    },
	
	    
	    insertFirst: function(el, returnDom){
	        el = el || {};
	        if (Ext.isObject(el) && !el.nodeType && !el.dom) { // dh config
	            return this.createChild(el, this.dom.firstChild, returnDom);
	        } else {
	            el = GETDOM(el);
	            this.dom.insertBefore(el, this.dom.firstChild);
	            return !returnDom ? GET(el) : el;
	        }
	    },
	
	    
	    replace: function(el){
	        el = GET(el);
	        this.insertBefore(el);
	        el.remove();
	        return this;
	    },
	
	    
	    replaceWith: function(el){
		    var me = this,
		    	Element = Ext.Element;
	        if (Ext.isObject(el) && !el.nodeType && !el.dom){ // dh config	            
	            el = DH.insertBefore(me.dom, el);
	        } else {
	            el = GETDOM(el);
	            me.dom.parentNode.insertBefore(el, me.dom);
	        }
	        
	        delete El.cache[me.id];
	        Ext.removeNode(me.dom);      
	        me.id = Ext.id(me.dom = el);
	        return Element.cache[me.id] = me;        
	    },
	    
		
		createChild: function(config, insertBefore, returnDom){
		    config = config || {tag:'div'};
		    return insertBefore ? 
		    	   DH.insertBefore(insertBefore, config, returnDom !== true) :	
		    	   DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
		},
		
		
		wrap: function(config, returnDom){        
		    var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
		    newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
		    return newEl;
		},
		
		
		insertHtml : function(where, html, returnEl){
		    var el = DH.insertHtml(where, this.dom, html);
		    return returnEl ? Ext.get(el) : el;
		}
	}
}());

Ext.Element.addMethods({
    
    getAnchorXY : function(anchor, local, s){
        //Passing a different size is useful for pre-calculating anchors,
        //especially for anchored animations that change the el size.
		anchor = (anchor || "tl").toLowerCase();
        s = s || {};
        
        var me = this,        
        	vp = me.dom == document.body || me.dom == document,
        	w = s.width || vp ? Ext.lib.Dom.getViewWidth() : me.getWidth(),
        	h = s.height || vp ? Ext.lib.Dom.getViewHeight() : me.getHeight(),         	        	
        	xy,       	
        	r = Math.round,
        	o = me.getXY(),
        	scroll = me.getScroll(),
        	extraX = vp ? scroll.left : !local ? o[0] : 0,
        	extraY = vp ? scroll.top : !local ? o[1] : 0,
        	hash = {
	        	c  : [r(w * .5), r(h * .5)],
	        	t  : [r(w * .5), 0],
	        	l  : [0, r(h * .5)],
	        	r  : [w, r(h * .5)],
	        	b  : [r(w * .5), h],
	        	tl : [0, 0],	
	        	bl : [0, h],
	        	br : [w, h],
	        	tr : [w, 0]
        	};
        
        xy = hash[anchor];	
        return [xy[0] + extraX, xy[1] + extraY]; 
    },

    
    anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback){        
	    var me = this;
	    
	    function action(){
            this.alignTo(el, alignment, offsets, animate);
            Ext.callback(callback, this);
        };
        
        Ext.EventManager.onWindowResize(action, me);
        
        if(!Ext.isEmpty(monitorScroll)){
            Ext.EventManager.on(window, 'scroll', action, me,
                {buffer: !isNaN(monitorScroll) ? monitorScroll : 50});
        }
        action.call(me); // align immediately
        return me;
    },

    
    getAlignToXY : function(el, p, o){	    
        el = Ext.get(el);
        
        if(!el || !el.dom){
            throw "Element.alignToXY with an element that doesn't exist";
        }
        
        o = o || [0,0];
        p = (p == "?" ? "tl-bl?" : (!/-/.test(p) && p != "" ? "tl-" + p : p || "tl-bl")).toLowerCase();;       
                
        var me = this,
        	d = me.dom,
        	a1,
        	a2,
        	x,
        	y,
        	//constrain the aligned el to viewport if necessary
        	w,
        	h,
        	r,
        	dw = Ext.lib.Dom.getViewWidth() -10, // 10px of margin for ie
        	dh = Ext.lib.Dom.getViewHeight()-10, // 10px of margin for ie
        	p1y,
        	p1x,        	
        	p2y,
        	p2x,
        	swapY,
        	swapX,
        	doc = document,
        	docElement = doc.documentElement,
        	docBody = doc.body,
        	scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0)+5,
        	scrollY = (docElement.scrollTop || docBody.scrollTop || 0)+5,
        	c = false, //constrain to viewport
        	p1 = "", 
        	p2 = "",
        	m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/)
        
        if(!m){
           throw "Element.alignTo with an invalid alignment " + p;
        }
        
        p1 = m[1]; 
        p2 = m[2]; 
        c = !!m[3];

        //Subtract the aligned el's internal xy from the target's offset xy
        //plus custom offset to get the aligned el's new offset xy
        a1 = me.getAnchorXY(p1, true);
        a2 = el.getAnchorXY(p2, false);

        x = a2[0] - a1[0] + o[0];
        y = a2[1] - a1[1] + o[1];

        if(c){    
	       w = me.getWidth();
           h = me.getHeight();
           r = el.getRegion();       
           //If we are at a viewport boundary and the aligned el is anchored on a target border that is
           //perpendicular to the vp border, allow the aligned el to slide on that border,
           //otherwise swap the aligned el to the opposite border of the target.
           p1y = p1.charAt(0);
           p1x = p1.charAt(p1.length-1);
           p2y = p2.charAt(0);
           p2x = p2.charAt(p2.length-1);
           swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
           swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));          
           

           if (x + w > dw + scrollX) {
                x = swapX ? r.left-w : dw+scrollX-w;
           }
           if (x < scrollX) {
               x = swapX ? r.right : scrollX;
           }
           if (y + h > dh + scrollY) {
                y = swapY ? r.top-h : dh+scrollY-h;
            }
           if (y < scrollY){
               y = swapY ? r.bottom : scrollY;
           }
        }
        return [x,y];
    },

    
    alignTo : function(element, position, offsets, animate){
	    var me = this;
        return me.setXY(me.getAlignToXY(element, position, offsets),
          		        me.preanim && !!animate ? me.preanim(arguments, 3) : false);
    },
    
    // private ==>  used outside of core
    adjustForConstraints : function(xy, parent, offsets){
        return this.getConstrainToXY(parent || document, false, offsets, xy) ||  xy;
    },

    // private ==>  used outside of core
    getConstrainToXY : function(el, local, offsets, proposedXY){   
	    var os = {top:0, left:0, bottom:0, right: 0};

        return function(el, local, offsets, proposedXY){
            el = Ext.get(el);
            offsets = offsets ? Ext.applyIf(offsets, os) : os;

            var vw, vh, vx = 0, vy = 0;
            if(el.dom == document.body || el.dom == document){
                vw =Ext.lib.Dom.getViewWidth();
                vh = Ext.lib.Dom.getViewHeight();
            }else{
                vw = el.dom.clientWidth;
                vh = el.dom.clientHeight;
                if(!local){
                    var vxy = el.getXY();
                    vx = vxy[0];
                    vy = vxy[1];
                }
            }

            var s = el.getScroll();

            vx += offsets.left + s.left;
            vy += offsets.top + s.top;

            vw -= offsets.right;
            vh -= offsets.bottom;

            var vr = vx+vw;
            var vb = vy+vh;

            var xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]);
            var x = xy[0], y = xy[1];
            var w = this.dom.offsetWidth, h = this.dom.offsetHeight;

            // only move it if it needs it
            var moved = false;

            // first validate right/bottom
            if((x + w) > vr){
                x = vr - w;
                moved = true;
            }
            if((y + h) > vb){
                y = vb - h;
                moved = true;
            }
            // then make sure top/left isn't negative
            if(x < vx){
                x = vx;
                moved = true;
            }
            if(y < vy){
                y = vy;
                moved = true;
            }
            return moved ? [x, y] : false;
        };
    }(),
	    
	    
	        
//         el = Ext.get(el);
//         offsets = Ext.applyIf(offsets || {}, {top : 0, left : 0, bottom : 0, right : 0});

//         var	me = this,
//         	doc = document,
//         	s = el.getScroll(),
//         	vxy = el.getXY(),
//         	vx = offsets.left + s.left, 
//         	vy = offsets.top + s.top,            	
//         	vw = -offsets.right, 
//         	vh = -offsets.bottom, 
//         	vr,
//         	vb,
//         	xy = proposedXY || (!local ? me.getXY() : [me.getLeft(true), me.getTop(true)]),
//         	x = xy[0],
//         	y = xy[1],
//         	w = me.dom.offsetWidth, h = me.dom.offsetHeight,
//         	moved = false; // only move it if it needs it
//       
//         	
//         if(el.dom == doc.body || el.dom == doc){
//             vw += Ext.lib.Dom.getViewWidth();
//             vh += Ext.lib.Dom.getViewHeight();
//         }else{
//             vw += el.dom.clientWidth;
//             vh += el.dom.clientHeight;
//             if(!local){                    
//                 vx += vxy[0];
//                 vy += vxy[1];
//             }
//         }

//         // first validate right/bottom
//         if(x + w > vx + vw){
//             x = vx + vw - w;
//             moved = true;
//         }
//         if(y + h > vy + vh){
//             y = vy + vh - h;
//             moved = true;
//         }
//         // then make sure top/left isn't negative
//         if(x < vx){
//             x = vx;
//             moved = true;
//         }
//         if(y < vy){
//             y = vy;
//             moved = true;
//         }
//         return moved ? [x, y] : false;
//    },
    
    
    getCenterXY : function(){
        return this.getAlignToXY(document, 'c-c');
    },

    
    center : function(centerIn){
        return this.alignTo(centerIn || document, 'c-c');        
    }    
});


Ext.Element.addMethods(function(){	
	// local style camelizing for speed
	var propCache = {},
		camelRe = /(-[a-z])/gi,
		classReCache = {},
		view = document.defaultView,
		EL = Ext.Element,	
		PADDING = "padding",
		MARGIN = "margin",
		BORDER = "border",
		LEFT = "-left",
		RIGHT = "-right",
		TOP = "-top",
		BOTTOM = "-bottom",
		WIDTH = "-width",		
		// special markup used throughout Ext when box wrapping elements	
		borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
		paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
		margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM};
		
	
	// private	
	function camelFn(m, a) {
		return a.charAt(1).toUpperCase();
	}
	
	// private (needs to be called => addStyles.call(this, sides, styles))
	function addStyles(sides, styles){
	    var val = 0;    
	    
	    Ext.each(sides.match(/\w/g), function(s) {
			if (s = parseInt(this.getStyle(styles[s]), 10)) {
				val += Math.abs(s);	     
			}
	    },
	    this);
	    return val;
	}

	function chkCache(prop) {
		return propCache[prop] || (propCache[prop] = prop.replace(camelRe, camelFn))
    }
	    
		    
		    
	return {	
		// private  ==> used by Fx  
		adjustWidth : function(width) {
			var me = this;	    
	        if(typeof width == "number" && me.autoBoxAdjust && !me.isBorderBox()){
	           width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
	           width = width < 0 ? 0 : width;
	        }
		    return width;
		},
		
		// private   ==> used by Fx 
		adjustHeight : function(height) {
			var me = this;	    
			if(typeof height == "number" && me.autoBoxAdjust && !me.isBorderBox()){
	           height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
	           height = height < 0 ? 0 : height;
	        }
		    return height;
		},
	
	
		
	    addClass : function(className){
		    var me = this;
		    Ext.each(className, function(v) {
				me.dom.className += (!me.hasClass(v) && v ? " " + v : "");  
		    });
	        return me;
	    },
	
	    
	    radioClass : function(className){
		    Ext.each(this.dom.parentNode.childNodes, function(v) {
				if(v.nodeType == 1) {
					Ext.get(v).removeClass(className);		    
				}
		    });
		    return this.addClass(className);
	    },
	
	    
	    removeClass : function(className){
		    var me = this;
		    if (me.dom.className) {
				Ext.each(className, function(v) {				
					me.dom.className = me.dom.className.replace(
						classReCache[v] = classReCache[v] || new RegExp('(?:^|\\s+)' + v + '(?:\\s+|$)', "g"), 
						" ");				
				});    
		    }
		    return me;
	    },
	
	    
	    toggleClass : function(className){
		    return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	    },
	
	    
	    hasClass : function(className){
	        return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
	    },
	
	    
	    replaceClass : function(oldClassName, newClassName){
	        return this.removeClass(oldClassName).addClass(newClassName);
	    },
	    
	    isStyle : function(style, val) {
// 		    var ret = false;
// 		    style = this.getStyle(style);
// 		    Ext.each(Ext.toArray(arguments,1),function(s){
// 			    if(style == s) return false; // stop iterating.
// 		    });
// 		    return ret;
			return this.getStyle(style) == val;  
	    },
	
	    
	    getStyle : function(){		   
	        return view && view.getComputedStyle ?
	            function(prop){
	                var el = this.dom,
	                	v,                  
	                	cs;
	                if(el == document) return null;
	                prop = prop == 'float' ? 'cssFloat' : prop;
					return (v = el.style[prop]) ? v : 
						   (cs = view.getComputedStyle(el, "")) ? cs[chkCache(prop)] : null;
	            } :
	            function(prop){      
		            var el = this.dom, 
			        	m, 
			        	cs;     
			        	
			        if(el == document) return null;	     
	                if (prop == 'opacity') {
	                    if (el.style.filter.match) {                       
	                        if(m = el.style.filter.match(/alpha\(opacity=(.*)\)/i)){
	                            var fv = parseFloat(m[1]);
	                            if(!isNaN(fv)){
	                                return fv ? fv / 100 : 0;
	                            }
	                        }
	                    }
	                    return 1;
	                }
	                prop = prop == 'float' ? 'styleFloat' : prop;	
	                return el.style[prop] || ((cs = el.currentStyle) ? cs[chkCache(prop)] : null);
	            };
	    }(),
	    
	    
	    getColor : function(attr, defaultValue, prefix){
	        var v = this.getStyle(attr),
	        	color = prefix || "#";
	        
     	    if(!v || v == "transparent" || v == "inherit") {
	            return defaultValue;
	        }	          
	        if (/^r/.test(v)) {		        
		        Ext.each(v.slice(4, v.length -1).split(","), function(s) {
			        h = (s * 1).toString(16);
			   		color += h < 16 ? "0" + h : h;
		        });
			} else {
				color += v.replace("#","").replace(/^(\w)(\w)(\w)$/, "$1$1$2$2$3$3");
			} 	        
	        return color.length > 5 ? color.toLowerCase() : defaultValue;
	    },
	
	    
	    setStyle : function(prop, value){
		    var tmp, 
		    	style,
                camel;
		    if (!Ext.isObject(prop)) {
			  	tmp = {};
			  	tmp[prop] = value;		  	
			  	prop = tmp;
		    }
		    for (style in prop) {
			    value = prop[style];		    
			    camel = chkCache(style);
                camel == 'opacity' ? 
                    this.setOpacity(value) : 
                    this.dom.style[camel] = value;
		    }
		    return this;
	    },
	    
	    
	     setOpacity : function(opacity, animate){
		    var me = this,
		    	s = me.dom.style; 
	        if(!animate || !me.anim){            
	            if (Ext.isIE) {
	                s.zoom = 1;
	                s.filter = (s.filter || '').replace(/alpha\([^\)]*\)/gi,"") +
	                           (opacity == 1 ? "" : " alpha(opacity=" + opacity * 100 + ")");
	            } else {
	                s.opacity = opacity;
	            }
	        }else{
	            me.anim({opacity: {to: opacity}}, me.preanim(arguments, 1), null, .35, 'easeIn');
	        }
	        return me;
	    },
	    
	    
	    clearOpacity : function(){
		    var style = this.dom.style;
	        if (window.ActiveXObject) {
	            if(typeof style.filter == 'string' && (/alpha/i).test(style.filter)){
	                style.filter = "";
	            }
	        } else {
	            style.opacity = "";
	            style["-moz-opacity"] = "";
	            style["-khtml-opacity"] = "";
	        }
	        return this;
	    },
	
	    
	    getHeight : function(contentHeight){
	        var h = this.dom.offsetHeight || 0;
	        h = !contentHeight ? h : h - this.getBorderWidth("tb") - this.getPadding("tb");
	        return h < 0 ? 0 : h;
	    },
	
	    
	    getWidth : function(contentWidth){
	        var w = this.dom.offsetWidth || 0;
	        w = !contentWidth ? w : w - this.getBorderWidth("lr") - this.getPadding("lr");
	        return w < 0 ? 0 : w;
	    },
	
	    
	    setWidth : function(width, animate){
		    var me = this;
	        width = me.adjustWidth(width);
	        !animate || !me.anim ? 
	        	me.dom.style.width = me.addUnits(width) :
	        	me.anim({width : {to : width}}, me.preanim(arguments, 1));
	        return me;
	    },
	
	    
	     setHeight : function(height, animate){
		    var me = this;
	        height = me.adjustHeight(height);
	        !animate || !me.anim ? 
	        	me.dom.style.height = me.addUnits(height) :
	        	me.anim({height : {to : height}}, me.preanim(arguments, 1));
	        return me;
	    },
	    
	    
	    getBorderWidth : function(side){
	        return addStyles.call(this, side, borders);
	    },
	
	    
	    getPadding : function(side){
	        return addStyles.call(this, side, paddings);
	    },
	
	    
	    clip : function(){
		    var me = this;
	        if(!me.isClipped){
	           me.isClipped = true;
	           me.originalClip = {
	               o: me.getStyle("overflow"),
	               x: me.getStyle("overflow-x"),
	               y: me.getStyle("overflow-y")
	           };
	           me.setStyle("overflow", "hidden");
	           me.setStyle("overflow-x", "hidden");
	           me.setStyle("overflow-y", "hidden");
	        }
	        return me;
	    },
	
	    
	    unclip : function(){
		    var me = this;
	        if(me.isClipped){
	            me.isClipped = false;
	            var o = me.originalClip;
	            if(o.o){me.setStyle("overflow", o.o);}
	            if(o.x){me.setStyle("overflow-x", o.x);}
	            if(o.y){me.setStyle("overflow-y", o.y);}
	        }
	        return me;
	    },
	    
	    addStyles : addStyles,
	    margins : margins
	}
}()		    
);

(function(){
var D = Ext.lib.Dom;

function animTest(args, animate, i) {
	return this.preanim && !!animate ? this.preanim(args, i) : false	
}

Ext.Element.addMethods({
	
    getX : function(){
        return D.getX(this.dom);
    },

    
    getY : function(){
        return D.getY(this.dom);
    },

    
    getXY : function(){
        return D.getXY(this.dom);
    },

    
    getOffsetsTo : function(el){
        var o = this.getXY(),
        	e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    
    setX : function(x, animate){	    
	    return this.setXY([x, this.getY()], animTest.call(this, arguments, animate, 1));
    },

    
    setY : function(y, animate){	    
	    return this.setXY([this.getX(), y], animTest.call(this, arguments, animate, 1));
    },

    
    setLeft : function(left){
        this.setStyle("left", this.addUnits(left));
        return this;
    },

    
    setTop : function(top){
        this.setStyle("top", this.addUnits(top));
        return this;
    },

    
    setRight : function(right){
        this.setStyle("right", this.addUnits(right));
        return this;
    },

    
    setBottom : function(bottom){
        this.setStyle("bottom", this.addUnits(bottom));
        return this;
    },

    
    setXY : function(pos, animate){
	    var me = this;
        if(!animate || !me.anim){
            D.setXY(me.dom, pos);
        }else{
            me.anim({points: {to: pos}}, me.preanim(arguments, 1), 'motion');
        }
        return me;
    },

    
    setLocation : function(x, y, animate){
        return this.setXY([x, y], animTest.call(this, arguments, animate, 2));
    },

    
    moveTo : function(x, y, animate){
        return this.setXY([x, y], animTest.call(this, arguments, animate, 2));        
    },    
    
    
    getLeft : function(local){
	    return !local ? this.getX() : parseInt(this.getStyle("left"), 10) || 0;
    },

    
    getRight : function(local){
	    var me = this;
	    return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
    },

    
    getTop : function(local) {
	    return !local ? this.getY() : parseInt(this.getStyle("top"), 10) || 0;
    },

    
    getBottom : function(local){
	    var me = this;
	    return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
    },

    
    position : function(pos, zIndex, x, y){
	    var me = this;
	    
        if(!pos && me.isStyle('position', 'static')){           
            me.setStyle('position', 'relative');           
        } else if(pos) {
            me.setStyle("position", pos);
        }
        if(zIndex){
            me.setStyle("z-index", zIndex);
        }
        if(x || y) me.setXY([x || false, y || false]);
    },

    
    clearPositioning : function(value){
        value = value || '';
        this.setStyle({
            left : value,
            right : value,
            top : value,
            bottom : value,
            "z-index" : "",
            position : "static"
        });
        return this;
    },

    
    getPositioning : function(){
	    var me = this;
        function gs(pos) {
	    	return me.getStyle(pos);    
        }
        
        var l = gs("left"),
        	t = gs("top");

        return {
            position : gs("position"),
            left : l,
            right : l ? "" : gs("right"),
            top : t,
            bottom : t ? "" : gs("bottom"),
            "z-index" : gs("z-index")
        };
    },
    
    
    setPositioning : function(pc){
	    var me = this,
	    	style = me.dom.style;
	    	
        me.setStyle(pc);
        
        if(pc.right == "auto"){
            style.right = "";
        }
        if(pc.bottom == "auto"){
            style.bottom = "";
        }
        
        return me;
    },    
	
    
    translatePoints : function(x, y){        	     
	    y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];
        var me = this,
        	relative = me.isStyle('position', "relative"),
        	o = me.getXY(),
        	l = parseInt(me.getStyle('left'), 10),
        	t = parseInt(me.getStyle('top'), 10);
        
        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);        

        return {left: (x - o[0] + l), top: (y - o[1] + t)}; 
    },
    
    animTest : animTest
});
})();

Ext.Element.addMethods(function(){
	var PARENTNODE = 'parentNode',
		NEXTSIBLING = 'nextSibling',
		PREVIOUSSIBLING = 'previousSibling',
		DQ = Ext.DomQuery,
		GET = Ext.get;
	
	return {
		
	    findParent : function(simpleSelector, maxDepth, returnEl){
	        var p = this.dom,
	        	b = document.body, 
	        	depth = 0, 	        	
	        	stopEl;
	        	
	        maxDepth = maxDepth || 50;
	        if (isNaN(maxDepth)) {
	            stopEl = Ext.getDom(maxDepth);
	            maxDepth = 10;
	        }
	        while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
	            if(DQ.is(p, simpleSelector)){
	                return returnEl ? GET(p) : p;
	            }
	            depth++;
	            p = p.parentNode;
	        }
	        return null;
	    },
	
	    
	    findParentNode : function(simpleSelector, maxDepth, returnEl){
	        var p = Ext.fly(this.dom.parentNode, '_internal');
	        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
	    },
	
	    
	    up : function(simpleSelector, maxDepth){
	        return this.findParentNode(simpleSelector, maxDepth, true);
	    },
	
	    
	    select : function(selector, unique){
	        return Ext.Element.select(selector, unique, this.dom);
	    },
	
	    
	    query : function(selector, unique){
	        return DQ.select(selector, this.dom);
	    },
	
	    
	    child : function(selector, returnDom){
	        var n = DQ.selectNode(selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
	    
	    down : function(selector, returnDom){
	        var n = DQ.selectNode(" > " + selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
		 
	    parent : function(selector, returnDom){
	        return this.matchNode(PARENTNODE, PARENTNODE, selector, returnDom);
	    },
	
	     
	    next : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, NEXTSIBLING, selector, returnDom);
	    },
	
	    
	    prev : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, PREVIOUSSIBLING, selector, returnDom);
	    },
	
	
	    
	    first : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, 'firstChild', selector, returnDom);
	    },
	
	    
	    last : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, 'lastChild', selector, returnDom);
	    },
	    
	    matchNode : function(dir, start, selector, returnDom){
	        var n = this.dom[start];
	        while(n){
	            if(n.nodeType == 1 && (!selector || DQ.is(n, selector))){
	                return !returnDom ? GET(n) : n;
	            }
	            n = n[dir];
	        }
	        return null;
	    }	
    }
}());

Ext.Element.addMethods({
    
    setBox : function(box, adjust, animate){
        var me = this,
        	w = box.width, 
        	h = box.height;
        if((adjust && !me.autoBoxAdjust) && !me.isBorderBox()){
           w -= (me.getBorderWidth("lr") + me.getPadding("lr"));
           h -= (me.getBorderWidth("tb") + me.getPadding("tb"));
        }
        me.setBounds(box.x, box.y, w, h, me.animTest.call(me, arguments, animate, 2));
        return me;
    },
    
    
	getBox : function(contentBox, local) {	    
	    var me = this,
        	xy,
        	left,
        	top,
        	getBorderWidth = me.getBorderWidth,
        	getPadding = me.getPadding, 
        	l,
        	r,
        	t,
        	b;
        if(!local){
            xy = me.getXY();
        }else{
            left = parseInt(me.getStyle("left"), 10) || 0;
            top = parseInt(me.getStyle("top"), 10) || 0;
            xy = [left, top];
        }
        var el = me.dom, w = el.offsetWidth, h = el.offsetHeight, bx;
        if(!contentBox){
            bx = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: w, height: h};
        }else{
            l = getBorderWidth.call(me, "l") + getPadding.call(me, "l");
            r = getBorderWidth.call(me, "r") + getPadding.call(me, "r");
            t = getBorderWidth.call(me, "t") + getPadding.call(me, "t");
            b = getBorderWidth.call(me, "b") + getPadding.call(me, "b");
            bx = {x: xy[0]+l, y: xy[1]+t, 0: xy[0]+l, 1: xy[1]+t, width: w-(l+r), height: h-(t+b)};
        }
        bx.right = bx.x + bx.width;
        bx.bottom = bx.y + bx.height;
        return bx;
	},
	
    
     move : function(direction, distance, animate){
        var me = this,        	
        	xy = me.getXY(),
        	x = xy[0],
        	y = xy[1],        	
        	left = [x - distance, y],
        	right = [x + distance, y],
        	top = [x, y - distance],
        	bottom = [x, y + distance],
	       	hash = {
	        	l :	left,
	        	left : left,
	        	r : right,
	        	right : right,
	        	t : top,
	        	top : top,
	        	up : top,
	        	b : bottom, 
	        	bottom : bottom,
	        	down : bottom	        		
	        };
        
 	    direction = direction.toLowerCase();    
 	    me.moveTo(hash[direction][0], hash[direction][1], me.animTest.call(me, arguments, animate, 1));
    },
    
    
     setLeftTop : function(left, top){
	    var me = this,
	    	style = me.dom.style;
        style.left = me.addUnits(left);
        style.top = me.addUnits(top);
        return me;
    },
    
    
    getRegion : function(){
        return Ext.lib.Dom.getRegion(this.dom);
    },
    
    
    setBounds : function(x, y, width, height, animate){
	    var me = this;
        if (!animate || !me.anim) {
            me.setSize(width, height);
            me.setLocation(x, y);
        } else {
            me.anim({points: {to: [x, y]}, 
            		 width: {to: me.adjustWidth(width)}, 
            		 height: {to: me.adjustHeight(height)}},
                     me.preanim(arguments, 4), 
                     'motion');
        }
        return me;
    },

    
    setRegion : function(region, animate) {
        return this.setBounds(region.left, region.top, region.right-region.left, region.bottom-region.top, this.animTest.call(this, arguments, animate, 1));
    }
});

Ext.Element.addMethods({
    
    isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    
    scrollTo : function(side, value){
        this.dom["scroll" + (/top/i.test(side) ? "Top" : "Left")] = value;        
        return this;
    },
    
    
    getScroll : function(){
        var d = this.dom, 
        	doc = document,
        	body = doc.body,
        	docElement = doc.documentElement,
        	l,
        	t,
        	ret;
        	
        if(d == doc || d == body){            
            if(Ext.isIE && Ext.isStrict){
                l = docElement.scrollLeft; 
                t = docElement.scrollTop;
            }else{
                l = window.pageXOffset;
                t = window.pageYOffset;
            }            
            ret = {left: l || (body ? body.scrollLeft : 0), top: t || (body ? body.scrollTop : 0)};
        }else{
            ret = {left: d.scrollLeft, top: d.scrollTop};
        }
        return ret;
    }
});

Ext.Element.VISIBILITY = 1;

Ext.Element.DISPLAY = 2;

Ext.Element.addMethods(function(){
	var VISIBILITY = "visibility",
		DISPLAY = "display",
		HIDDEN = "hidden",
		NONE = "none",		
		ELDISPLAY = Ext.Element.DISPLAY;
	
	return {
		
	    originalDisplay : "",
	    visibilityMode : 1,
	    
	    
	    setVisibilityMode : function(visMode){	  
	        this.visibilityMode = visMode;
	        return this;
	    },
	    
	    
	    animate : function(args, duration, onComplete, easing, animType){	    
	        this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
	        return this;
	    },
	
	    
	    anim : function(args, opt, animType, defaultDur, defaultEase, cb){
	        animType = animType || 'run';
	        opt = opt || {};
	        var me = this,	        	
	        	anim = Ext.lib.Anim[animType](
		            me.dom, 
		            args,
		            (opt.duration || defaultDur) || .35,
		            (opt.easing || defaultEase) || 'easeOut',
		            function(){
			            if(cb) cb.call(me);
			            if(opt.callback) opt.callback.call(opt.scope || me, me, opt);
		            },
		            me
		        );
	        opt.anim = anim;
	        return anim;
	    },
	
	    // private legacy anim prep
	    preanim : function(a, i){
	        return !a[i] ? false : (Ext.isObject(a[i]) ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
	    },
	    
	    
	    isVisible : function(deep) {
	        return !this.isStyle(VISIBILITY, HIDDEN) || !this.isStyle(DISPLAY, NONE);	        
	    },
	    
	    
	     setVisible : function(visible, animate){
		    var me = this,
	            visMode = me.visibilityMode;
	            
	        if (!animate || !me.anim) {
	            if (me.visibilityMode == ELDISPLAY) {
	                me.setDisplayed(visible);
	            } else {
	                me.fixDisplay();
	                me.dom.style.visibility = visible ? "visible" : HIDDEN;
	            }
	        } else {
	            // closure for composites            
	            if(visible){
	                me.setOpacity(.01);
	                me.setVisible(true);
	            }
	            me.anim({opacity: { to: (visible?1:0) }},
	                    me.preanim(arguments, 1),
	                    null,
	                    .35,
	                    'easeIn',
	                    function(){
		                     if(!visible){
			                     if (visMode == ELDISPLAY) {
		                         	style.display = NONE;
	                         	 } else {
		                         	style.visibility = HIDDEN;
	                         	 }	                         
		                         Ext.get(me.dom).setOpacity(1);
		                     }
	                 	});
	        }
	        return me;
	    },
	
	    
	    toggle : function(animate){
		    var me = this;
	        me.setVisible(!me.isVisible(), me.preanim(arguments, 0));
	        return me;
	    },
	
	    
	    setDisplayed : function(value) {		    
		    if(typeof value == "boolean"){
	           value = value ? this.originalDisplay : NONE;
	        }
	        this.setStyle(DISPLAY, value);
	        return this;
	    },
	    
	    // private
	    fixDisplay : function(){
		    var me = this;
	        if(me.isStyle(DISPLAY, NONE)){
	            me.setStyle(VISIBILITY, HIDDEN);
	            me.setStyle(DISPLAY, me.originalDisplay); // first try reverting to default
	            if(me.isStyle(DISPLAY, NONE)){ // if that fails, default to block
	                me.setStyle(DISPLAY, "block");
	            }
	        }
	    },
	
	    
	    hide : function(animate){
		    this.setVisible(false, this.preanim(arguments, 0));
	        return this;
	    },
	
	    
	    show : function(animate){
		    this.setVisible(true, this.preanim(arguments, 0));
	        return this;
	    }
	}
}());

Ext.Element.addMethods(
function(){
    var VISIBILITY = "visibility",
        DISPLAY = "display",
        HIDDEN = "hidden",
        NONE = "none",
	    XMASKED = "x-masked",
		XMASKEDRELATIVE = "x-masked-relative";
		
	return {
		
	    isVisible : function(deep) {
	        var vis = !(this.isStyle(VISIBILITY,HIDDEN) || this.isStyle(DISPLAY,NONE)),
	        	p = this.dom.parentNode;;
	        if(deep !== true || !vis){
	            return vis;
	        }	        
	        while(p && !/body/i.test(p.tagName)){
	            if(!Ext.fly(p, '_isVisible').isVisible()){
	                return false;
	            }
	            p = p.parentNode;
	        }
	        return true;
	    },
	    
	    
	    isDisplayed : function() {
	        return !this.isStyle(DISPLAY, NONE);
	    },
	    
		
	    enableDisplayMode : function(display){	    
	        this.setVisibilityMode(Ext.Element.DISPLAY);
	        if(!Ext.isEmpty(display)) this.originalDisplay = display;
	        return this;
	    },
	    
		
	    mask : function(msg, msgCls){
		    var me = this,
		    	dom = me.dom,
		    	dh = Ext.DomHelper,
		    	EXTELMASKMSG = "ext-el-mask-msg";
		    	
	        if(me.getStyle("position") == "static"){
	            me.addClass(XMASKEDRELATIVE);
	        }
	        if(me._maskMsg){
	            me._maskMsg.remove();
	        }
	        if(me._mask){
	            me._mask.remove();
	        }
	
	        me._mask = dh.append(dom, {cls : "ext-el-mask"}, true);
	
	        me.addClass(XMASKED);
	        me._mask.setDisplayed(true);
	        if(typeof msg == 'string'){
	            me._maskMsg = dh.append(dom, {cls : EXTELMASKMSG, cn:{tag:'div'}}, true);
	            var mm = me._maskMsg;
	            mm.dom.className = msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG;
	            mm.dom.firstChild.innerHTML = msg;
	            mm.setDisplayed(true);
	            mm.center(me);
	        }
	        if(Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && me.getStyle('height') == 'auto'){ // ie will not expand full height automatically
	            me._mask.setSize(dom.clientWidth, me.getHeight());
	        }
	        return me._mask;
	    },
	
	    
	    unmask : function(){
		    var me = this,
		    	mask = me._mask,
		    	maskMsg = me._maskMsg;
	        if(mask){
	            if(maskMsg){
	                maskMsg.remove();
	                delete me._maskMsg;
	            }
	            mask.remove();
	            delete me._mask;
	        }
	        me.removeClass([XMASKED, XMASKEDRELATIVE]);
	    },
	
	    
	    isMasked : function(){	    
	        return this.mask && this.mask.isVisible();
	    },
	    
	    
	    createShim : function(){
	        var el = document.createElement('iframe'),        	
	        	shim;
	        el.frameBorder = '0';
	        el.className = 'ext-shim';
	        if(Ext.isIE && Ext.isSecure){
	            el.src = Ext.SSL_SECURE_URL;
	        }
	        shim = Ext.get(this.dom.parentNode.insertBefore(el, this.dom));
	        shim.autoBoxAdjust = false;
	        return shim;
	    }
    }
}());
(function(){
	// contants
	var NULL = null,
		UNDEFINED = undefined,
		TRUE = true,
		FALSE = false,
    	SETX = "setX",
    	SETY = "setY",
    	SETXY = "setXY",
    	LEFT = "left",
    	BOTTOM = "bottom",
    	TOP = "top",
    	RIGHT = "right",
    	HEIGHT = "height",
    	WIDTH = "width",
    	POINTS = "points",
    	HIDDEN = "hidden",
    	ABSOLUTE = "absolute",
    	VISIBLE = "visible",
    	MOTION = "motion",
    	POSITION = "position",
    	EASEOUT = "easeOut";
    	
//Notifies Element that fx methods are available
Ext.enableFx = TRUE;


Ext.Fx = {
	
	// private - calls the function taking arguments from the argHash based on the key.  Returns the return value of the function.
	// 			 this is useful for replacing switch statements (for example).
	switchStatements : function(key, fn, argHash){
		return fn.apply(this, argHash[key]);
	},
	
	
    slideIn : function(anchor, o){        
	    var me = this,
        	el = me.getFxEl(),
        	r,
			b,				
			wrap,				
			after,
			st,
        	args, 
        	pt,
        	bw,
        	bh,
        	xy = me.getXY(),
            dom = me.dom;
        	
        o = o || {};
		anchor = anchor || "t";

        el.queueFx(o, function(){			
			st = me.dom.style;				
            	
            // fix display to visibility
            me.fixDisplay();            
            
            // restore values after effect
			r = me.getFxRestore();		
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
            
            // fixed size for slide
            me.setWidth(b.width).setHeight(b.height);            
            
            // wrap if needed
            wrap = me.fxWrap(r.pos, o, HIDDEN);
            
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            
        	// clear out temp styles after slide and unwrap
        	function after(){
                 el.fxUnwrap(wrap, r.pos, o);
                 st.width = r.width;
                 st.height = r.height;
                 el.afterFx(o);
            }
            
            // time to calculate the positions        
        	pt = {to: [b.x, b.y]}; 
        	bw = {to: b.width};
        	bh = {to: b.height};
            	
			function argCalc(wrap, style, ww, wh, sXY, sXYval, s1, s2, w, h, p){	            	
				var ret = {};
            	wrap.setWidth(ww).setHeight(wh);
            	if( wrap[sXY] )	wrap[sXY](sXYval);            		
            	style[s1] = style[s2] = "0";	            	
            	if(w) ret.width = w;
            	if(h) ret.height = h;
            	if(p) ret.points = p;
            	return ret;
        	};

            args = me.switchStatements(anchor.toLowerCase(), argCalc, {
		            t  : [wrap, st, b.width, 0, NULL, NULL, LEFT, BOTTOM, NULL, bh, NULL],
		            l  : [wrap, st, 0, b.height, NULL, NULL, RIGHT, TOP, bw, NULL, NULL],
		            r  : [wrap, st, 0, b.height, SETX, b.right, LEFT, TOP, bw, NULL, pt],
		            b  : [wrap, st, b.width, 0, SETY, b.bottom, LEFT, TOP, NULL, bh, pt],
		            tl : [wrap, st, 0, 0, NULL, NULL, RIGHT, BOTTOM, bw, NULL, pt],
		            bl : [wrap, st, 0, 0, SETY, b.y + b.height, RIGHT, TOP, bw, bh, pt],
		            br : [wrap, st, 0, 0, SETXY, [b.right, b.bottom], LEFT, TOP, bw, bh, pt],
		            tr : [0, 0, SETX, b.x + b.width, LEFT, BOTTOM, bw, bh, pt]
            	});
            
            st.visibility = VISIBLE;
            wrap.show();

            arguments.callee.anim = wrap.fxanim(args,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },
    
	
    slideOut : function(anchor, o){
	    var me = this,
	    	el = me.getFxEl(),
	    	xy = me.getXY(),
            dom = me.dom,
	    	wrap,
	    	st,
	    	r,
	    	b,
	    	a,
	    	zero = {to: 0}; 
	    		    
        o = o || {};
        anchor = anchor || "t";

        el.queueFx(o, function(){
	        // restore values after effect
            r = me.getFxRestore(); 
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
            	
            // fixed size for slide            
            me.setWidth(b.width).setHeight(b.height);

            // wrap if needed
            wrap = me.fxWrap(r.pos, o, VISIBLE);
           	st = me.dom.style;
           		
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            wrap.setWidth(b.width).setHeight(b.height);            

            function after(){
	            o.useDisplay ? el.setDisplayed(FALSE) : el.hide();                
                el.fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            }            
            
            function argCalc(style, s1, s2, p1, v1, p2, v2, p3, v3){	            	
	            var ret = {};
	            
            	style[s1] = style[s2] = "0";
            	ret[p1] = v1;            	
            	if(p2) ret[p2] = v2;            	
            	if(p3) ret[p3] = v3;
            	
            	return ret;
       		};
       		
       		a = me.switchStatements(anchor.toLowerCase(), argCalc, {
	            t  : [st, LEFT, BOTTOM, HEIGHT, zero],
	            l  : [st, RIGHT, TOP, WIDTH, zero],
	            r  : [st, LEFT, TOP, WIDTH, zero, POINTS, {to : [b.right, b.y]}],
	            b  : [st, LEFT, TOP, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
	            tl : [st, RIGHT, BOTTOM, WIDTH, zero, HEIGHT, zero],
	            bl : [st, RIGHT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.X, b.bottom]}],
	            br : [st, LEFT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x + b.width, b.bottom]}],
	            tr : [st, LEFT, BOTTOM, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.right, b.y]}]
            });
            
            arguments.callee.anim = wrap.fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },

	
    puff : function(o){
	    o = o || {};
	    
        var me = this,
        	el = me.getFxEl(),
        	r, 
        	st = me.dom.style,
        	width = me.getWidth(),
        	height = me.getHeight();        	        

        el.queueFx(o, function(){	        
            me.clearOpacity();
            me.show();

            // restore values after effect
            r = me.getFxRestore();        	       	 
        	
            function after(){
            	o.useDisplay ? el.setDisplayed(FALSE) : el.hide();	                
                el.clearOpacity();	
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                el.afterFx(o);
            }	

            arguments.callee.anim = me.fxanim({
                    width : {to : me.adjustWidth(width * 2)},
                    height : {to : me.adjustHeight(height * 2)},
                    points : {by : [-width * .5, -height * .5]},
                    opacity : {to : 0},
                    fontSize: {to : 200, unit: "%"}
                },
                o,
                MOTION,
                .5,
                EASEOUT,
                 after);
        });
        return me;
    },

	
    switchOff : function(o){
	    o = o || {};
	    
        var me = this,
        	el = me.getFxEl();        

        el.queueFx(o, function(){
	        me.clearOpacity();
            me.clip();

            // restore values after effect
            var r = me.getFxRestore(),
            	st = me.dom.style,
            	after = function(){
	                o.useDisplay ? el.setDisplayed(FALSE) : el.hide();	
	                el.clearOpacity();
	                el.setPositioning(r.pos);
	                st.width = r.width;
	                st.height = r.height;	
	                el.afterFx(o);
	            };

            me.fxanim({opacity : {to : 0.3}}, 
            	NULL, 
            	NULL, 
            	.1, 
            	NULL, 
            	function(){	            		            
	                me.clearOpacity();
		                (function(){			                
		                    me.fxanim({
		                        height : {to : 1},
		                        points : {by : [0, me.getHeight() * .5]}
		                    }, 
		                    o, 
		                    MOTION, 
		                    0.3, 
		                    'easeIn', 
		                    after);
		                }).defer(100);
	            });
        });
        return me;
    },

    	
    highlight : function(color, o){
	    o = o || {};
	    
        var me = this,
        	el = me.getFxEl(),
        	attr = o.attr || "backgroundColor",
        	a = {};

        el.queueFx(o, function(){
            me.clearOpacity();
            me.show();

            function after(){
                el.dom.style[attr] = me.dom.style[attr];
                el.afterFx(o);
            }            
            	
            a[attr] = {from: color || "ffff9c", to: o.endColor || me.getColor(attr) || "ffffff"};
            arguments.callee.anim = me.fxanim(a,
                o,
                'color',
                1,
                'easeIn', 
                after);
        });
        return me;
    },

   
    frame : function(color, count, o){
        var me = this,
        	el = me.getFxEl();
        	
        o = o || {};

        el.queueFx(o, function(){
            color = color || "#C3DAF9"
            if(color.length == 6){
                color = "#" + color;
            }            
            count = count || 1;
            me.show();

            var xy = me.getXY(),
            	dom = me.dom,
            	b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            
            
            
        	function animFn(){
                var proxy = Ext.get(document.body || document.documentElement).createChild({
                     style:{
                        visbility: HIDDEN,
                        position : ABSOLUTE,
                        "z-index": 35000, // yee haw
                        border : "0px solid " + color
                     }
            	}),
            	scale = Ext.isBorderBox ? 2 : 1;
                proxy.animate({
                    top : {from : b.y, to : b.y - 20},
                    left : {from : b.x, to : b.x - 20},
                    borderWidth : {from : 0, to : 10},
                    opacity : {from : 1, to : 0},
                    height : {from : b.height, to : b.height + 20 * scale},
                    width : {from : b.width, to : b.width + 20 * scale}
                }, 
                o.duration || 1, 
                function() {
                	proxy.remove();
                	--count > 0 ? animFn() : el.afterFx(o);
            	});
        	};
            animFn.call(me);
        });
        return me;
    },

   
    pause : function(seconds){
        var el = this.getFxEl();

        el.queueFx({}, function(){
            setTimeout(function(){
                el.afterFx({});
            }, seconds * 1000);
        });
        return this;
    },

   
    fadeIn : function(o){
        var me = this,
        	el = me.getFxEl();        
        o = o || {};
        
        el.queueFx(o, function(){	        
            me.setOpacity(0);
            me.fixDisplay();
            me.dom.style.visibility = VISIBLE;
            var to = o.endOpacity || 1;
            arguments.callee.anim = me.fxanim({opacity:{to:to}},
                o, NULL, .5, EASEOUT, function(){
                if(to == 1){
                    this.clearOpacity();
                }
                el.afterFx(o);
            });
        });
        return me;
    },

   
    fadeOut : function(o){
	    o = o || {};
	    
        var me = this,
        	style = me.dom.style,
        	el = me.getFxEl(),
        	to = o.endOpacity || 0;        	
        
        el.queueFx(o, function(){                       
            arguments.callee.anim = me.fxanim({ 
	            opacity : {to : to}},
                o, 
                NULL, 
                .5, 
                EASEOUT, 
                function(){
	                if(to == 0){
		               me.visibilityMode == Ext.Element.DISPLAY || o.useDisplay ? 
		                	style.display = "none" :
		                	style.visibility = HIDDEN;
		                	
	                    me.clearOpacity();
                	}
                	el.afterFx(o);
            });
        });
        return me;
    },

   
    scale : function(w, h, o){
	    var me = this;
        me.shift(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return me;
    },

   
    shift : function(o){
	    var me = this;
	    o = o || {};
        
	    var	el = me.getFxEl();       	
        el.queueFx(o, function(){
	        var a = {};	
	        
            for (prop in o) {
	            if (o[prop] != UNDEFINED) {		            			                    
		            a[prop] = {to : o[prop]};	            	
	            }
            } 
            
         	a.width ? a.width.to = me.adjustWidth(o.width) : a;
         	a.height ? a.height.to = me.adjustWidth(o.height) : a;   
            
            if (a.x || a.y || a.xy) {
	            a.points = a.xy || 
	            		   {to : [ a.x ? a.x.to : me.getX(),
	            				   a.y ? a.y.to : me.getY()]};	            	
            }

            arguments.callee.anim = me.fxanim(a,
                o, 
                MOTION, 
                .35, 
                EASEOUT, 
                function(){
                	el.afterFx(o);
            	});
        });
        return me;
    },

	
    ghost : function(anchor, o){
        var me = this,
        	el = me.getFxEl();
        	
        o = o || {};
        anchor = anchor || "b";

        el.queueFx(o, function(){
            // restore values after effect
            var r = me.getFxRestore();
            	w = me.getWidth(),
                h = me.getHeight();
            	st = me.dom.style,
            	after = function(){
	                if(o.useDisplay){
	                    el.setDisplayed(FALSE);
	                }else{
	                    el.hide();
                	}
                	
	                el.clearOpacity();
	                el.setPositioning(r.pos);
	                st.width = r.width;
	                st.width = r.width;
	
	                el.afterFx(o);
	            },
            	a = {opacity: {to: 0}, 
            		 points: {}}, 
            	pt = a.points;
            	
            	pt.by = me.switchStatements(anchor.toLowerCase(), function(v1,v2){ return [v1, v2];}, {
	            	t  : [0, -h],
	            	l  : [-w, 0],
	            	r  : [w, 0],
	            	b  : [0, h],
	            	tl : [-w, -h],
	            	bl : [-w, h],
	            	br : [w, h],
	            	tr : [w, -h]	
            	});
            	
            arguments.callee.anim = me.fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, after);
        });
        return me;
    },

	
    syncFx : function(){
	    var me = this;
        me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : TRUE,
            stopFx : FALSE
        });
        return me;
    },

	
    sequenceFx : function(){
	    var me = this;
        me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : FALSE,
            stopFx : FALSE
        });
        return me;
    },

	
    nextFx : function(){	    
        var ef = this.fxQueue[0];
        if(ef){
            ef.call(this);
        }
    },

	
    hasActiveFx : function(){	    
        return this.fxQueue && this.fxQueue[0];
    },

	
    stopFx : function(finish){
	    var me = this;
        if(me.hasActiveFx()){
            var cur = me.fxQueue[0];
            if(cur && cur.anim && cur.anim.isAnimated){
                me.fxQueue = [cur]; // clear out others
                cur.anim.stop(finish !== undefined ? finish : true);
            }
        }
        return me;
    },

	
    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return TRUE;
           }
           return FALSE;
        }
        return TRUE;
    },

	
    hasFxBlock : function(){
        var q = this.fxQueue;
        return q && q[0] && q[0].block;
    },

	
    queueFx : function(o, fn){
	    var me = this;
        if(!me.fxQueue){
            me.fxQueue = [];
        }
        if(!me.hasFxBlock()){
            Ext.applyIf(o, me.fxDefaults);
            if(!o.concurrent){
                var run = me.beforeFx(o);
                fn.block = o.block;
                me.fxQueue.push(fn);
                if(run){
                    me.nextFx();
                }
            }else{
                fn.call(me);
            }
        }
        return me;
    },

	
    fxWrap : function(pos, o, vis){	
        var me = this,
        	wrap,
        	wrapXY;
        if(!o.wrap || !(wrap = Ext.get(o.wrap))){            
            if(o.fixPosition){
                wrapXY = me.getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = Ext.get(me.dom.parentNode.insertBefore(div, me.dom));
            wrap.setPositioning(pos);
            if(wrap.isStyle(POSITION, "static")){
                wrap.position("relative");
            }
            me.clearPositioning('auto');
            wrap.clip();
            wrap.dom.appendChild(me.dom);
            if(wrapXY){
                wrap.setXY(wrapXY);
            }
        }
        return wrap;
    },

	
    fxUnwrap : function(wrap, pos, o){	    
	    var me = this;
        me.clearPositioning();
        me.setPositioning(pos);
        if(!o.wrap){
            wrap.dom.parentNode.insertBefore(me.dom, wrap.dom);
            wrap.remove();
        }
    },

	
    getFxRestore : function(){
        var	st = this.dom.style;
        return {pos: this.getPositioning(), width: st.width, height : st.height};
    },

	
    afterFx : function(o){
	    var me = this;
        if(o.afterStyle){
	        me.setStyle(o.afterStyle);            
        }
        if(o.afterCls){
            me.addClass(o.afterCls);
        }
        if(o.remove == TRUE){
            me.remove();
        }
        if(o.callback) o.callback.call(o.scope, me);
        if(!o.concurrent){
            me.fxQueue.shift();
            me.nextFx();
        }
    },

	
    getFxEl : function(){ // support for composite element fx
        return Ext.get(this.dom);
    },

	
    fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Ext.lib.Anim[animType](
	            this.dom, 
	            args,
	            (opt.duration || defaultDur) || .35,
	            (opt.easing || defaultEase) || EASEOUT,
	            cb,	           
	            this
	        );
        opt.anim = anim;
        return anim;
    }
};

// backwords compat
Ext.Fx.resize = Ext.Fx.scale;

//When included, Ext.Fx is automatically applied to Element so that all basic
//effects are available directly via the Element API
Ext.Element.addMethods(Ext.Fx);
})();

Ext.CompositeElementLite = function(els, root){
    this.elements = [];
    this.add(els, root);
    this.el = new Ext.Element.Flyweight();
};

Ext.CompositeElementLite.prototype = {
	isComposite: true,	
	
    getCount : function(){
        return this.elements.length;
    },    
	add : function(els){
        if(els){
            if (Ext.isArray(els)) {
                this.elements = this.elements.concat(els);
            } else {
                var yels = this.elements;                	                
	            Ext.each(els, function(e) {
                    yels.push(e);
                });
            }
        }
        return this;
    },
    invoke : function(fn, args){
        var els = this.elements,
        	el = this.el;        
	    Ext.each(els, function(e) {    
            el.dom = e;
        	Ext.Element.prototype[fn].apply(el, args);
        });
        return this;
    },
    
    item : function(index){
	    var me = this;
        if(!me.elements[index]){
            return null;
        }
        me.el.dom = me.elements[index];
        return me.el;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        Ext.each(this.elements, function(e) {
	        Ext.EventManager.on(e, eventName, handler, scope || e, opt);
        });
        return this;
    },
    
    each : function(fn, scope){       
        var me = this,
        	el = me.el;
       
	    Ext.each(me.elements, function(e,i) {    
            el.dom = e;
        	return fn.call(scope || el, el, me, i);
        });
        return me;
    },
    indexOf : function(el){
        return this.elements.indexOf(Ext.getDom(el));
    },
    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
        	d;
        if(index > -1){
            replacement = Ext.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    },
    
    
    clear : function(){
        this.elements = [];
    }
}

Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;

(function(){
var fnName,
	ElProto = Ext.Element.prototype,
	CelProto = Ext.CompositeElementLite.prototype;
	
for(var fnName in ElProto){
    if(Ext.isFunction(ElProto[fnName])){
	    (function(fnName){ 
		    CelProto[fnName] = CelProto[fnName] || function(){
		    	return this.invoke(fnName, arguments);
	    	};
    	}).call(CelProto, fnName);
    }
};
})();

if(Ext.DomQuery){
    Ext.Element.selectorFunction = Ext.DomQuery.select;
} 


Ext.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    return new Ext.CompositeElementLite(els);
};

Ext.select = Ext.Element.select;

Ext.apply(Ext.CompositeElementLite.prototype, {	
	addElements : function(els, root){
        if(!els) return this;
        if(typeof els == "string"){
            els = Ext.Element.selectorFunction(els, root);
        }
        var yels = this.elements;        
	    Ext.each(els, function(e) {
        	yels.push(Ext.get(e));
        });
        return this;
    },
    
    
    fill : function(els){
        this.elements = [];
        this.add(els);
        return this;
    },
    
    
    first : function(){
        return this.item(0);
    },   
    
    
    last : function(){
        return this.item(this.getCount()-1);
    },
    
    
    contains : function(el){
        return this.indexOf(el) != -1;
    },

    
    filter : function(selector){
        var els = [];
        this.each(function(el){
            if(el.is(selector)){
                els[els.length] = el.dom;
            }
        });
        this.fill(els);
        return this;
    },
        
    
    replaceElement : function(el, replacement, domReplace){
        var me = this,
        	index = !isNaN(el) ? el : me.indexOf(el);
        if(index > -1){
            if(domReplace){
                me.elements[index].replaceWith(replacement);
            }else{
                me.elements.splice(index, 1, Ext.get(replacement))
            }
        }
        return me;
    }	
});

Ext.CompositeElement = function(els, root){
	Ext.CompositeElement.superclass.constructor.call(this, els);
};

Ext.extend(Ext.CompositeElement, Ext.CompositeElementLite, {
    invoke : function(fn, args){
	    Ext.each(this.elements, function(e) {
        	Ext.Element.prototype[fn].apply(e, args);
        });
        return this;
    },

    
    select : function(selector, unique, root){
        var els;
        if(typeof selector == "string"){
            els = Ext.Element.selectorFunction(selector, root);
        }else if(selector.length !== undefined){
            els = selector;
        }else{
            throw "Invalid selector";
        }
        if(unique === true){ 
            return new Ext.CompositeElement(els); 
        }else{ 
            return new Ext.CompositeElementLite(els);
        }
    },
    
    
    add : function(els, root){
	    if(!els) return this;
        if(typeof els == "string"){
            els = Ext.Element.selectorFunction(els, root);
        }
        var yels = this.elements;        
	    Ext.each(els, function(e) {
        	yels.push(Ext.get(e));
        });
        return this;
    },    
    
    
    item : function(index){
        return this.elements[index] || null;
    },
	
    
    indexOf : function(el){
        return this.elements.indexOf(Ext.get(el));
    },

    
    removeElement : function(keys, removeDom){
        var me = this,
	        els = this.elements,	    
	    	el;	    	
	    Ext.each(keys, function(val){
		    if (el = (els[val] || els[val = me.indexOf(val)])) {
		    	if(removeDom)
		    		el.dom ? el.remove() : Ext.removeNode(el);
		    	els.splice(val, 1);		    	
			}
	    });
        return this;
    },
    
    filter : function(selector){
		var me = this,
			out = [];
			
		Ext.each(me.elements, function(el) {	
			if(el.is(selector)){
				out.push(Ext.get(el));
			}
		})
		me.elements = out;
		return me;
	},
	
	
    each : function(fn, scope){        
        Ext.each(this.elements, function(e,i) {
	        return fn.call(scope || e, e, this, i)
        }, this);
        return this;
    }
});
(function(){
	var BEFOREREQUEST = "beforerequest",
		REQUESTCOMPLETE = "requestcomplete",
		REQUESTEXCEPTION = "requestexception",
		LOAD = 'load',
		POST = 'POST',
		GET = 'GET',
		WINDOW = window;
	
	
	Ext.data.Connection = function(config){	
	    Ext.apply(this, config);
	    this.addEvents(
	        
	        BEFOREREQUEST,
	        
	        REQUESTCOMPLETE,
	        
	        REQUESTEXCEPTION
	    );
	    Ext.data.Connection.superclass.constructor.call(this);
	};

	// private
    function handleResponse(response){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent(REQUESTCOMPLETE, this, response, options);
        if(options.success) options.success.call(options.scope, response, options);
        if(options.callback) options.callback.call(options.scope, options, true, response);
    }

    // private
    function handleFailure(response, e){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent(REQUESTEXCEPTION, this, response, options, e);
        if(options.failure) options.failure.call(options.scope, response, options);
        if(options.callback) options.callback.call(options.scope, options, false, response);
    }
	    
	Ext.extend(Ext.data.Connection, Ext.util.Observable, {
	    
	    
	    
	    
	    
	    timeout : 30000,
	    
	    autoAbort:false,
	
	    
	    disableCaching: true,
	    
	    
	    disableCachingParam: '_dc',
        
	    
	    request : function(o){
		    var me = this;
	        if(me.fireEvent(BEFOREREQUEST, me, o)){
                if (o.el) {
                    if(!Ext.isEmpty(o.indicatorText)){
                        me.indicatorText = '<div class="loading-indicator">'+o.indicatorText+"</div>";
                    }
                    if(me.indicatorText) {
                        Ext.getDom(o.el).innerHTML = me.indicatorText;                        
                    }
                    o.success = (Ext.isFunction(o.success) ? o.success : function(){}).createInterceptor(function(response) {
                        Ext.getDom(o.el).innerHTML = response.responseText;
                    });
                }
                
	            var p = o.params,
	            	url = o.url || me.url,            	
	            	method,
	            	cb = {success: handleResponse,
		                  failure: handleFailure,
		                  scope: me,
		                  argument: {options: o},
		                  timeout : o.timeout || me.timeout
		            },
		            form,		            
		            serForm;		            
		          
		             
	            if (Ext.isFunction(p)) {
	                p = p.call(o.scope||WINDOW, o);
	            }
	            	               	                    
	            p = Ext.urlEncode(me.extraParams, typeof p == 'object' ? Ext.urlEncode(p) : p);	
	            
	            if (Ext.isFunction(url)) {
	                url = url.call(o.scope || WINDOW, o);
	            }
	
	            if(form = Ext.getDom(o.form)){
	                url = url || form.action;

// this is not supported in Ext Core	                	
// 	                if(o.isUpload || /multipart\/form-data/i.test(form.getAttribute("enctype"))) { 
// 	                    return doFormUpload.call(me, o, p, url);
// 	                }
	                serForm = Ext.lib.Ajax.serializeForm(form);	                
	                p = p ? (p + '&' + serForm) : serForm;
	            }
	            
	            method = o.method || me.method || ((p || o.xmlData || o.jsonData) ? POST : GET);
	            
	            if(method == GET && (me.disableCaching || o.disableCaching !== false)) {// || o.disableCaching === true){
	                var dcp = o.disableCachingParam || me.disableCachingParam;
	                url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
	            }
	            
	            o.headers = Ext.apply(o.headers || {}, me.defaultHeaders || {});
	            
				if(o.autoAbort === true || me.autoAbort) {
					me.abort();
				}
				 
	            if((method == GET || o.xmlData || o.jsonData) && p){
	                url += (/\?/.test(url) ? '&' : '?') + p;  
	                p = '';
	            }
	            
	            return me.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
	        }else{	            
	            return o.callback ? o.callback.apply(o.scope, [o,,]) : null;
	        }
	    },
	
	    
	    isLoading : function(transId){
		    return transId ? Ext.lib.Ajax.isCallInProgress(transId) : !! this.transId;	        
	    },
	
	    
	    abort : function(transId){
	        if(transId || this.isLoading()){
	            Ext.lib.Ajax.abort(transId || this.transId);
	        }
	    }
	});
})();


Ext.Ajax = new Ext.data.Connection({
    
    
    
    
    
    

    

    
    
    
    
    
    

    
    autoAbort : false,

    
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});

Ext.UpdateManager = Ext.Updater = Ext.extend(Ext.util.Observable, 
function() {
	var BEFOREUPDATE = "beforeupdate",
		UPDATE = "update",
		FAILURE = "failure";
		
	// private
    function processSuccess(response){	    
	    var me = this;
        me.transaction = null;
        if (response.argument.form && response.argument.reset) {
            try { // put in try/catch since some older FF releases had problems with this
                response.argument.form.reset();
            } catch(e){}
        }
        if (me.loadScripts) {
            me.renderer.render(me.el, response, me,
               updateComplete.createDelegate(me, [response]));
        } else {
            me.renderer.render(me.el, response, me);
            updateComplete(response);
        }
    }
    
    // private
    function updateComplete(response, type, success){
        this.fireEvent(type || UPDATE, this.el, response);
        if(Ext.isFunction(response.argument.callback)){
            response.argument.callback.call(response.argument.scope, this.el, Ext.isEmpty(success) ? true : false, response, response.argument.options);
        }
    }

    // private
    function processFailure(response){	            
        updateComplete.call(this, response, FAILURE, !!(this.transaction = null));
    }
	    
	return {
	    constructor: function(el, forceNew){
		    var me = this;
	        el = Ext.get(el);
	        if(!forceNew && el.updateManager){
	            return el.updateManager;
	        }
	        
	        me.el = el;
	        
	        me.defaultUrl = null;
	
	        me.addEvents(
	            
	            BEFOREUPDATE,
	            
	            UPDATE,
	            
	            FAILURE
	        );
	
	        Ext.apply(me, Ext.Updater.defaults);
	        
	        
	        
	        
	        
	        
	
	        
	        me.transaction = null;
	        
	        me.refreshDelegate = me.refresh.createDelegate(me);
	        
	        me.updateDelegate = me.update.createDelegate(me);
	        
	        me.formUpdateDelegate = (me.formUpdate || function(){}).createDelegate(me);	
	        
			
	        me.renderer = me.renderer || me.getDefaultRenderer();
	        
	        Ext.Updater.superclass.constructor.call(me);
	    },
        
		
	    setRenderer : function(renderer){
	        this.renderer = renderer;
	    },	
        
	    
	    getRenderer : function(){
	       return this.renderer;
	    },

	    
	    getDefaultRenderer: function() {
	        return new Ext.Updater.BasicRenderer();
	    },
                
	    
	    setDefaultUrl : function(defaultUrl){
	        this.defaultUrl = defaultUrl;
	    },
        
	    
	    getEl : function(){
	        return this.el;
	    },
	
		
	    update : function(url, params, callback, discardUrl){
		    var me = this,
		    	cfg, 
		    	callerScope;
		    	
	        if(me.fireEvent(BEFOREUPDATE, me.el, url, params) !== false){	            
	            if(Ext.isObject(url)){ // must be config object
	                cfg = url;
	                url = cfg.url;
	                params = params || cfg.params;
	                callback = callback || cfg.callback;
	                discardUrl = discardUrl || cfg.discardUrl;
	                callerScope = cfg.scope;	                
	                if(!Ext.isEmpty(cfg.nocache)){me.disableCaching = cfg.nocache;};
	                if(!Ext.isEmpty(cfg.text)){me.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
	                if(!Ext.isEmpty(cfg.scripts)){me.loadScripts = cfg.scripts;};
	                if(!Ext.isEmpty(cfg.timeout)){me.timeout = cfg.timeout;};
	            }
	            me.showLoading();
	
	            if(!discardUrl){
	                me.defaultUrl = url;
	            }
	            if(Ext.isFunction(url)){
	                url = url.call(me);
	            }
	
	            var o = Ext.apply({}, {
	                url : url,
	                params: (Ext.isFunction(params) && callerScope) ? params.createDelegate(callerScope) : params,
	                success: processSuccess,
	                failure: processFailure,
	                scope: me,
	                callback: undefined,
	                timeout: (me.timeout*1000),
	                disableCaching: me.disableCaching,
	                argument: {
	                    "options": cfg,
	                    "url": url,
	                    "form": null,
	                    "callback": callback,
	                    "scope": callerScope || window,
	                    "params": params
	                }
	            }, cfg);
	
	            me.transaction = Ext.Ajax.request(o);
	        }
	    },	    	

		
	    formUpdate : function(form, url, reset, callback){
		    var me = this;
	        if(me.fireEvent(BEFOREUPDATE, me.el, form, url) !== false){
	            if(Ext.isFunction(url)){
	                url = url.call(me);
	            }
	            form = Ext.getDom(form)
	            me.transaction = Ext.Ajax.request({
	                form: form,
	                url:url,
	                success: processSuccess,
	                failure: processFailure,
	                scope: me,
	                timeout: (me.timeout*1000),
	                argument: {
	                    "url": url,
	                    "form": form,
	                    "callback": callback,
	                    "reset": reset
	                }
	            });
	            me.showLoading.defer(1, me);
	        }
	    },
                	
	    
	    startAutoRefresh : function(interval, url, params, callback, refreshNow){
		    var me = this;
	        if(refreshNow){
	            me.update(url || me.defaultUrl, params, callback, true);
	        }
	        if(me.autoRefreshProcId){
	            clearInterval(me.autoRefreshProcId);
	        }
	        me.autoRefreshProcId = setInterval(me.update.createDelegate(me, [url || me.defaultUrl, params, callback, true]), interval * 1000);
	    },
	
	    
	    stopAutoRefresh : function(){
	        if(this.autoRefreshProcId){
	            clearInterval(this.autoRefreshProcId);
	            delete this.autoRefreshProcId;
	        }
	    },
	
	    
	    isAutoRefreshing : function(){
	       return !!this.autoRefreshProcId;
	    },
	
	    
	    showLoading : function(){
	        if(this.showLoadIndicator){
            	this.el.dom.innerHTML = this.indicatorText;
	        }
	    },
	
	    
	    abort : function(){
	        if(this.transaction){
	            Ext.Ajax.abort(this.transaction);
	        }
	    },
	
	    
	    isUpdating : function(){        
	    	return this.transaction ? Ext.Ajax.isLoading(this.transaction) : false;        
	    },
	    
	    
	    refresh : function(callback){
	        if(this.defaultUrl){
	        	this.update(this.defaultUrl, null, callback, true);
	    	}
	    }
    }
}());


Ext.Updater.defaults = {
   
    timeout : 30,    
    
    disableCaching : false,
    
    showLoadIndicator : true,
    
    indicatorText : '<div class="loading-indicator">Loading...</div>',
     
    loadScripts : false,
    
    sslBlankUrl : (Ext.SSL_SECURE_URL || "javascript:false")      
};



Ext.Updater.updateElement = function(el, url, params, options){
    var um = Ext.get(el).getUpdater();
    Ext.apply(um, options);
    um.update(url, params, options ? options.callback : null);
};


Ext.Updater.BasicRenderer = function(){};

Ext.Updater.BasicRenderer.prototype = {
    
     render : function(el, response, updateManager, callback){	     
        el.update(response.responseText, updateManager.loadScripts, callback);
    }
};

Ext.util.DelayedTask = function(fn, scope, args){
    var me = this,
    	NULL = null,
    	id = NULL, 
    	_delay, 
    	_time,    	    	
    	call = function(){
	        var now = new Date().getTime();
	        if(now - _time >= _delay){
	            clearInterval(id);
	            id = NULL;
	            fn.apply(scope, args || []);
	        }
	    };
	    
    
    me.delay = function(delay, newFn, newScope, newArgs){
        if(id && delay != _delay){
            this.cancel();
        }
        _delay = delay;
        _time = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if(!id){
            id = setInterval(call, _delay);
        }
    };

    
    me.cancel = function(){
        if(id){
            clearInterval(id);
            id = NULL;
        }
    };
};

Ext.util.JSON = new (function(){
    var useHasOwn = !!{}.hasOwnProperty;

    // crashes Safari in some instances
    //var validRE = /^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;

    var pad = function(n) {
        return n < 10 ? "0" + n : n;
    };

    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };

    var encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };

    var encodeArray = function(o){
        var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : Ext.util.JSON.encode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
    };

    this.encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };

    
    this.encode = function(o){
        if(typeof o == "undefined" || o === null){
            return "null";
        }else if(Ext.isArray(o)){
            return encodeArray(o);
        }else if(Ext.isDate(o)){
            return Ext.util.JSON.encodeDate(o);
        }else if(typeof o == "string"){
            return encodeString(o);
        }else if(typeof o == "number"){
            return isFinite(o) ? String(o) : "null";
        }else if(typeof o == "boolean"){
            return String(o);
        }else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if(!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if(b){
                            a.push(',');
                        }
                        a.push(this.encode(i), ":",
                                v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };

    
    this.decode = function(json, safe){
        var fn = function(){
            return eval("(" + json + ')');    
        };
        if(safe){
            try{
                return fn();
            }catch(e){
                return null;
            }
        }else{
            return fn();
        }
    };
})();

Ext.encode = Ext.util.JSON.encode;

Ext.decode = Ext.util.JSON.decode;


Ext.XTemplate = function(){
    Ext.XTemplate.superclass.constructor.apply(this, arguments);

    var me = this,
    	s = me.html,
    	re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
    	nameRe = /^<tpl\b[^>]*?for="(.*?)"/,
    	ifRe = /^<tpl\b[^>]*?if="(.*?)"/,
    	execRe = /^<tpl\b[^>]*?exec="(.*?)"/,
    	m,
    	id = 0,
    	tpls = [],
    	VALUES = 'values',
    	PARENT = 'parent',
    	XINDEX = 'xindex',
    	XCOUNT = 'xcount',
    	RETURN = 'return ',
    	WITHVALUES = 'with(values){ ';

    s = ['<tpl>', s, '</tpl>'].join('');

    while(m = s.match(re)){
       	var m2 = m[0].match(nameRe),
			m3 = m[0].match(ifRe),
       		m4 = m[0].match(execRe),
       		exp = null,
       		fn = null,
       		exec = null,
       		name = m2 && m2[1] ? m2[1] : '';

       if (m3) {
           exp = m3 && m3[1] ? m3[1] : null;
           if(exp){
               fn = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + RETURN +(Ext.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if (m4) {
           exp = m4 && m4[1] ? m4[1] : null;
           if(exp){
               exec = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES +(Ext.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if(name){
           switch(name){
               case '.': name = new Function(VALUES, PARENT, WITHVALUES + RETURN + VALUES + '; }'); break;
               case '..': name = new Function(VALUES, PARENT, WITHVALUES + RETURN + PARENT + '; }'); break;
               default: name = new Function(VALUES, PARENT, WITHVALUES + RETURN + name + '; }');
           }
       }
       tpls.push({
            id: id,
            target: name,
            exec: exec,
            test: fn,
            body: m[1]||''
        });
       s = s.replace(m[0], '{xtpl'+ id + '}');
       ++id;
    }
	Ext.each(tpls, function(t) {
        me.compileTpl(t);
    });
    me.master = tpls[tpls.length-1];
    me.tpls = tpls;
};
Ext.extend(Ext.XTemplate, Ext.Template, {
    // private
    re : /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,
    // private
    codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,

    // private
    applySubTemplate : function(id, values, parent, xindex, xcount){
        var me = this,
        	len,
        	t = me.tpls[id],
        	vs,
        	buf = [];
        if ((t.test && !t.test.call(me, values, parent, xindex, xcount)) ||
            (t.exec && t.exec.call(me, values, parent, xindex, xcount))) {
            return '';
        }
        vs = t.target ? t.target.call(me, values, parent) : values;
        len = vs.len;
        parent = t.target ? values : parent;
        if(t.target && Ext.isArray(vs)){
	        Ext.each(vs, function(v, i) {
                buf[buf.length] = t.compiled.call(me, v, parent, i+1, len);
            });
            return buf.join('');
        }
        return t.compiled.call(me, vs, parent, xindex, xcount);
    },

    // private
    compileTpl : function(tpl){
        var fm = Ext.util.Format,
       		useF = this.disableFormats !== true,
            sep = Ext.isGecko ? "+" : ",",
            body;

        function fn(m, name, format, args, math){
            if(name.substr(0, 4) == 'xtpl'){
                return "'"+ sep +'this.applySubTemplate('+name.substr(4)+', values, parent, xindex, xcount)'+sep+"'";
            }
            var v;
            if(name === '.'){
                v = 'values';
            }else if(name === '#'){
                v = 'xindex';
            }else if(name.indexOf('.') != -1){
                v = name;
            }else{
                v = "values['" + name + "']";
            }
            if(math){
                v = '(' + v + math + ')';
            }
            if (format && useF) {
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            } else {
                args= ''; format = "("+v+" === undefined ? '' : ";
            }
            return "'"+ sep + format + v + args + ")"+sep+"'";
        };

        function codeFn(m, code){
            return "'"+ sep +'('+code+')'+sep+"'";
        };

        // branched to use + in gecko and [].join() in others
        if(Ext.isGecko){
            body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
                   tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
                    "';};";
        }else{
            body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
            body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },

    
    applyTemplate : function(values){
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    
    compile : function(){return this;}

    
    
    

});

Ext.XTemplate.prototype.apply = Ext.XTemplate.prototype.applyTemplate;


Ext.XTemplate.from = function(el){
    el = Ext.getDom(el);
    return new Ext.XTemplate(el.value || el.innerHTML);
};

(function(){
Ext.Layer = function(config, existingEl){
    config = config || {};
    var dh = Ext.DomHelper;
    var cp = config.parentEl, pel = cp ? Ext.getDom(cp) : document.body;
    if(existingEl){
        this.dom = Ext.getDom(existingEl);
    }
    if(!this.dom){
        var o = config.dh || {tag: "div", cls: "x-layer"};
        this.dom = dh.append(pel, o);
    }
    if(config.cls){
        this.addClass(config.cls);
    }
    this.constrain = config.constrain !== false;
    this.visibilityMode = Ext.Element.VISIBILITY;
    if(config.id){
        this.id = this.dom.id = config.id;
    }else{
        this.id = Ext.id(this.dom);
    }
    this.zindex = config.zindex || this.getZIndex();
    this.position("absolute", this.zindex);
    if(config.shadow){
        this.shadowOffset = config.shadowOffset || 4;
        this.shadow = new Ext.Shadow({
            offset : this.shadowOffset,
            mode : config.shadow
        });
    }else{
        this.shadowOffset = 0;
    }
    this.useShim = config.shim !== false && Ext.useShims;
    this.useDisplay = config.useDisplay;
    this.hide();
};

var supr = Ext.Element.prototype;

// shims are shared among layer to keep from having 100 iframes
var shims = [];

Ext.extend(Ext.Layer, Ext.Element, {

    getZIndex : function(){
        return this.zindex || parseInt(this.getStyle("z-index"), 10) || 11000;
    },

    getShim : function(){
        if(!this.useShim){
            return null;
        }
        if(this.shim){
            return this.shim;
        }
        var shim = shims.shift();
        if(!shim){
            shim = this.createShim();
            shim.enableDisplayMode('block');
            shim.dom.style.display = 'none';
            shim.dom.style.visibility = 'visible';
        }
        var pn = this.dom.parentNode;
        if(shim.dom.parentNode != pn){
            pn.insertBefore(shim.dom, this.dom);
        }
        shim.setStyle('z-index', this.getZIndex()-2);
        this.shim = shim;
        return shim;
    },

    hideShim : function(){
        if(this.shim){
            this.shim.setDisplayed(false);
            shims.push(this.shim);
            delete this.shim;
        }
    },

    disableShadow : function(){
        if(this.shadow){
            this.shadowDisabled = true;
            this.shadow.hide();
            this.lastShadowOffset = this.shadowOffset;
            this.shadowOffset = 0;
        }
    },

    enableShadow : function(show){
        if(this.shadow){
            this.shadowDisabled = false;
            this.shadowOffset = this.lastShadowOffset;
            delete this.lastShadowOffset;
            if(show){
                this.sync(true);
            }
        }
    },

    // private
    // this code can execute repeatedly in milliseconds (i.e. during a drag) so
    // code size was sacrificed for effeciency (e.g. no getBox/setBox, no XY calls)
    sync : function(doShow){
        var sw = this.shadow;
        if(!this.updating && this.isVisible() && (sw || this.useShim)){
            var sh = this.getShim();

            var w = this.getWidth(),
                h = this.getHeight();

            var l = this.getLeft(true),
                t = this.getTop(true);

            if(sw && !this.shadowDisabled){
                if(doShow && !sw.isVisible()){
                    sw.show(this);
                }else{
                    sw.realign(l, t, w, h);
                }
                if(sh){
                    if(doShow){
                       sh.show();
                    }
                    // fit the shim behind the shadow, so it is shimmed too
                    var a = sw.adjusts, s = sh.dom.style;
                    s.left = (Math.min(l, l+a.l))+"px";
                    s.top = (Math.min(t, t+a.t))+"px";
                    s.width = (w+a.w)+"px";
                    s.height = (h+a.h)+"px";
                }
            }else if(sh){
                if(doShow){
                   sh.show();
                }
                sh.setSize(w, h);
                sh.setLeftTop(l, t);
            }

        }
    },

    // private
    destroy : function(){
        this.hideShim();
        if(this.shadow){
            this.shadow.hide();
        }
        this.removeAllListeners();
        Ext.removeNode(this.dom);
        Ext.Element.uncache(this.id);
    },

    remove : function(){
        this.destroy();
    },

    // private
    beginUpdate : function(){
        this.updating = true;
    },

    // private
    endUpdate : function(){
        this.updating = false;
        this.sync(true);
    },

    // private
    hideUnders : function(negOffset){
        if(this.shadow){
            this.shadow.hide();
        }
        this.hideShim();
    },

    // private
    constrainXY : function(){
        if(this.constrain){
            var vw = Ext.lib.Dom.getViewWidth(),
                vh = Ext.lib.Dom.getViewHeight();
            var s = Ext.getDoc().getScroll();

            var xy = this.getXY();
            var x = xy[0], y = xy[1];
            var so = this.shadowOffset;
            var w = this.dom.offsetWidth+so, h = this.dom.offsetHeight+so;
            // only move it if it needs it
            var moved = false;
            // first validate right/bottom
            if((x + w) > vw+s.left){
                x = vw - w - so;
                moved = true;
            }
            if((y + h) > vh+s.top){
                y = vh - h - so;
                moved = true;
            }
            // then make sure top/left isn't negative
            if(x < s.left){
                x = s.left;
                moved = true;
            }
            if(y < s.top){
                y = s.top;
                moved = true;
            }
            if(moved){
                if(this.avoidY){
                    var ay = this.avoidY;
                    if(y <= ay && (y+h) >= ay){
                        y = ay-h-5;
                    }
                }
                xy = [x, y];
                this.storeXY(xy);
                supr.setXY.call(this, xy);
                this.sync();
            }
        }
        return this;
    },

    isVisible : function(){
        return this.visible;
    },

    // private
    showAction : function(){
        this.visible = true; // track visibility to prevent getStyle calls
        if(this.useDisplay === true){
            this.setDisplayed("");
        }else if(this.lastXY){
            supr.setXY.call(this, this.lastXY);
        }else if(this.lastLT){
            supr.setLeftTop.call(this, this.lastLT[0], this.lastLT[1]);
        }
    },

    // private
    hideAction : function(){
        this.visible = false;
        if(this.useDisplay === true){
            this.setDisplayed(false);
        }else{
            this.setLeftTop(-10000,-10000);
        }
    },

    // overridden Element method
    setVisible : function(v, a, d, c, e){
        if(v){
            this.showAction();
        }
        if(a && v){
            var cb = function(){
                this.sync(true);
                if(c){
                    c();
                }
            }.createDelegate(this);
            supr.setVisible.call(this, true, true, d, cb, e);
        }else{
            if(!v){
                this.hideUnders(true);
            }
            var cb = c;
            if(a){
                cb = function(){
                    this.hideAction();
                    if(c){
                        c();
                    }
                }.createDelegate(this);
            }
            supr.setVisible.call(this, v, a, d, cb, e);
            if(v){
                this.sync(true);
            }else if(!a){
                this.hideAction();
            }
        }
        return this;
    },

    storeXY : function(xy){
        delete this.lastLT;
        this.lastXY = xy;
    },

    storeLeftTop : function(left, top){
        delete this.lastXY;
        this.lastLT = [left, top];
    },

    // private
    beforeFx : function(){
        this.beforeAction();
        return Ext.Layer.superclass.beforeFx.apply(this, arguments);
    },

    // private
    afterFx : function(){
        Ext.Layer.superclass.afterFx.apply(this, arguments);
        this.sync(this.isVisible());
    },

    // private
    beforeAction : function(){
        if(!this.updating && this.shadow){
            this.shadow.hide();
        }
    },

    // overridden Element method
    setLeft : function(left){
        this.storeLeftTop(left, this.getTop(true));
        supr.setLeft.apply(this, arguments);
        this.sync();
        return this;
    },

    setTop : function(top){
        this.storeLeftTop(this.getLeft(true), top);
        supr.setTop.apply(this, arguments);
        this.sync();
        return this;
    },

    setLeftTop : function(left, top){
        this.storeLeftTop(left, top);
        supr.setLeftTop.apply(this, arguments);
        this.sync();
        return this;
    },

    setXY : function(xy, a, d, c, e){
        this.fixDisplay();
        this.beforeAction();
        this.storeXY(xy);
        var cb = this.createCB(c);
        supr.setXY.call(this, xy, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // private
    createCB : function(c){
        var el = this;
        return function(){
            el.constrainXY();
            el.sync(true);
            if(c){
                c();
            }
        };
    },

    // overridden Element method
    setX : function(x, a, d, c, e){
        this.setXY([x, this.getY()], a, d, c, e);
        return this;
    },

    // overridden Element method
    setY : function(y, a, d, c, e){
        this.setXY([this.getX(), y], a, d, c, e);
        return this;
    },

    // overridden Element method
    setSize : function(w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setSize.call(this, w, h, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // overridden Element method
    setWidth : function(w, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setWidth.call(this, w, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // overridden Element method
    setHeight : function(h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setHeight.call(this, h, a, d, cb, e);
        if(!a){
            cb();
        }
        return this;
    },

    // overridden Element method
    setBounds : function(x, y, w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        if(!a){
            this.storeXY([x, y]);
            supr.setXY.call(this, [x, y]);
            supr.setSize.call(this, w, h, a, d, cb, e);
            cb();
        }else{
            supr.setBounds.call(this, x, y, w, h, a, d, cb, e);
        }
        return this;
    },

    
    setZIndex : function(zindex){
        this.zindex = zindex;
        this.setStyle("z-index", zindex + 2);
        if(this.shadow){
            this.shadow.setZIndex(zindex + 1);
        }
        if(this.shim){
            this.shim.setStyle("z-index", zindex);
        }
        return this;
    }
});
})();

Ext.Shadow = function(config){
    Ext.apply(this, config);
    if(typeof this.mode != "string"){
        this.mode = this.defaultMode;
    }
    var o = this.offset, a = {h: 0};
    var rad = Math.floor(this.offset/2);
    switch(this.mode.toLowerCase()){ // all this hideous nonsense calculates the various offsets for shadows
        case "drop":
            a.w = 0;
            a.l = a.t = o;
            a.t -= 1;
            if(Ext.isIE){
                a.l -= this.offset + rad;
                a.t -= this.offset + rad;
                a.w -= rad;
                a.h -= rad;
                a.t += 1;
            }
        break;
        case "sides":
            a.w = (o*2);
            a.l = -o;
            a.t = o-1;
            if(Ext.isIE){
                a.l -= (this.offset - rad);
                a.t -= this.offset + rad;
                a.l += 1;
                a.w -= (this.offset - rad)*2;
                a.w -= rad + 1;
                a.h -= 1;
            }
        break;
        case "frame":
            a.w = a.h = (o*2);
            a.l = a.t = -o;
            a.t += 1;
            a.h -= 2;
            if(Ext.isIE){
                a.l -= (this.offset - rad);
                a.t -= (this.offset - rad);
                a.l += 1;
                a.w -= (this.offset + rad + 1);
                a.h -= (this.offset + rad);
                a.h += 1;
            }
        break;
    };

    this.adjusts = a;
};

Ext.Shadow.prototype = {
    
    
    offset: 4,

    // private
    defaultMode: "drop",

    
    show : function(target){
        target = Ext.get(target);
        if(!this.el){
            this.el = Ext.Shadow.Pool.pull();
            if(this.el.dom.nextSibling != target.dom){
                this.el.insertBefore(target);
            }
        }
        this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
        if(Ext.isIE){
            this.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+(this.offset)+")";
        }
        this.realign(
            target.getLeft(true),
            target.getTop(true),
            target.getWidth(),
            target.getHeight()
        );
        this.el.dom.style.display = "block";
    },

    
    isVisible : function(){
        return this.el ? true : false;  
    },

    
    realign : function(l, t, w, h){
        if(!this.el){
            return;
        }
        var a = this.adjusts, d = this.el.dom, s = d.style;
        var iea = 0;
        s.left = (l+a.l)+"px";
        s.top = (t+a.t)+"px";
        var sw = (w+a.w), sh = (h+a.h), sws = sw +"px", shs = sh + "px";
        if(s.width != sws || s.height != shs){
            s.width = sws;
            s.height = shs;
            if(!Ext.isIE){
                var cn = d.childNodes;
                var sww = Math.max(0, (sw-12))+"px";
                cn[0].childNodes[1].style.width = sww;
                cn[1].childNodes[1].style.width = sww;
                cn[2].childNodes[1].style.width = sww;
                cn[1].style.height = Math.max(0, (sh-12))+"px";
            }
        }
    },

    
    hide : function(){
        if(this.el){
            this.el.dom.style.display = "none";
            Ext.Shadow.Pool.push(this.el);
            delete this.el;
        }
    },

    
    setZIndex : function(z){
        this.zIndex = z;
        if(this.el){
            this.el.setStyle("z-index", z);
        }
    }
};

// Private utility class that manages the internal Shadow cache
Ext.Shadow.Pool = function(){
    var p = [];
    var markup = Ext.isIE ?
                 '<div class="x-ie-shadow"></div>' :
                 '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
    return {
        pull : function(){
            var sh = p.shift();
            if(!sh){
                sh = Ext.get(Ext.DomHelper.insertHtml("beforeBegin", document.body.firstChild, markup));
                sh.autoBoxAdjust = false;
            }
            return sh;
        },

        push : function(sh){
            p.push(sh);
        }
    };
}();
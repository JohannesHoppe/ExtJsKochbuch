var setTargets = function() {
    var link, i = 0;   
    while (link = document.links[i++]) {
        if (link.href.indexOf('http://') !== -1) {
            link.target = '_blank';
        }
    }
}
Ext.onReady(setTargets);

var addCaption = function() {
       
    Ext.select('img').each(function(value) {

        var text = value.getAttribute('alt');
        
        if (text) {
        
        value.wrap({
                tag: 'figure',
            }).parent().createChild({
                tag: 'figcaption',
                html: text
            });
        }        
    });
}
Ext.onReady(addCaption);

/*
var registerLightbox = function() {
    var box = new Ext.ux.Lightbox({
        renderTo: Ext.getBody()
    });
    //box.register('a[href^=images]');
    box.register('a');
}
Ext.onReady(registerLightbox);
*/

// Ext.js components sometimes want to much attention
Ext.onReady(function() {
    window.setTimeout(function() {
        window.scrollTo(0,0);
    }, 100);
});
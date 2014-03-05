/*jshint bitwise:false */
    
var tabManager = (function (Ext) {

    var hashCode = function (str) {
        var hash = 1315423911;

        for (var i = 0; i < str.length; i += 1) {
            hash ^= ((hash << 5) + str.charCodeAt(i) + (hash >> 2));
        }

        return (hash & 0x7FFFFFFF);
    };

    var addTab = function (config) {
        
        if (Ext.isEmpty(config.url, false)) {
            return;
        }

        var exampleTabs = Ext.getCmp('ExampleTabs');
        var id = config.id || hashCode(config.url);
        var tab = exampleTabs.getComponent(id);

        if (!tab) {
            
            exampleTabs.addTab({
                id: id.toString(),
                title: config.title,
                iconCls: config.icon || 'icon-applicationdouble',
                closable: true,
                loader: {
                    url: config.url,
                    renderer: "frame",
                    scripts: true,
                    disableCaching: false
                }
            });

        } else {
            exampleTabs.setActiveTab(tab);
            // Shows a ripple of exploding, attenuating borders to draw attention to an Element
            tab.getEl().frame();
        }
    };

    return {
        addTab: addTab
    };

})(window.Ext);
Ext.define('CM.view.Viewport', {
    extend: 'Ext.container.Viewport',

    layout: 'fit',
    items: [{
        xtype: 'customerlist'
    }]
});
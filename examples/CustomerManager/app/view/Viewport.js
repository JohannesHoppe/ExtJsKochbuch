Ext.define('CM.view.Viewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    items: [{
        xtype: 'customerlist',
        width: 600,
        height: 400
    }]
});
//Ext.require('CM.view.ResponsiveGrid');

Ext.define('CM.view.Viewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
        //align: 'center',
        //pack: 'center'
    },
    items: [{
        xtype: 'customerlist'
        //width: 600,
        //height: 400
    }]
});

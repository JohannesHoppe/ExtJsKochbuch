Ext.define('CustomerModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'Id', type: 'int' },
        { name: 'FirstName', type: 'string' },
        { name: 'LastName', type: 'string' },
        { name: 'Mail', type: 'string' }
    ]
});

var myStore = Ext.create('Ext.data.Store', {
    model: 'CustomerModel',
    proxy: {
        type: 'ajax',
        url: 'http://ex.extjs-kochbuch.de/api/customer',
        reader: {
            type: 'json',
            root: 'Data',
            totalProperty: 'Total'
        }
    },
    autoLoad: true
});

Ext.onReady(function () {

    Ext.create('Ext.grid.Panel', {
        store: myStore,
        columns: [
            { text: "Id", dataIndex: 'Id' },
            { text: "FirstName", dataIndex: 'FirstName' }
        ],
        renderTo: Ext.getBody()
    });
});
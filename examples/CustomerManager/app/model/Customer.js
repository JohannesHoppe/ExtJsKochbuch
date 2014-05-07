Ext.define('CM.model.Customer', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.reader.Json'
    ],

    fields: ['Id', 'FirstName', 'LastName', 'Mail']
});
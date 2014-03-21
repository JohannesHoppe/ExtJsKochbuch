Ext.define('CM.store.Customers', {
    extend: 'Ext.data.Store',
    model: 'CM.model.Customer',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {

            // CHANGME !!
            read: 'http://ex.extjs-kochbuch.de/api/customer',
            update: 'http://ex.extjs-kochbuch.de/api/customer'
        },
        reader: {
            type: 'json',
            root: 'Data',
            totalProperty: 'Total',
            successProperty: 'success'
        }
    }
});
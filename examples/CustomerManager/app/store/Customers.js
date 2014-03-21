Ext.define('CM.store.Customers', {
    extend: 'Ext.data.Store',
    model: 'CM.model.Customer',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {

            // CHANGME !!
            read: 'http://localhost:7777/api/customer',
            update: 'http://localhost:7777/api/customer'
        },
        reader: {
            type: 'json',
            root: 'Data',
            totalProperty: 'Total',
            successProperty: 'success'
        }
    }
});
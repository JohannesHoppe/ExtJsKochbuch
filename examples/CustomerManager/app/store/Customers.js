Ext.define('CM.store.Customers', {
    extend: 'Ext.data.Store',
    model: 'CM.model.Customer',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {

            /* Real REST API (on remote server) */
            // read: 'http://ex.extjs-kochbuch.de/api/customer',
            // update: 'http://ex.extjs-kochbuch.de/api/customer'

            /* Static files (on local server) */
            read: 'data/customers.json',
            update: 'data/updateCustomers.json'
        },
        reader: {
            type: 'json',
            root: 'Data',
            totalProperty: 'Total',
            successProperty: 'success'
        }
    }
});
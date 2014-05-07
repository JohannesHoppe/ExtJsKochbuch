Ext.define('CM.controller.Customers', {
    extend: 'Ext.app.Controller',

    stores: ['Customers@CM.store'],
    models: ['Customer@CM.model'],
    views: ['Edit@CM.view.customer','List@CM.view.customer'],

    refs: [{
        ref: 'customersPanel',
        selector: 'panel'
    }],

    init: function () {
        this.control({
            'viewport > customerlist': {
                itemdblclick: this.editCustomer
            },
            'customeredit button[action=save]': {
                click: this.updateCustomer
            }
        });
    },

    editCustomer: function (grid, record) {
        var edit = Ext.create('CM.view.customer.Edit').show();
        edit.down('form').loadRecord(record);
    },

    updateCustomer: function (button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getCustomersStore().sync();
    }
});

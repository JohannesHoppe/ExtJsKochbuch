Ext.define('CM.view.customer.List', {
    extend: 'Ext.grid.Panel',
    alias : 'widget.customerlist',

    title : 'Alle Kunden',
    store: 'Customers',

    columns: [
        { header: 'Id',  dataIndex: 'Id', width: 100 },
        { header: 'Vorname',  dataIndex: 'FirstName'  },
        { header: 'Nachname', dataIndex: 'LastName'  },
        { header: 'E-Mail',   dataIndex: 'E-Mail', flex: 1}
    ]
});

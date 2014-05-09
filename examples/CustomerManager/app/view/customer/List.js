Ext.define('CM.view.customer.List', {
    extend: 'Ext.grid.Panel',
    // inheritence example: 'Responsive Grid'
    // extend: 'CM.view.ResponsiveGrid',
    alias : 'widget.customerlist',

    title : 'Alle Kunden',
    store: 'Customers',

    ui: 'green-panel',

    columns: [
        { header: 'Id',  dataIndex: 'Id', flex: 10 },
        { header: 'Vorname', dataIndex: 'FirstName', flex: 20 },
        { header: 'Nachname', dataIndex: 'LastName', flex: 30 },
        { header: 'E-Mail', dataIndex: 'Mail', flex: 40 }
    ]
});
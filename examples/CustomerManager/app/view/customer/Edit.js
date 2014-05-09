Ext.define('CM.view.customer.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.customeredit',

    requires: ['Ext.form.Panel'],

    title : 'Kunden Bearbeiten',
    layout: 'fit',
    autoShow: true,
    width: 280,

    //ui: 'green-window',

    initComponent: function () {
        this.items = [
            {
                xtype: 'form',
                padding: '5 5 0 5',
                border: false,
                style: 'background-color: #fff;',

                items: [
                    {
                        xtype: 'textfield',
                        name : 'FirstName',
                        fieldLabel: 'Vorname'
                    },
                    {
                        xtype: 'textfield',
                        name : 'LastName',
                        fieldLabel: 'Nachname'
                    },
                    {
                        xtype: 'textfield',
                        name: 'Mail',
                        fieldLabel: 'E-Mail'
                    }
                ]
            }
        ];

        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});

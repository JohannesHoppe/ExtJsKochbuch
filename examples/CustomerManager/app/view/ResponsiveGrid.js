Ext.define('CM.view.ResponsiveGrid', {
    //override: 'Ext.grid.Panel',
    extend: 'Ext.grid.Panel',

    constructor: function () {
        console.log("override active!");

        this.callParent(arguments);

        
        this.on('itemclick', function (el, record, item, index, e, eOpts) {

            if (record.data &&
                record.data.FirstName &&
                record.data.FirstName == "Katie") {
            
                this.down('#smilie').show();
            }
        });

    },

    dockedItems: [
        {
            id: 'smilie',
            xtype: 'toolbar',
            dock: 'top',
            width: 200,
            items: [{
                xtype: 'button',
                text: ':-)'
            }],
            hidden: true
        }
    ],

    listeners: {
        
        resize: function (el, width, height, oldWidth, oldHeight) {
            
            var amountOfColumns = this.columns.length - 1;
            if (!amountOfColumns) {
                return;
            }
            if (width < 600) {
                console.log('hide!');
                this.columns[amountOfColumns].hide();
            } else {
                console.log('show!');
                this.columns[amountOfColumns].show();
            }
        }
    }
    

});
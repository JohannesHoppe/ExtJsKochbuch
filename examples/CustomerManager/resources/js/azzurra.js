Ext.define('Ext.window.WindowActiveCls', {
    override: 'Ext.window.Window',

    statics: {
        _activeWindow: null
    },

    shadow: false,
    ghost: false,
    ui: 'blue-window-active',
    border: false,
    setActive: function (active, newActive) {

        this.callParent(arguments);

        var me = this;

        if (!me.el)
            return;

        if (Ext.getVersion().version >= '4.2.2.1144') {
            if (me.id.indexOf('window') == 0 && me.id.indexOf('-ghost') > 0)
                return;
        }

        var paw = Ext.window.Window._activeWindow;

        if (active) {
            me.addCls('x-window-active');
            
            Ext.window.Window._activeWindow = me;

            if (paw && paw != me && paw.el) {
                paw.removeCls('x-window-active');
            }
        } else {
            if (me!=paw)
                me.removeCls('x-window-active');
        }
    }
});

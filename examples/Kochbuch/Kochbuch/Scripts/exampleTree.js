var exampleTree = (function (Ext, tabManager) {
      
    var onTreeItemClick = function (record, e) {
        if (record.isLeaf()) {

            e.stopEvent();
            tabManager.addTab({
                url: record.get('href'),
                id: record.getId(),
                title: record.get('text'),
                iconCls: record.get('iconCls')
            });
        } else {
            record[record.isExpanded() ? 'collapse' : 'expand']();
        }
    };

    // enables navigation via keyboard
    var onTreeAfterRender = function (tree) {
        var sm = tree.getSelectionModel();

        Ext.create('Ext.util.KeyNav', tree.view.el, {
            enter: function (e) {
                if (sm.hasSelection()) {
                    onTreeItemClick(sm.getSelection()[0], e);
                }
            }
        });
    };

    return {
        onTreeAfterRender: onTreeAfterRender,
        onTreeItemClick: onTreeItemClick
    };

})(window.Ext, window.tabManager);
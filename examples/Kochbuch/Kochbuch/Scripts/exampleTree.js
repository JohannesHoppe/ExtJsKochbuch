var exampleTree = (function (Ext) {
  
    var loadExample = function (href, id, title) {
        
    };

    var onTreeItemClick = function (record, e) {
        if (record.isLeaf()) {
            e.stopEvent();
            loadExample(record.get('href'), record.getId(), record.get('text'));
        } else {
            record[record.isExpanded() ? 'collapse' : 'expand']();
        }
    };

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

})(window.Ext);
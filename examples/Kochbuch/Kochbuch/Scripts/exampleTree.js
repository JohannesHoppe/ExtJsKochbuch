var exampleTree = (function (Ext, tabManager, hash) {
      
    var onItemClick = function (view, record, item, index, e) {
        if (record.isLeaf()) {

            e.stopEvent();
            tabManager.addTab({
                url: record.get('href'),
                id: record.getId(),
                title: record.get('text'),
                iconCls: record.get('iconCls')
            });

            hash.add({
                ex: record.getId()
            });
            
        } else {
            record[record.isExpanded() ? 'collapse' : 'expand']();
        }
    };

    // enables navigation via keyboard
    var onAfterRender = function (tree) {
        var selectionModel = tree.getSelectionModel();

        Ext.create('Ext.util.KeyNav', tree.view.el, {
            enter: function (e) {
                if (selectionModel.hasSelection()) {
                    onItemClick(selectionModel.getSelection()[0], e);
                }
            }
        });

        tree.expandAll();
    };

    var firstLoad = true;

    var onLoad = function (store, node, records, successful, eOpts) {

        if (!firstLoad) {
            return;
        }

        var exampleId = hash.get("ex");
        
        if (exampleId) {

            var record = store.getById(exampleId);
            if (record) {
                tabManager.addTab({
                    url: record.get('href'),
                    id: record.getId(),
                    title: record.get('text'),
                    iconCls: record.get('iconCls')
                });
                
                var selectionModel = store.ownerTree.getSelectionModel();
                //store.ownerTree.expandNode(record, true);
                selectionModel.select(record);
            }
        }

        firstLoad = false;
    };

    return {
        onAfterRender: onAfterRender,
        onItemClick: onItemClick,
        onLoad: onLoad
    };

})(window.Ext, window.tabManager, window.hash);
var exampleTree = (function (Ext, App) {

    var lookup = {};

    var makeTab = function (id, url, title) {
        var win,
            tab,
            hostName,
            exampleName,
            node = App.exampleTree.getStore().getNodeById(id),
            tabTip;

        if (id === "-") {
            id = Ext.id(undefined, "extnet");
            lookup[url] = id;
        }

        tabTip = url.replace(/^\//g, "");
        tabTip = tabTip.replace(/\/$/g, "");
        tabTip = tabTip.replace(/\//g, " > ");
        tabTip = tabTip.replace(/_/g, " ");

        win = new Ext.Window({
            id: "w" + id,
            layout: "fit",
            title: "Source Code",
            iconCls: "#PageWhiteCode",
            width: 925,
            height: 650,
            border: false,
            maximizable: true,
            constrain: true,
            closeAction: "hide",
            listeners: {
                show: {
                    fn: function () {
                        var height = Ext.getBody().getViewSize().height;

                        if (this.getSize().height > height) {
                            this.setHeight(height - 20)
                        }

                        this.body.mask("Loading...", "x-mask-loading");
                        Ext.Ajax.request({
                            url: "ExampleLoader.ashx",
                            success: function (response) {
                                this.body.unmask();
                                eval(response.responseText);
                            },
                            failure: function (response) {
                                this.body.unmask();
                                Ext.Msg.alert("Failure", "The error during example loading:\n" + response.responseText);
                            },
                            params: {
                                id: id,
                                url: url,
                                wId: this.nsId
                            },
                            scope: this
                        });
                    },

                    single: true
                }
            },
            buttons: [
                {
                    id: "b" + id,
                    text: "Download",
                    iconCls: "#Compress",
                    listeners: {
                        click: {
                            fn: function (el, e) {
                                window.location = "/GenerateSource.ashx?t=1&e=" + url;
                            }
                        }
                    }
                }
            ]
        });

        hostName = window.location.protocol + "//" + window.location.host;
        exampleName = url;

        tab = App.ExampleTabs.add(new Ext.Panel({
            id: id,
            tbar: [{
                text: "Source Code",
                iconCls: "#PageWhiteCode",
                listeners: {
                    "click": function () {
                        Ext.getCmp("w" + id).show(null);
                    }
                }
            },
            "->",
            {
                text: "Direct Link",
                iconCls: "#Link",
                handler: function () {
                    new Ext.Window({
                        modal: true,
                        iconCls: "#Link",
                        layout: "absolute",
                        defaultButton: "dl" + id,
                        width: 400,
                        height: 110,
                        title: "Direct Link",
                        closable: false,
                        resizable: false,
                        items: [{
                            id: "dl" + id,
                            xtype: "textfield",
                            cls: "dlText",
                            width: 364,
                            x: 10,
                            y: 10,
                            selectOnFocus: true,
                            readOnly: true,
                            value: hostName + "/#" + exampleName
                        }],
                        buttons: [{
                            xtype: "button",
                            text: " Open",
                            iconCls: "#ApplicationDouble",
                            tooltip: "Open Example in the separate window",
                            handler: function () {
                                window.open(hostName + "/#" + exampleName);
                            }
                        },
                        {
                            xtype: "button",
                            text: " Open (Direct)",
                            iconCls: "#ApplicationGo",
                            tooltip: "Open Example in the separate window using a direct link",
                            handler: function () {
                                window.open(hostName + "/Examples" + url, "_blank");
                            }
                        },
                        {
                            xtype: "button",
                            text: "Close",
                            handler: function () {
                                this.findParentByType("window").hide(null);
                            }
                        }]
                    }).show(null);
                }
            },
            "-",
            {
                text: "Refresh",
                handler: function () {
                    Ext.getCmp(id).reload(true)
                },
                iconCls: "#ArrowRefresh"
            }],
            title: title,
            tabTip: tabTip,
            hideMode: "offsets",

            loader: {
                scripts: true,
                url: hostName + "/Examples" + url,
                renderer: "frame",
                listeners: {
                    beforeload: function () {
                        this.target.body.mask('Loading...');
                    },
                    load: {
                        fn: function (loader) {
                            var frame = loader.target.getBody();

                            if (!frame.Ext) {
                                swapThemeClass(frame, "", Ext.net.ResourceMgr.theme);
                            }

                            this.target.body.unmask();
                        }
                    }
                }
            },
            listeners: {
                deactivate: {
                    fn: function (el) {
                        if (this.sWin && this.sWin.isVisible()) {
                            this.sWin.hide();
                        }
                    }
                },

                destroy: function () {
                    if (this.sWin) {
                        this.sWin.close();
                        this.sWin.destroy();
                    }
                }
            },
            closable: true
        }));

        tab.sWin = win;
        setTimeout(function () {
            App.ExampleTabs.setActiveTab(tab);
        }, 250);

        var expandAndSelect = function (node) {
            var view = App.exampleTree.getView(),
                originalAnimate = view.animate;

            view.animate = false;
            node.bubble(function (node) {
                node.expand(false);
            });

            App.exampleTree.getSelectionModel().select(node);
            view.animate = originalAnimate;
        };

        if (node) {
            expandAndSelect(node);
            createTagItems(tab, node);
        } else {
            App.exampleTree.on("load", function (node) {
                node = App.exampleTree.getStore().getNodeById(id);
                if (node) {
                    expandAndSelect(node);
                    createTagItems(tab, node);
                }
            }, this, { delay: 10, single: true });
        }
    };

    var loadExample = function (href, id, title) {
        var tab = App.ExampleTabs.getComponent(id);

        if (id == "-") {
            App.direct.GetHashCode(href, {
                success: function (result) {
                    loadExample(href, "e" + result, title);
                }
            });

            return;
        }

        lookup[href] = id;

        if (tab) {
            App.ExampleTabs.setActiveTab(tab);
        } else {
            if (Ext.isEmpty(title)) {
                var m = /(\w+)\/$/g.exec(href);
                title = m == null ? "[No Name]" : m[1];
            }

            title = title.replace(/_/g, " ");
            makeTab(id, href, title);
        }
    };

    var onTreeItemClick = function (record, e) {
        if (record.isLeaf()) {
            e.stopEvent();
            loadExample(record.get('href'), record.getId(), record.get('text'));
        } else {
            record[record.isExpanded() ? 'collapse' : 'expand']();
        }
    };

    var onTreeAfterRender = function(tree) {
        var sm = tree.getSelectionModel();

        Ext.create('Ext.util.KeyNav', tree.view.el, {
            enter: function(e) {
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

})(window.Ext, window.App);
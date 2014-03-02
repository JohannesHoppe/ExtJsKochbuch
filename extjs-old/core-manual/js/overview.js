/**
 * @author Tommy
 */
Ext.ns('Ext.app');

Ext.app.Overview = (function(){
    var menu, 
        content,
        sectionScrolls = [],
        active,
        wrap,
        corners = [],
        minHeight = 600,
        activeContentSection,
        contentHeight = minHeight;
    
    return {
        init : function() {
            // Initializing the application
            menu = Ext.get('manual-nav');
            content = Ext.get('content');
            wrap = Ext.get('content-wrap');
            
            this.initMarkup();
            this.initEvents();
            
            this.syncHeight();
            
            // by default navigate to the overview
            this.navigateTo(menu.child('li.group', true));       
        },
        
        initMarkup : function() {
            var me = this;
            
            // create corners for each tabgroup
            Ext.each(menu.query('li.group'), function() {
                me.createCorner(this, 'top-left');
                me.createCorner(this, 'bottom-left');
            });
            
            // create corners for the content panel
            corners.push(me.createCorner(wrap, 'top-left'));
            corners.push(me.createCorner(wrap, 'top-right'));
            corners.push(me.createCorner(wrap, 'bottom-left'));
            corners.push(me.createCorner(wrap, 'bottom-right'));
        },
        
        initEvents : function() {
            menu.on('click', this.onMenuClick, this);
            content.on('scroll', this.onContentScroll, this);
        },
        
        createCorner: function(el, pos){
            return Ext.fly(el).createChild({
                cls: 'box-corner box-corner-' + pos
            });
        },
        
        onMenuClick: function(e){
            if (e.button != 0) {
                return;
            }
            e.preventDefault();
            var t = this.findTargets(e);
            if (t.expand) {
                this.toggleGroup(t.group);
            }
            else if (t.group) {
                if(t.group !== active) {
                    this.expandGroup(t.group);
                }                
                this.navigateTo(t.group, t.section);
            }
            if(t.link) {
                t.link.blur();
            }
        },
        
        findTargets : function(e) {
            var el = e.getTarget('li', menu);
            if (el) {
                return {
                    expand: e.getTarget('a.group-expand-btn', menu),
                    group: e.getTarget('li.group', menu),
                    section: e.getTarget('a.section-title', menu),
                    link: e.getTarget('a', menu)
                };
            }
            
            return {
                expand: null,
                group: null,
                section: null,
                link: null
            };          
        },
        
        onContentScroll : function(e) {
            var scrollPerc = content.dom.scrollTop / (content.dom.scrollHeight - contentHeight);
            Ext.each(sectionScrolls, function() {
                if(
                    this.section !== activeContentSection &&  
                    scrollPerc >= this.from && 
                    scrollPerc < this.to
                ) {
                    activeContentSection = this.section;
                    var link = menu.child('a.section-title[href$="' + this.section.id + '"]');
                    menu.select('li.section-active').removeClass('section-active');
                    if(link) {                        
                        link.parent().addClass('section-active');
                    }                    
                }
            });
        },
        
        updateContentSections : function() {
            var sections = content.select('div.sect'),
                totalHeight = content.dom.scrollHeight,
                itemHeight,
                previous = {
                    section: null,
                    from: 0,
                    to: 0,
                    bottom: 0
                };
                
            sectionScrolls = [];
            contentHeight = content.getHeight();              
            sections.each(function(item, sections, index) {
                itemHeight = item.getOffsetsTo(content)[1] - previous.bottom + item.getHeight();
                sectionScrolls.push({
                    section: item.dom,
                    from: previous.to,
                    to: previous.to + (itemHeight / totalHeight),
                    bottom: previous.bottom + itemHeight
                });                
                previous = sectionScrolls[sectionScrolls.length-1];
            });
        },
        
        navigateTo : function(group, section) {
            section = section || false;
            Ext.fly(document.body).scrollTo('top', 0);        
            Ext.fly(group).radioClass('group-active');
                     
            var href = Ext.fly(group).child('a.group-title', true).href;
            var afterLoad = function() {
                if(section) {
                    var contentSection = Ext.get(section.href.split('#')[1]);
                    if(contentSection) {
                        content.scrollTo('top', contentSection.getOffsetsTo(content)[1] + content.dom.scrollTop);
                        (function() {
                            menu.select('li.section-active').removeClass('section-active');
                            activeContentSection = contentSection.dom;
                            Ext.fly(section).parent('li').addClass('section-active');
                            contentSection.highlight();                            
                        }).defer(50);
                    }
                }
                else {
                    content.scrollTo('top', '0');
                    (function() {
                        menu.select('li.section-active').removeClass('section-active');
                        Ext.fly(group).child('li').addClass('section-active');
                    }).defer(50);                    
                }
                if(active !== group) {
                    this.updateContentSections();
                }
                active = group;
            }
            
            if(group !== active) {
                menu.select('li.section-active').removeClass('section-active');
                content.load({
                    url: href,
                    callback: afterLoad, 
                    scope: this
                });
            } else {
                afterLoad();
            }
        },
        
        toggleGroup : function(group) {
            Ext.fly(group).toggleClass('group-expanded');
            this.syncHeight();
        },
        
        expandGroup : function(group) {
            Ext.fly(group).addClass('group-expanded');
            this.syncHeight();                
        },
        
        syncHeight : function() {
            menu.setHeight();
            var height = Math.max(minHeight, menu.getHeight());
            menu.setHeight(height);
            content.setHeight(height - wrap.getPadding('t,b'));
            if(Ext.isBorderBox) {
                corners[2].removeClass('box-corner').addClass('box-corner');
                corners[3].removeClass('box-corner').addClass('box-corner');
            }
            this.updateContentSections();
        }
    }
})();

Ext.onReady(Ext.app.Overview.init, Ext.app.Overview);

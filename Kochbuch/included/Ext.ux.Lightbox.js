/*!
 * Based on the lightbox implementation in Ext Core Library 3.0
 * http://www.lyquidity.com/
 * Copyright(c) 2012, Lyquidity Solutions Limited.
 *
 * MIT Licensed - http://extjs.com/license/mit.txt
 */
Ext.define('Ext.ux.Lightbox', {

    extend: 'Ext.Component',
    alias: 'widget.lightbox',

    id: 'ux-lightbox',
    /**
     * @cfg {int} activeImage The index of the current image.
     */
    activeImage: undefined,
    /**
     * @cfg {boolean} animate True if the image change transition is to be animated.
     */
    animate: true,
    /**
     * @cfg {int} borderSize The size of the image border.
     */
    borderSize: 10,
    /**
     * @cfg {string} labelImage The term for 'image'.
     */
    labelImage: "Image",
    /**
     * @cfg {string} labelOf The term for 'of' as in '3 of 7'.
     */
    labelOf: "of",
    /**
     * @cfg {int} overlayOpacity The relativ opacity of the overlay (background). Default: 0.85.
     */
    overlayOpacity: 0.85,
    /**
     * @cfg {HtmlElement} renderTo The element to which the lightbox will be rendered.  Defaults to the body.
     */
    renderTo: Ext.getBody(),
    /**
     * @cfg {int} resizeSpeed Time in milliseconds for the lightbox to resize to a new image. Default: 600ms.
     */
    resizeSpeed: 600,
    /**
     * @cfg {string} containerTag The tag which contains the <img> tag. Default: 'a'.
     */
    containerTag: 'a',
    /**
     * @cfg {string} missingImage The image to use to represent a missing image. Default: missing.png.
     */
    missingImage: 'missing.png',

    childEls: ['outerImageContainer', 'imageContainer', 'image', 'hoverNav', 'navPrev', 'navNext',
        'outerDataContainer', 'dataContainer', 'data', 'details', 'caption', 'imageNumber', 'bottomNav', 'navClose'],

    initComponent: function()
    {
        var me = this;

        // This weirdness is here because I'm simulating what happens in the Designer
        // which has a bug because renderTpl is set to null by ExtJS so Ext.applyIf()
        // has no effect.  Setting renderTpl to undefined solves the problem.
        // You can remove this by using Ext.apply() instead or by moving the renderTpl
        // out of the initComponent function.

        this.renderTpl = undefined;

        Ext.applyIf(me, {
            renderTpl: [
                '<div id="ux-lightbox-outerImageContainer">',
                '   <div id="ux-lightbox-imageContainer">',
                '       <img id="ux-lightbox-image">',
                '           <div id="ux-lightbox-hoverNav">',
                '               <a href="#" id="ux-lightbox-navPrev"></a>',
                '               <a href="#" id="ux-lightbox-navNext"></a>',
                '           </div>',
                '   </div>',
                '</div>',
                '<div id="ux-lightbox-outerDataContainer">',
                '   <div id="ux-lightbox-dataContainer">',
                '       <div id="ux-lightbox-data">',
                '           <div id="ux-lightbox-details">',
                '               <span id="ux-lightbox-caption"></span>',
                '               <span id="ux-lightbox-imageNumber"></span>',
                '           </div>',
                '           <div id="ux-lightbox-bottomNav">',
                '               <a href="#" id="ux-lightbox-navClose"></a>',
                '           </div>',
                '       </div>',
                '   </div>',
                '</div>'
            ],
            images: [],
            selectors: [],
            listeners: {
                beforerender: {
                    fn: me.onComponentBeforeRender,
                    scope: me
                },
                afterrender: {
                    fn: me.onComponentAfterRender,
                    scope: me
                }
            }
        });

        this.resizeDuration = this.animate ? this.resizeSpeed : 0;
        this.overlayDuration = this.animate ? 200 : 0;

        this.addEvents('open', 'close');
        this.callParent(arguments);
    },

    onComponentBeforeRender: function () {
        var me = this;

        this.shim = Ext.DomHelper.append( this.renderTo,
            {
                tag: 'iframe',
                id: 'ux-lightbox-shim'
            }, true);

        this.overlay = Ext.DomHelper.append(this.renderTo, {
            id: 'ux-lightbox-overlay'
        }, true);
    },

    onComponentAfterRender: function (container, position) {
        var me = this;

        Ext.each([this.overlay, this.shim, this.el], function(el){
            el.setVisibilityMode(Ext.Element.DISPLAY).hide();
        });

        this.setVisible(false).setPosition(0, 20);

        var size = (this.animate ? 250 : 1);
        this.outerImageContainer.setSize(size,size);
        this.outerDataContainer.setWidth(size).hide();

        // Initialize events
        var close = function(ev)
        {
            ev.preventDefault();
            this.close();
        };

        this.overlay.on('click', close, this);
        this.navClose.on('click', close, this);

        this.el.on('click', function(ev)
        {
            if(ev.getTarget().id == this.getId())
                this.close();
        }, this);

        this.navPrev.on('click', function(ev)
        {
            ev.preventDefault();
            this.setImage(this.activeImage - 1);
        }, this);

        this.navNext.on('click', function(ev)
        {
            ev.preventDefault();
            this.setImage(this.activeImage + 1);
        }, this);
    },

    /**
     * Called by user to register the images to include in the lightbox
     * @property register
     * @type Function
     * @param {String} The selector to find the images in 'container' to register
     * @param {boolean} True if the images are a group
     * @param {String} The container which holds the images to use. Default: body
     */
    register: function(sel, group, container)
    {
        this.thumbnailContainer = container
            ? container
            : Ext.getBody();

        if (this.renderTo != Ext.getBody())
        {
            this.renderTo.setStyle({position:'relative'});
        }

        var selector = {sel: sel, group: group};

        var length = Ext.Array.filter(this.selectors, function(item) { return item.sel === sel; }, this).length;
        if(length === 0)
        {
            this.selectors.push(selector);
            // This ability to use functions like 'on' against the result of Ext.fly() or Ext.select() is good
            Ext.select(sel, true, this.thumbnailContainer.dom).on('click', this.click, this);
        }
    },

    /**
     * Private function to handle the image click event
     * @property click
     * @type Function
     * @param {HTMLElement} ev The contained item pressed
     */
    click: function(ev)
    {
        try
        {
            // Get the parent of the clicked element which is the container
            var up = Ext.get(ev.target).up(this.containerTag);
            var target = undefined;
            var selector = undefined;

            Ext.each(this.selectors, function(item)
            {
                var els = Ext.select(item.sel, true);
                var i = els.indexOf(up);
                if (i === -1) return;
                target = ev.getTarget(item.sel);
                selector = item;
            }, true );

            if (target)
            {
                ev.preventDefault();
                this.open(target, selector.sel, selector.group);
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    },

    remove: function()
    {
        this.clear();

        Ext.enableNestedListenerRemoval = true;
        Ext.each([this.overlay, this.shim], function(node)
        {
            if (!node) return;
            Ext.removeNode(node.dom);
            delete node;
        });

        this.destroy();
    },

    /**
     * Clears the click events on all registered images
     * @property clear
     * @type Function
     */
    clear: function()
    {
        this.close();
        if (!this.selectors) return;

        Ext.each(this.selectors, function(item)
        {
            Ext.select(item.sel, true, this.thumbnailContainer.dom).un('click', this.click, this);
        },this);
        this.selectors = [];
        this.images = [];
    },

    /**
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load
     * @property launch
     * @type Function
     * @param {HTMLElement} image The element containing the item to display
     * @param {String} sel The selector for the image
     * @param {Boolean} group True if this image is part of a group
     */
    open: function(image, sel, group)
    {
        // Close the image if on is already open
        if (this.isVisible())
        {
            Ext.callback( this.close, this, [this.open,image, sel, group] );
            return;
        }

        group = group || false;
        this.setViewSize();
        this.overlay.setTop(0);
        this.overlay.setLeft(0);
        this.overlay.show();
        this.overlay.setOpacity(0);

        this.overlay.fadeIn({
            duration: this.overlayDuration,
            opacity: this.overlayOpacity,
            callback: function() {
                this.images = [];

                var index = 0;
                if(!group) {
                    this.images.push([image.href, image.title]);
                }
                else {
                    var setItems = Ext.query(sel,this.thumbnailContainer);
                    Ext.each(setItems, function(item){
                        var href = item.href;
                        href = item.getAttribute('href');
                        if(href) {
                            this.images.push([href, item.title]);
                        }
                    }, this);

                    while (index < this.images.length && this.images[index][0] != image.getAttribute('href')) {
                        index++;
                    }

                }

                // calculate top and left offset for the lightbox
                var pageScroll = Ext.fly(this.renderTo.dom).getScroll();

                var size = this.getViewSize();
                var lightboxLeft = pageScroll.left;
                this.setHeight(size.height);
                this.setWidth(size.width);
                this.setVisible(true);

                this.setImage(index);

                this.fireEvent('open', index == this.images.length ? undefined : this.images[index]);
            },
            scope: this
        });
    },

    setViewSize: function()
    {
        var viewSize = this.getViewSize();
        this.overlay.setStyle({
            width: viewSize.width + 'px',
            height: viewSize.height + 'px'
        });
        this.shim.setStyle({
            width: viewSize.width + 'px',
            height: viewSize.height + 'px'
        }).show();
    },

    setImage: function(index)
    {
        this.activeImage = index;

        this.disableKeyNav();
        if (this.animate)
            this.showMask();

        this.image.fadeOut({
            duration: this.resizeDuration,
            scope: this,
            callback: function()
            {
                this.image.hide();
                delete this.lastImage;
                this.hoverNav.hide();
                this.navPrev.hide();
                this.navNext.hide();
                this.dataContainer.setOpacity(0.0001);
                this.imageNumber.hide();

                var imageSrc = (this.activeImage >= this.images.length)
                    ? this.missingImage
                    : this.images[this.activeImage][0];

                this.preview = Ext.create('Ext.Img',
                    {
                        src: imageSrc,
                        hidden: true,
                        renderTo: Ext.getBody(),
                        listeners : {
                            load : {
                                element : 'el',  //the rendered img element
                                fn : function()
                                {
                                    this.image.dom.src = this.preview.src;
                                    this.resizeImage(this.preview.el.dom.width, this.preview.el.dom.height);
                                    Ext.removeNode(this.preview.el.dom);
                                    delete this.preview;
                                },
                                scope: this
                            }
                        }
                    });
            }
        });
    },

    resizeImage: function(w, h)
    {
        this.hideMask();

        var wCur = this.outerImageContainer.getWidth();
        var hCur = this.outerImageContainer.getHeight();

        // The w and h could exceed the displayable area so this
        // should be checked and the w/h changed accordingly.

        var guesstimateDetailsSize = 60;

        var size = this.getViewSize();
        while ((w+this.borderSize * 2 > size.width) || (h+this.borderSize * 2 + guesstimateDetailsSize > size.height))
        {
            if (w+this.borderSize * 2 > size.width)
            {
                // Compute the new width
                var wtemp = size.width - this.borderSize * 2;
                // Compute the corresponding height so the aspect ratio remains the same
                var htemp = Math.abs(wtemp/w*h);

                w = wtemp;
                h = htemp;
            }

            if (h+this.borderSize * 2 + guesstimateDetailsSize > size.height)
            {
                // Compute the new height
                var htemp = size.height - guesstimateDetailsSize - this.borderSize * 2;
                // Compute the corresponding width so the aspect ratio remains the same
                var wtemp = Math.abs(htemp/h*w);

                w = wtemp;
                h = htemp;
            }

        }

        var wNew = (w + this.borderSize * 2);
        var hNew = (h + this.borderSize * 2);

        var wDiff = wCur - wNew;
        var hDiff = hCur - hNew;

        var afterResize = function(){
            this.hoverNav.setWidth(this.imageContainer.getWidth() + 'px');

            this.navPrev.setHeight(h + 'px');
            this.navNext.setHeight(h + 'px');

            this.outerDataContainer.setWidth(wNew + 'px');
            this.outerDataContainer.show();

            this.showImage(w,h);
        };

        if (hDiff != 0 || wDiff != 0)
        {
            this.outerImageContainer.animate(
                {
                    height: hNew,
                    width: wNew,
                    duration: this.resizeDuration,
                    scope: this,
                    callback: afterResize,
                    delay: 50
                });
        }
        else
        {
            afterResize.call(this);
        }
    },

    hideMask: function()
    {
        if (Ext.getVersion().major === 4 && Ext.getVersion().minor === 0)
        {
            if (!this.mask) return
            this.mask.hide();
        }
        else
            this.imageContainer.unmask();
    },

    showMask: function()
    {
        if (Ext.getVersion().major === 4 && Ext.getVersion().minor === 0)
        {
            if (!this.mask)
            {
                this.mask = new Ext.LoadMask(this.imageContainer, {});
            }
            this.mask.show();
        }
        else
            this.imageContainer.mask('Loading image...');
    },

    showImage: function(w,h)
    {
        // Is it already displayed?
        if (this.lastImage && this.lastImage == this.image.dom.src)
            return;

        this.lastImage = this.image.dom.src;

        this.image.setWidth(w);
        this.image.setHeight(h);
        this.image.setOpacity(0);
        this.image.show({
            duration: this.resizeDuration,
            scope: this,
            callback: this.updateDetails()
        });
        this.preloadImages();
    },

    updateDetails: function()
    {
        var detailsWidth = this.data.getWidth(true) - this.navClose.getWidth() - 10;
        this.details.setWidth((detailsWidth > 0 ? detailsWidth : 0) + 'px');

        this.caption.update((this.activeImage >= this.images.length) ? '' : this.images[this.activeImage][1]);

        this.caption.show();
        if (this.images.length > 1) {
            this.imageNumber.update(this.labelImage + ' ' + (this.activeImage + 1) + ' ' + this.labelOf + ' ' + this.images.length);
            this.imageNumber.show();
        }

        this.dataContainer.fadeIn({
            duration: this.resizeDuration/2,
            scope: this,
            callback: function() {
                var viewSize = this.getViewSize();
                this.overlay.setHeight(viewSize.height + 'px');

                var total = this.outerDataContainer.getHeight() + this.outerImageContainer.getHeight();
                this.setHeight(total);
                var position = this.getPosition(true);
                var distance = Math.abs((this.getViewSize().height - total)/2) - position[1];

                this.el.move("b", distance, {
                    duration: this.resizeDuration,
                    scope: this,
                    callback: this.updateNav()
                });
            }
        });
    },

    updateNav: function()
    {
        this.enableKeyNav();

        this.hoverNav.show();

        // if not first image in set, display prev image button
        if (this.activeImage > 0)
            this.navPrev.show();

        // if not last image in set, display next image button
        if (this.activeImage < (this.images.length - 1))
            this.navNext.show();
    },

    enableKeyNav: function()
    {
        Ext.fly(this.renderTo.dom).on('keydown', this.keyNavAction, this);
    },

    disableKeyNav: function()
    {
        Ext.fly(this.renderTo.dom).un('keydown', this.keyNavAction, this);
    },

    keyNavAction: function(ev)
    {
        var keyCode = ev.getKey();

        if (
            keyCode == 88 || // x
                keyCode == 67 || // c
                keyCode == 27
            ) {
            this.close();
        }
        else if (keyCode == 80 || keyCode == 37){ // display previous image
            if (this.activeImage != 0){
                this.setImage(this.activeImage - 1);
            }
        }
        else if (keyCode == 78 || keyCode == 39){ // display next image
            if (this.activeImage != (this.images.length - 1)){
                this.setImage(this.activeImage + 1);
            }
        }
    },

    preloadImages: function()
    {
        var next, prev;
        if (this.images.length > this.activeImage + 1)
        {
            next = new Image();
            next.src = this.images[this.activeImage + 1][0];
        }
        if (this.activeImage > 0)
        {
            prev = new Image();
            prev.src = this.images[this.activeImage - 1][0];
        }
    },

    close: function(callback,image, sel, group)
    {
        if (!this.isVisible()) return;

        this.hideMask();
        this.disableKeyNav();
        this.setVisible(false);
        this.shim.hide();

        this.overlay.fadeOut({
            duration: this.overlayDuration,
            stopAnimation: true,
            scope: this,
            callback: function()
            {
                if (this.overlay)
                    this.overlay.hide();
                if (callback)
                    Ext.callback(callback, this, [image, sel, group], 1);
            }
        });

        this.fireEvent('close', this.activeImage);
    },

    getViewSize: function()
    {
        return {width: this.renderTo.getWidth(), height: this.renderTo.getHeight()};
    }
});
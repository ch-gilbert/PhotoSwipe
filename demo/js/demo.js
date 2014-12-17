(function() {
var initPhotoSwipeFromDOM = function(gallerySelector) {

    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            el,
            childElements,
            thumbnailEl,
            width,
            height,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {
            el = thumbElements[i];

            // include only element nodes
            if(el.nodeType !== 1) {
              continue;
            }

            childElements = el.children;

            width = el.getAttribute('data-width');
            height = el.getAttribute('data-height');

            // create slide object
            item = {
                src: el.getAttribute('href'),
                w: parseInt(width, 10),
                h: parseInt(height, 10)
            };

            item.el = el; // save link to element for getThumbBoundsFn

            if(childElements.length > 0) {
              item.msrc = childElements[0].getAttribute('src'); // thumbnail url
            }

            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return el.tagName === 'A';
        });

        if(!clickedListItem) {
            return;
        }

        var clickedGallery = clickedListItem.parentNode;

        var childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.children[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            barsSize: {top: 0, bottom: 0},
            captionEl: false,
            fullscreenEl: false,
            shareEl: false,
            bgOpacity: 0.95,
            tapToClose: true,
            tapToToggleControls: false,
            mainClass: 'pswp--minimal--dark',
            loop: false,
            history: false
        };

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

        gallery.init();
    };

    // select all gallery elements
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        //galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
};

initPhotoSwipeFromDOM('.demo-gallery');
})();
#jPageReader

API for generic page reader with only JS/HTML5/CSS3.

If the Browser or Webview supported HTML5, CSS3 and javascript correctly you can to use it with no fear. Initially, the interface from web reader is simples and there's a lot of things to do.

The next version will support:

1. Dynamic main content for page viewer.
2. Drag for next/previous page.
3. Loading image status.
4. Optimization code.

##How Use
```
/* Create an basic struct image */
jPageViewer.moduleImage.images = [
    {
        image: '1',
        extension: '.jpg',
        widthInitial: '',
        heightInitial: '',
        scaleInitial: 1,
        scaleCurrent: 1,
        x: 0,
        y: 0
    },
    {
        image: '2',
        extension: '.jpg',
        widthInitial: '',
        heightInitial: '',
        scaleInitial: 1,
        scaleCurrent: 1,
        x: 0,
        y: 0
    },
    {
        image: '3',
        extension: '.jpg',
        widthInitial: '',
        heightInitial: '',
        scaleInitial: 1,
        scaleCurrent: 1,
        x: 0,
        y: 0
    }
];

/* Set the images path and title edition */
jPageViewer.moduleImage.path = 'PATH_HERE';
jPageViewer.moduleImage.nameManga = 'NAME_EDITION';

/* And then, just call init function */
jPageViewer.init();
```

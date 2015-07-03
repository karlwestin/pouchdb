[PouchDB](http://pouchdb.com/) – The Database that Syncs!
=========

## This is a fork specifically for one application im taking part in developing. It has 3 patches that master doesn't: A different checkpoint system to avoid starting over, it allows the user to set the timeout for the changes feed, and it fixes a bug if replication stalls on an attachment.


[![Build Status](https://travis-ci.org/pouchdb/pouchdb.svg)](https://travis-ci.org/pouchdb/pouchdb)

PouchDB is an open-source JavaScript database inspired by [Apache CouchDB](http://couchdb.apache.org/) that is designed to run well within the browser.

PouchDB was created to help web developers build applications that work as well offline as they do online.

Using PouchDB
-------------

To get started using PouchDB, check out the [web site](http://pouchdb.com) and [API documentation](http://pouchdb.com/api.html).

Getting Help
------------

The PouchDB community is active [on Freenode IRC](irc://freenode.net/#pouchdb), in [the Google Groups mailing list](https://groups.google.com/forum/#!forum/pouchdb), and [on StackOverflow](http://stackoverflow.com/questions/tagged/pouchdb). Or you can [tweet @pouchdb](http://twitter.com/pouchdb)!

If you think you've found a bug in PouchDB, please write a reproducible test case and file [a Github issue](https://github.com/pouchdb/pouchdb/issues). We recommend [bl.ocks.org](http://bl.ocks.org/) for code snippets, because some iframe-based services like JSFiddle and JSBin do not support IndexedDB in all browsers. You can start with [this template](https://gist.github.com/nolanlawson/816f138a51b86785d3e6).

Nightly Build
----

If you like to live on the bleeding edge, you can find the PouchDB nightly builds at [pouchtest.com/nightly](http://pouchtest.com/nightly).

Contributing
------------

We're always looking for new contributors! If you'd like to try your hand at writing code, writing documentation, designing the website, writing a blog post, or answering [questions on StackOverflow](http://stackoverflow.com/search?tab=newest&q=pouchdb), then we'd love to have your input.

If you have a pull request that you'd like to submit, please read the [contributing guide](https://github.com/pouchdb/pouchdb/blob/master/CONTRIBUTING.md) for info on style, commit message format, and other (slightly!) nitpicky things like that. PouchDB is heavily tested, so you'll also want to check out the [testing guide](https://github.com/pouchdb/pouchdb/blob/master/TESTING.md).
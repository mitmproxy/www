---
title: "HAR Support"
date: 2023-08-28
weight: 10
tags: [
    "releases",
    "gsoc"
]
author:
  name: Nathaniel Good
  twitter: ngoodvi
---

We are excited to announce the release of [mitmproxy 10.1](https://github.com/mitmproxy/mitmproxy/releases/tag/v5.2)! 
<!--more-->

##### *Editorial Note:*

*Hi, my name is Nathaniel Good ([@stanleygvi](https://github.com/stanleygvi)) and i'm one of mitmproxy's [Google Summer of Code](https://summerofcode.withgoogle.com/) students this year.
My task was to implement the [import and export](https://github.com/mitmproxy/mitmproxy/commits?author=stanleygvi) functionality for HAR files in mitmproxy. Special thanks to my mentor [Maximilian Hils](@mhils) for his support and guidance throughout this project.*

## HAR files
HTTP Archive (HAR) files, are used by a variety of tools to store a log of the interactions a web browser made with a site. Numerous tools like Chrome, Firefox, and Insomnia have the capability to work with HAR files, allowing users to move data between these tools. After this update, mitmproxy will be able to transfer data between these tools as well.

## HAR Import
HAR files have a [specification](http://www.softwareishard.com/blog/har-12-spec/) they should follow, but unfortunately most tools slightly differ in their representation. We have taken this into account and made sure mitmproxy will be able to import most[^1] HAR representations.

We decided to improve upon the existing `FlowReader` class by adding support for HAR files. This approach handles the the import internally which does not change how a user would import a file.


### Loading the file on startup:

```
: mitmproxy -r example.har
```
### Loading the file using the client:
```
: view.flows.load example.har
```

## HAR Export
As previously stated, there are various representations of HAR files. We decided to follow Chrome's representation because their representation is the most compatable with other tools.


For exporting flows into a HAR file, we created a new addon: `exporthar`. This addon requires the same arugments as the `Save` function, and is executed the same way:

### Exporting from client
```
: exporthar @all example.har
```


[^1]: Tested tool representations include: Charles, Chrome, Firefox, Insomnia, Safari, Brave, and Edge


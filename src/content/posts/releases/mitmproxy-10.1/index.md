---
title: "Mitmproxy 10.1: HAR Support"
date: 2023-09-24
weight: 10
tags:
  - gsoc
  - releases
authors:
  - nathaniel-good
---

We are excited to announce the release of [mitmproxy 10.1](https://github.com/mitmproxy/mitmproxy/releases/tag/v10.1)!
In the spirit of shipping more frequently, this release brings exactly one new major feature: HAR file support.

<!--more-->

##### *Editorial Note: Hi!*

*My name is [Nathaniel Good], and I'm one of this year's Google Summer of Code students for mitmproxy, 
mentored by [Maximilian Hils]. My project was to implement the [import and export](https://github.com/mitmproxy/mitmproxy/commits?author=stanleygvi) 
functionality for HAR files in mitmproxy.*

[Nathaniel Good]: {{< relref "/authors/nathaniel-good" >}}
[Maximilian Hils]:  {{< relref "/authors/maximilian-hils" >}}

## Background: HAR files

HTTP Archive (HAR) files are used by a variety of tools to store a log of the interactions a web browser makes with a
site. Numerous tools like Chrome, Firefox, and Insomnia can work with HAR files, allowing users to
move data between these tools. Starting with this release, mitmproxy reads and writes HAR files as well.

## HAR Import

HAR files have a [specification](http://www.softwareishard.com/blog/har-12-spec/) they should follow, but unfortunately,
most tools slightly differ in their representation. This goes so far that the W3C Web Performance Group has abandoned
its attempt to produce a more formal standard. We have taken this as a challenge and made sure mitmproxy will be able
to import most[^1] HAR representations.

Loading HAR files works exactly like loading mitmproxy's native flow files. mitmproxy automatically detects the correct 
file format (HAR or native) and does not depend on the file extension:

#### Loading a HAR file on startup

```shell
$ mitmproxy -r example.har
```

#### Loading a HAR file in an active mitmproxy session

```shell
$ view.flows.load example.har
```



## HAR Export

As previously stated, there are various "interpretations" of the HAR specification. 
When exporting flows, mitmproxy will mostly follow Chrome's representation to ensure broad compatibility.
### Exporting from client

For exporting flows into a HAR file, you can use the new `save.har` command from within mitmproxy:

```shell
: save.har @all example.har
```

### Exporting on exit

For non-interactive use, you can also use the `hardump` option to save all flows into a HAR file on exit:

```shell
$ mitmdump --set hardump=dump.har  
```

### Exporting to stdout

Following standard unix conventions, you can set the `hardump` option to `-` to print the HAR file to stdout on exit:

```shell
$ mitmdump -q --set hardump=- 
```

[^1]: Tested tool representations include: Charles, Chrome, Firefox, Insomnia, Safari, Brave, and Edge


## Full Changelog

* Add support for reading HAR files using the existing flow loading APIs, e.g. `mitmproxy -r example.har`.
  ([#6335](https://github.com/mitmproxy/mitmproxy/pull/6335), @stanleygvi)
* Add support for writing HAR files using the `save.har` command and the `hardump` option for mitmdump.
  ([#6368](https://github.com/mitmproxy/mitmproxy/pull/6368), @stanleygvi)
* Packaging changes:
  - `mitmproxy-rs` does not depend on a protobuf compiler being available anymore,
    we're now also providing a working source distribution for all platforms.
  - On macOS, `mitmproxy-rs` now depends on `mitmproxy-macos`. We only provide binary wheels for this package because
    it contains a code-signed system extension. Building from source requires a valid Apple Developer Id, see CI for
    details.
  - On Windows, `mitmproxy-rs` now depends on `mitmproxy-windows`. We only provide binary wheels for this package to
    simplify our deployment process, see CI for how to build from source.
    ([#6303](https://github.com/mitmproxy/mitmproxy/issues/6303), @mhils)
* Increase maximum dump file size accepted by mitmweb
  ([#6373](https://github.com/mitmproxy/mitmproxy/pull/6373), @t-wy)

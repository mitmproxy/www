---
title: "Mitmproxy 6.0"
date: 2020-12-13
weight: 10
tags: [
    "releases",
]
author:
  name: Maximilian Hils
  twitter: maximilianhils
---

We are happy to announce the release of [mitmproxy 6.0](https://github.com/mitmproxy/mitmproxy/releases/tag/v6.0.0)! 
While the version bump may suggest otherwise, this really is a bugfix release while we prepare for much larger changes 
in the next version.



<!--more-->

## What's in the release?

We've bumped the major version as support for Python 3.6 and 3.7 has been dropped.
But don't let that fool you --- it's really mostly bugfixes. Everybody should upgrade!

## What's coming up?

Apparently not all complete rewrites are doomed: We are on the final stretch to replace our current
proxy core with a completely rewritten sans-io implementation in 
[#4343](https://github.com/mitmproxy/mitmproxy/pull/4343). We will follow up with a separate blog post
detailing this massive undertaking in the coming days.

If you want to learn more ahead of time, join us on our developer chat!

## Release Changelog

Since the release of mitmproxy 5.3 about a month ago, the project has had 96 commits by 10 contributors, 
resulting in 33 closed issues and 40 closed PRs.

* Mitmproxy now requires Python 3.8 or above.
* Deprecation of pathod and pathoc tools and modules. Future releases will not contain them! (@Kriechi)
* SSLKEYLOGFILE now supports TLS 1.3 secrets (@mhils)
* Fix query parameters in asgiapp addon (@jpstotz)
* Fix command history failing on file I/O errors (@Kriechi)
* Add example addon to suppress unwanted error messages sent by mitmproxy. (@anneborcherding)
* Updated imports and styles for web scanner helper addons. (@anneborcherding)
* Inform when underscore-formatted options are used in client arg. (@jrblixt)
* ASGIApp now ignores loaded HTTP flows from somewhere. (@linw1995)
* Binaries are now built with Python 3.9 (@mhils)
* Fixed the web UI showing blank page on clicking details tab when server address is missing (@samhita-sopho)
* Tests: Replace asynctest with stdlib mock (@felixonmars)
* MapLocal now keeps its configuration when other options are set. (@mhils)
* Host headers with non-standard ports are now properly updated in reverse proxy mode. (@mhils)
* Fix missing host header when replaying HTTP/2 flows (@Granitosaurus)
* ... and various other fixes, documentation improvements, dependency version bumps, etc.

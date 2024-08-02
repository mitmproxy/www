---
title: "Mitmproxy 5.3"
date: 2020-11-01
weight: 10
tags:
  - releases
authors:
  - thomas-kriechbaumer
---

We are excited to announce the release of [mitmproxy 5.3](https://github.com/mitmproxy/mitmproxy/releases/tag/v5.3.0)! This release comes with a long list of improvements and bugfixes -- 137 commits by 20 contributors, resulting in 72 closed issues and 69 closed PRs, all of this in just over 105 days.

<!--more-->

## Highlights

With the recent release of Python 3.9, obviously we had to bump our list of
supported Python versions and now fully support 3.6, 3.7, 3.8, and 3.9!

As part of this years Google Summer of Code contribution from [Martin Plattner]({{< relref "/authors/martin-plattner" >}}), we now have amazing
beginner tutorials as part of our documentation! And the best thing: it is made
as [Tutorial as
Code](https://github.com/mitmproxy/mitmproxy/blob/aca7284ab64783531193d013e3685864cac8f339/docs/scripts/clirecording/screenplays.py),
easy to update for future changes! Check out the [first tutorial for the User
Interface](https://docs.mitmproxy.org/stable/mitmproxytutorial-userinterface/),
and then jump the next ones in the sidebar - even veteran mitmproxy users might
learn a new thing!

More and more support for HTTP trailers throughout the mitmproxy code base: now
you can see Trailers in mitmweb and mitmdump, while also getting some HTTP/1.1
trailer functionality!

A new content viewer for MessagePack is now part of mitmproxy!

And of course the usual list of bugfixes, dependency version bumps, and tiny
improvements all around!

## Release Changelog

Thanks to our great contributors there are many other notable changes:

* Support for Python 3.9 (@mhils)
* Add MsgPack content viewer (@tasn)
* Use `@charset` to decode CSS files if available (@prinzhorn)
* Fix links to anticache docs in mitmweb and use HTTPS for links to documentation (@rugk)
* Updated typing for WebsocketMessage.content (@prinzhorn)
* Add option `console_strip_trailing_newlines`, and no longer strip trailing newlines by default (@capt8bit)
* Prevent transparent mode from connecting to itself in the basic cases (@prinzhorn)
* Display HTTP trailers in mitmweb (@sanlengjingvv)
* Revamp onboarding app (@mhils)
* Add ASGI support for embedded apps (@mhils)
* Updated raw exports to not remove headers (@wchasekelley)
* Fix file unlinking before external viewer finishes loading (@wchasekelley)
* Add --cert-passphrase command line argument (@mirosyn)
* Add interactive tutorials to the documentation (@mplattner)
* Support `deflateRaw` for `Content-Encoding`'s (@kjoconnor)
* Fix broken requests without body on HTTP/2 (@Kriechi)
* Add support for sending (but not parsing) HTTP Trailers to the HTTP/1.1 protocol (@bburky)
* Add support to echo http trailers in dumper addon (@shiv6146)
* Fix OpenSSL requiring different CN for root and leaf certificates (@mhils)
* ... and various other fixes, documentation improvements, dependency version bumps, etc.

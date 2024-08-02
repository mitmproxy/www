---
title: "Mitmproxy 8"
date: 2022-03-18
weight: 10
tags:
  - releases
authors:
  - maximilian-hils
---

We’re delighted to announce the release of mitmproxy 8, a free and open source interactive HTTPS proxy. This release brings major improvements to mitmweb, our web interface, and new functionality for addon developers.

<!--more-->

### Web UI Improvements

{{< figure src="mitmweb.png" >}}

This release includes a whole bunch of mitmweb improvements, contributed by our fantastic Google Summer of Code 2021 student, [Toshiaki Tanaka]({{< relref "/authors/toshiaki-tanaka" >}})! Mitmweb now renders TCP and WebSocket flows, offers direct cURL/HTTPie/raw HTTP export, has an experimental command bar, and generally received lots of fine-tuning. On the backend, the entire codebase has been converted to TypeScript. Check out Toshiaki's [blog post]({{< relref "gsoc2021" >}}) for more details!

We are happy to announce that we are again participating in the Google Summer of Code 2022 under the umbrella of the Honeynet project. If you'd like to hack on mitmproxy supported with a nice stipend, check out [#5048](https://github.com/mitmproxy/mitmproxy/issues/5048)!

### Async Event Hooks

{{< figure src="async.svg" >}}


[Robert Xiao (@nneonneo)](https://robertxiao.ca/) implemented all the low-level plumbing necessary for async event hooks. Addon developers can now simply make their functions `async` and don't have to worry about nasty race conditions anymore. 🎉

### New TLS Event Hooks

{{< figure src="tls-hooks.png" >}}

Mitmproxy has new event hooks to signal TLS handshake success and failure for client and server connections. This enables a few interesting use cases around certificate pinning, for example the dynamic exclusion of domains after the first interception failure. If this interests you, take a look at [examples/contrib/tls_passthrough.py](https://github.com/mitmproxy/mitmproxy/blob/main/examples/contrib/tls_passthrough.py)!


### Security Fixes

* [CVE-2022-24766](https://github.com/mitmproxy/mitmproxy/security/advisories/GHSA-gcx2-gvj7-pxv3):
  Fix request smuggling vulnerability reported by @zeyu2001 (@mhils).


### Full Changelog

* Support proxy authentication for SOCKS v5 mode (@starplanet)
* Make it possible to ignore connections in the tls_clienthello event hook (@mhils)
* fix some responses not being decoded properly if the encoding was uppercase (#4735, @Mattwmaster58)
* Trigger event hooks for flows with semantically invalid requests, for example invalid content-length headers (@mhils)
* Improve error message on TLS version mismatch (@mhils)
* Windows: Switch to Python's default asyncio event loop, which increases the number of sockets
  that can be processed simultaneously (@mhils)
* Add `client_replay_concurrency` option, which allows more than one client replay request to be in-flight at a time. (@rbdixon)
* New content view which handles gRPC/protobuf. Allows to apply custom definitions to visualize different field decodings.
  Includes example addon which applies custom definitions for selected gRPC traffic (@mame82)
* Fix a crash caused when editing string option (#4852, @rbdixon)
* Base container image bumped to Debian 11 Bullseye (@Kriechi)
* Upstream replays don't do CONNECT on plaintext HTTP requests (#4876, @HoffmannP)
* Remove workarounds for old pyOpenSSL versions (#4831, @KarlParkinson)
* Add fonts to asset filter (~a) (#4928, @elespike)
* Fix bug that crashed when using `view.flows.resolve` (#4916, @rbdixon)
* Fix a bug where `running()` is invoked twice on startup (#3584, @mhils)
* Correct documentation example for User-Agent header modification (#4997, @jamesyale)
* Fix random connection stalls (#5040, @EndUser509)
* Add `n` new flow keybind to mitmweb (#5061, @ianklatzco)
* Fix compatibility with BoringSSL (@pmoulton)
* Added `WebSocketMessage.injected` flag (@Prinzhorn)
* Add example addon for saving streamed data to individual files (@EndUser509)
* Change connection event hooks to be blocking.
  Processing will only resume once the event hook has finished. (@Prinzhorn)
* Reintroduce `Flow.live`, which signals if a flow belongs to a currently active connection. (#4207, @mhils)
* Speculative fix for some rare HTTP/2 connection stalls (#5158, @EndUser509)
* Add ability to specify custom ports with LDAP authentication (#5068, @demonoidvk)
* Add support for rotating saved streams every hour or day (@EndUser509)
* Console Improvements on Windows (@mhils)
* Fix processing of `--set` options (#5067, @marwinxxii) 
* Lowercase user-added header names and emit a log message to notify the user when using HTTP/2 (#4746, @mhils)
* Exit early if there are errors on startup (#4544, @mhils)

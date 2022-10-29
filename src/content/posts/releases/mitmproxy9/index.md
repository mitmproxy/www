---
title: "Mitmproxy 9"
date: 2022-10-28
weight: 10
tags: [
    "releases",
]
author:
  name: Maximilian Hils
  twitter: maximilianhils
---

We’re excited to announce the release of mitmproxy 9, a free and open source interactive HTTPS proxy. 
This release brings support for raw UDP and DTLS, a new WireGuard proxy mode, and major usability improvements.

<!--more-->


### Raw UDP and DTLS Support

{{< figure src="udp.png" alt="A UDP flow in the mitmweb UI" caption="Raw UDP packets passing through mitmproxy." >}}

After adding [DNS support](https://docs.mitmproxy.org/dev/concepts-modes/#dns-server) in mitmproxy 8.1,
[Manuel Meitinger (@meitinger)](https://github.com/meitinger) now brings us support for raw UDP flows! 
Just like raw TCP mode, the new raw UDP mode allows you to 
intercept and modify any UDP-based protocol. To spice things up, [Miguel Guarniz (@kckeiks)](https://github.com/kckeiks)
added automatic DTLS detection and interception on top, which makes it possible to peek into many encrypted UDP protocols.

### WireGuard Mode (and Rust)

<figure>
<video controls>
    <source src="mitmweb-wireguard-android.mp4#t=0.4" type="video/mp4">
</video>
<figcaption>Setting up an Android smartphone (right) to use mitmweb (left).<br>The mitmproxy CA certificate has been preinstalled for this demo.</figcaption>
</figure>

[Fabio Valentini (@decathorpe)](https://github.com/decathorpe) has been working on an experimental new proxy mode based on WireGuard. 
This new mode makes transparent proxying as easy as running <code style="white-space: nowrap">mitmweb -\-mode wireguard</code> connecting to a WireGuard VPN.

This represents a significat usability improvement for transparent mode (no more iptables), and -- thanks to WireGuard's fantastic mobile 
support -- makes it possible to only proxy specific apps on Android. On top of that, it's the first feature in mitmproxy that is implemented in Rust.
Head over to Fabio's [blog post]({{< relref "wireguard-mode" >}}) to learn more!


### Console Usability

{{< figure src="quickhelp.png" >}}

Similar to `nano` or `htop`, the mitmproxy console UI now shows a help bar with common keybindings at the bottom.
This makes it easier to learn the most important features, 
but also helps to discover more advanced ones.
It looks like even [our most experienced users](https://github.com/mitmproxy/mitmproxy/pull/5652#issuecomment-1283748819)
may learn something new! 🎉

### Full Changelog

* Mitmproxy binaries now ship with Python 3.11.
  ([#5678](https://github.com/mitmproxy/mitmproxy/issues/5678), @mhils)
* One mitmproxy instance can now spawn multiple proxy servers.
  ([#5393](https://github.com/mitmproxy/mitmproxy/pull/5393), @mhils)
* Add syntax highlighting to JSON and msgpack content view.
  ([#5623](https://github.com/mitmproxy/mitmproxy/issues/5623), @SapiensAnatis)
* Add MQTT content view.
  ([#5588](https://github.com/mitmproxy/mitmproxy/pull/5588), @nikitastupin, @abbbe)
* Setting `connection_strategy` to `lazy` now also disables early 
  upstream connections to fetch TLS certificate details.
  ([#5487](https://github.com/mitmproxy/mitmproxy/pull/5487), @mhils)
* Fix order of event hooks on startup.
  ([#5376](https://github.com/mitmproxy/mitmproxy/issues/5376), @meitinger)
* Include server information in bind/listen errors.
  ([#5495](https://github.com/mitmproxy/mitmproxy/pull/5495), @meitinger)
* Include information about lazy connection_strategy in related errors.
  ([#5465](https://github.com/mitmproxy/mitmproxy/pull/5465), @meitinger, @mhils)
* Fix `tls_version_server_min` and `tls_version_server_max` options.
  ([#5546](https://github.com/mitmproxy/mitmproxy/issues/5546), @mhils)
* Added Magisk module generation for Android onboarding.
  ([#5547](https://github.com/mitmproxy/mitmproxy/pull/5547), @jorants)
* Update Linux binary builder to Ubuntu 20.04, bumping the minimum glibc version to 2.31.
  ([#5547](https://github.com/mitmproxy/mitmproxy/pull/5547), @jorants)
* Add "Save filtered" button in mitmweb.
  ([#5531](https://github.com/mitmproxy/mitmproxy/pull/5531), @rnbwdsh, @mhils)
* Render application/prpc content as gRPC/Protocol Buffers
  ([#5568](https://github.com/mitmproxy/mitmproxy/pull/5568), @selfisekai)
* Mitmweb now supports `content_view_lines_cutoff`.
  ([#5548](https://github.com/mitmproxy/mitmproxy/pull/5548), @sanlengjingvv)
* Fix a mitmweb crash when scrolling down the flow list.
  ([#5507](https://github.com/mitmproxy/mitmproxy/pull/5507), @LIU-shuyi)
* Add HTTP/3 binary frame content view.
  ([#5582](https://github.com/mitmproxy/mitmproxy/pull/5582), @mhils)
* Fix mitmweb not properly opening a browser and being stuck on some Linux.
  ([#5522](https://github.com/mitmproxy/mitmproxy/issues/5522), @Prinzhorn)
* Fix race condition when updating mitmweb WebSocket connections that are closing.
  ([#5405](https://github.com/mitmproxy/mitmproxy/issues/5405), [#5686](https://github.com/mitmproxy/mitmproxy/issues/5686), @mhils)
* Fix mitmweb crash when using filters.
  ([#5658](https://github.com/mitmproxy/mitmproxy/issues/5658), [#5661](https://github.com/mitmproxy/mitmproxy/issues/5661), @LIU-shuyi, @mhils)
* Fix missing default port when starting a browser.
  ([#5687](https://github.com/mitmproxy/mitmproxy/issues/5687), @rbdixon)
* Add docs for transparent mode on Windows.
  ([#5402](https://github.com/mitmproxy/mitmproxy/issues/5402), @stephenspol)

#### Deprecations

* Deprecate `add_log` event hook. Users should use the builtin `logging` module instead.
  See [the docs](https://docs.mitmproxy.org/dev/addons-api-changelog/) for details and upgrade instructions.
  ([#5590](https://github.com/mitmproxy/mitmproxy/pull/5590), @mhils)
* Deprecate `mitmproxy.ctx.log` in favor of Python's builtin `logging` module.
  See [the docs](https://docs.mitmproxy.org/dev/addons-api-changelog/) for details and upgrade instructions.
  ([#5590](https://github.com/mitmproxy/mitmproxy/pull/5590), @mhils)

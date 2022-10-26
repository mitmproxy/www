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

### WireGuard Mode

<figure>
<video controls>
    <source src="mitmweb-wireguard-android.mp4#t=0.4" type="video/mp4">
</video>
<figcaption>Setting up an Android smartphone (right) to use mitmweb (left).<br>The mitmproxy CA certificate has been preinstalled for this demo.</figcaption>
</figure>

[Fabio Valentini (@decathorpe)](https://github.com/decathorpe) has been working on an experimental new proxy mode based on WireGuard. 
This new mode makes transparent proxying as easy as running <code style="white-space: nowrap">mitmweb -\-mode wireguard</code> connecting to a WireGuard VPN.

This represents a significat usability improvement for transparent mode (no more iptables), and -- thanks to WireGuard's fantastic mobile 
support -- makes it possible to only proxy specific apps on Android. Head over to Fabio's 
[blog post]({{< relref "wireguard-mode" >}}) to learn more!


### Console Usability

{{< figure src="quickhelp.png" >}}

Similar to `nano` or `htop`, the mitmproxy console UI now shows a help bar with common keybindings at the bottom.
This makes it easier to learn the most important features, 
but also helps to discover more advanced ones.
It looks like even [our most experienced users](https://github.com/mitmproxy/mitmproxy/pull/5652#issuecomment-1283748819)
may learn something new! 🎉

### Full Changelog

TODO

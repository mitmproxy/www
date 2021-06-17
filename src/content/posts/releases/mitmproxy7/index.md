---
title: "Mitmproxy 7"
date: 2021-06-17
weight: 10
tags: [
    "releases",
]
author:
  name: Maximilian Hils
  twitter: maximilianhils
---

We're delighted to announce the release of mitmproxy 7. The major feature of this release is our new proxy core,
which bring substantial improvements across the board and represents a massive milestone for the project.

<!--more-->

## What's in the release?

In this post we'll focus on some of the user-facing improvements coming with mitmproxy 7. If you are interested
in the technical details of our new sans-io proxy core, check 
out our [blog post]({{< relref "new-proxy-core" >}}) dedicated to that!


### Full TCP Support

{{< figure src="tcp.png" >}}

Mitmproxy now supports proxying raw TCP connections out of the box, including ones that start with a server-side 
greeting (for example SMTP). [Opportunistic TLS](https://en.wikipedia.org/wiki/Opportunistic_TLS) (`STARTTLS`) is not 
supported yet, but regular TCP-over-TLS just works!


### HTTP/1 ⇔ HTTP/2 Interoperability

{{< figure src="http-interop.svg" >}}

Mitmproxy can now accept HTTP/2 requests from the client and forward them to an HTTP/1 server. Of course, 
translation also works the other way around. This change also makes it possible to change the request destination for 
HTTP/2 flows, which previously was not possible at all.

### WebSocket Message Display

{{< figure src="websocket.png" >}}

Mitmproxy now displays WebSocket messages not only in the event log, but also in a dedicated UI tab!
There are still UX details to be ironed out, but we're excited to ship a first prototype here.

### Secure Web Proxy (TLS-over-TLS)

{{< figure src="tls-over-tls.svg" >}}

Clients usually talk in plaintext to HTTP proxies -- telling them where to connect -- before they ultimately establish 
a secure TLS connection through the proxy with the destination server. With mitmproxy 7, clients can now establish TLS 
with the proxy right from the start (before issuing an HTTP `CONNECT` request), 
which can add a significant layer of defense in public networks.


### Windows Support for Console UI

{{< figure src="windows.png" >}}

Thanks to an experimental [urwid patch](https://github.com/urwid/urwid/pull/448), mitmproxy's console UI
is now natively available on Windows. While the Window Subsystem for Linux (WSL) has been a viable alternative
for a while, we're very happy to provide the same tools across all platforms now.

### API Reference Documentation

{{< figure src="pdoc.svg" width=100 >}}

Having recently adopted the [pdoc](https://pdoc.dev) project, which generates awesome Python API documentation, 
we have built completely [new API reference docs](https://docs.mitmproxy.org/archive/v7/api/events.html) for mitmproxy's 
addon API. Paired with our existing [example repository](https://github.com/mitmproxy/mitmproxy/tree/main/examples), 
this makes it much simpler to write mitmproxy new addons.

## What's next?

While this release focuses heavily on our backend, the next mitmproxy release will come with lots of mitmweb 
improvements by our current GSoC student [@gorogoroumaru](https://github.com/gorogoroumaru). Stay tuned!

## Release Changelog

Since the release of mitmproxy 6 about six months ago, the project has had 476 commits by 27 contributors, 
resulting in 214 closed issues and 144 closed pull requests.

* *See https://github.com/mitmproxy/mitmproxy/blob/main/CHANGELOG.md*

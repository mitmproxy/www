---
title: "Mitmproxy 7"
date: 2021-07-16
weight: 10
tags: [
    "releases",
]
author:
  name: Maximilian Hils
  twitter: maximilianhils
---

We're delighted to announce the release of mitmproxy 7, a free and open source interactive HTTPS proxy. 
This release is all about our new proxy core, which bring substantial improvements across the board and 
represents a massive milestone for the project.

<!--more-->

## What's in the release?

In this post we'll focus on some of the user-facing improvements coming with mitmproxy 7. If you are interested
in the technical details of our new sans-io proxy core, check 
out our [blog post]({{< relref "new-proxy-core" >}}) dedicated to that!


### Full TCP Support

{{< figure src="tcp.png" >}}

Mitmproxy now supports proxying raw TCP connections out of the box, including ones that start with a server-side 
greeting -- for example SMTP. [Opportunistic TLS](https://en.wikipedia.org/wiki/Opportunistic_TLS) (`STARTTLS`) is not 
supported yet, but regular TCP-over-TLS just works!


### HTTP/1 ⇔ HTTP/2 Interoperability

{{< figure src="http-interop.svg" >}}

Mitmproxy can now accept HTTP/2 requests from the client and forward them to an HTTP/1 server. This on-the-wire protocol translation works bi-directional: All HTTP requests and responses were created equal!. This change also makes it possible to change the request destination for 
HTTP/2 flows, which previously was not possible at all.

### WebSocket Message Display

{{< figure src="websocket.png" >}}

Mitmproxy now displays WebSocket messages not only in the event log, but also in a dedicated UI tab!
There are still UX details to be ironed out, but we're excited to ship a first prototype here. While this is only for the console UI via mitmproxy, the web UI via mitmweb is still looking for amazing contributors to get feature parity!

### Secure Web Proxy (TLS-over-TLS)

{{< figure src="tls-over-tls.svg" >}}

Clients usually talk in plaintext to HTTP proxies -- telling them where to connect -- before they ultimately establish 
a secure TLS connection through the proxy with the destination server. With mitmproxy 7, clients can now establish TLS 
with the proxy right from the start (before issuing an HTTP `CONNECT` request), 
which can add a significant layer of defense in public networks. 

So instead of simply specifying `http://127.0.0.1:8080` you can now also use HTTPS via `https://127.0.0.1:8080` (or any other listen host and port).


### Windows Support for Console UI

{{< figure src="windows.png" >}}

Thanks to an experimental [urwid patch](https://github.com/urwid/urwid/pull/448), mitmproxy's console UI
is now natively available on Windows. While the Window Subsystem for Linux (WSL) has been a viable alternative
for a while, we're very happy to provide the same tools across all platforms now.

### API Reference Documentation

{{< figure src="pdoc.svg" width=100 >}}

Having recently adopted the [pdoc](https://pdoc.dev) project, which generates awesome Python API documentation, 
we have built a completely [new API reference documentation](https://docs.mitmproxy.org/archive/v7/api/events.html) for mitmproxy's 
addon API. Paired with our existing [examples on GitHub](https://github.com/mitmproxy/mitmproxy/tree/main/examples), 
this makes it much simpler to write mitmproxy new addons.

## What's next?

While this release focuses heavily on our backend, the next mitmproxy release will come with lots of mitmweb 
improvements by our current GSoC 2021 student [@gorogoroumaru](https://github.com/gorogoroumaru). Stay tuned!

-----------------

## Release Changelog

Since the release of mitmproxy 6 about seven months ago, the project has had 527 commits by 28 contributors, 
resulting in 234 closed issues and 173 closed pull requests.

##### New Proxy Core (@mhils)

* **Secure Web Proxy:** Mitmproxy now supports TLS-over-TLS to already encrypt the connection to the proxy.
* **Server-Side Greetings:** Mitmproxy now supports proxying raw TCP connections, including ones that start
  with a server-side greeting (e.g. SMTP).
* **HTTP/1 – HTTP/2 Interoperability:** mitmproxy can now accept an HTTP/2 connection from the client,
  and forward it to an HTTP/1 server.
* **HTTP/2 Redirects:** The request destination can now be changed on HTTP/2 flows.
* **Connection Strategy:** Users can now specify if they want mitmproxy to eagerly connect upstream
  or wait as long as possible. Eager connections are required to detect protocols with server-side
  greetings, lazy connections enable the replay of responses without connecting to an upstream server.
* **Timeout Handling:** Mitmproxy will now clean up idle connections and also abort requests if the client disconnects
  in the meantime.
* **Host Header-based Proxying:** If the request destination is unknown, mitmproxy now falls back to proxying
  based on the Host header. This means that requests can often be redirected to mitmproxy using
  DNS spoofing only.
* **Internals:** All protocol logic is now separated from I/O (["sans-io"](https://sans-io.readthedocs.io/)).
  This greatly improves testing capabilities, prevents a wide array of race conditions, and increases
  proper isolation between layers.

##### Additional Changes

* mitmproxy's command line interface now supports Windows (@mhils)
* The `clientconnect`, `clientdisconnect`, `serverconnect`, `serverdisconnect`, and `log`
  events have been replaced with new events, see addon documentation for details (@mhils)
* Contentviews now implement `render_priority` instead of `should_render`, allowing more specialization (@mhils)
* Addition of block_list option to block requests with a set status code (@ericbeland)
* Make mitmweb columns configurable and customizable (@gorogoroumaru)
* Automatic JSON view mode when `+json` suffix in content type (@kam800)
* Use pyca/cryptography to generate certificates, not pyOpenSSL (@mhils)
* Remove the legacy protocol stack (@Kriechi)
* Remove all deprecated pathod and pathoc tools and modules (@Kriechi)
* In reverse proxy mode, mitmproxy now does not assume TLS if no scheme
  is given but a custom port is provided (@mhils)
* Remove the following options: `http2_priority`, `relax_http_form_validation`, `upstream_bind_address`,
  `spoof_source_address`, and `stream_websockets`. If you depended on one of them please let us know.
  mitmproxy never phones home, which means we don't know how prominently these options were used. (@mhils)
* Fix IDNA host 'Bad HTTP request line' error (@grahamrobbins)
* Pressing `?` now exits console help view (@abitrolly)
* `--modify-headers` now works correctly when modifying a header that is also part of the filter expression (@Prinzhorn)
* Fix SNI-related reproducibility issues when exporting to curl/httpie commands. (@dkasak)
* Add option `export_preserve_original_ip` to force exported command to connect to IP from original request.
  Only supports curl at the moment. (@dkasak)
* Major proxy protocol testing (@r00t-)
* Switch Docker image release to be based on Debian (@PeterDaveHello)
* Multiple Browsers: The `browser.start` command may be executed more than once to start additional
  browser sessions. (@rbdixon)
* Improve readability of SHA256 fingerprint. (@wrekone)
* Metadata and Replay Flow Filters: Flows may be filtered based on metadata and replay status. (@rbdixon)
* Flow control: don't read connection data faster than it can be forwarded. (@hazcod)
* Docker images for ARM64 architecture (@hazcod, @mhils)
* Fix parsing of certificate issuer/subject with escaped special characters (@Prinzhorn)
* Customize markers with emoji, and filters: The `flow.mark` command may be used to mark a flow with either the default
  "red ball" marker, a single character, or an emoji like `:grapes:`. Use the `~marker` filter to filter on marker
  characters. (@rbdixon)
* New `flow.comment` command to add a comment to the flow. Add `~comment <regex>` filter syntax to search flow comments.
  (@rbdixon)
* Fix multipart forms losing `boundary` values on edit. (@roytu)
* `Transfer-Encoding: chunked` HTTP message bodies are now retained if they are below the stream_large_bodies limit.
  (@mhils)
* `json()` method for HTTP Request and Response instances will return decoded JSON body. (@rbdixon)
* Support for HTTP/2 Push Promises has been dropped. (@mhils)
* Make it possible to set sequence options from the command line. (@Yopi)

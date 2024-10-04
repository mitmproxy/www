---
title: "Mitmproxy 10: First Bits of HTTP/3!"
date: 2023-08-04
weight: 10
tags:
  - releases
authors:
  - maximilian-hils
---

We are happy to announce the release of mitmproxy 10, a free and open source interactive HTTPS proxy.
This release introduces experimental support for QUIC and HTTP/3 reverse proxies, 
setting the stage for further work on HTTP/3!

<!--more-->

## 1, 2, ... HTTP/3!

{{< figure src="trifecta.png" >}}

With HTTP/3 becoming increasingly popular, we're excited to be the first 
debugging proxy to provide (experimental) support. 
While this functionality is limited to reverse proxies for now, we're looking 
forward to getting some early feedback and following up with transparent interception
later this year.


Starting with this release, it is possible to run mitmproxy as an HTTP/3 server:

```shell
$ mitmproxy --mode reverse:http3://mitmproxy.org
$ curl --http3-only https://localhost:8080
```

Running the command above will make mitmproxy listen for UDP packets on port 8080, 
parse them as HTTP/3 over QUIC, and then establish an HTTP/3 connection upstream as well.
[Manuel Meitinger]({{< relref "/authors/manuel-meitinger" >}}) laid the QUIC and HTTP/3
foundations for this last year during Google Summer of Code, 
and after a lot of testing, we are finally ready to ship things.


Note that we are still working with bleeding-edge features here. Your cURL build
likely won't have an `--http3-only` flag yet. Chromium-based browsers and Firefox 
generally expect an HTTP/2 -> HTTP/3 upgrade path, which we still need to support properly.
Running both TCP and UDP HTTP proxies simultaneously with 
`--mode reverse:http3://mitmproxy.org --mode reverse:https://mitmproxy.org`
kind of works, but we still need to improve both reliability and UX here going forward.

### Peeking into QUIC Streams

mitmproxy can now also proxy the raw QUIC transport protocol, on which HTTP/3 is based on.
This may be particularly useful for developers who are debugging their HTTP/3 implementations
or other QUIC-based protocols. By configuring a reverse proxy to `quic://mitmproxy.org` 
(instead of `http3://...` in the example above), mitmproxy will proxy QUIC directly, 
not interpreting it as HTTP/3:

```shell
$ mitmdump --mode reverse:quic://mitmproxy.org --set flow_detail=3 \
  --set dumper_default_contentview=hex
[19:34:09.876] reverse proxy to quic://mitmproxy.org listening at *:8080.
[19:34:11.845][127.0.0.1:53786] client connect
[19:34:11.889][127.0.0.1:53786] server connect mitmproxy.org:443 (18.155.129.5:443)
127.0.0.1:53786 -> quic stream 2 -> mitmproxy -> quic stream 2 -> mitmproxy.org:443

    0000000000 00 04 0d 06 ff ff ff ff ff ff ff ff 01 00 07 00   ................
```

The example above then becomes a bit more readable if we pretty-print the raw HTTP/3 frame:

```shell
$ mitmdump --mode reverse:quic://mitmproxy.org --set flow_detail=3 \
  --set dumper_default_contentview=http3
[19:36:06.040] reverse proxy to quic://mitmproxy.org listening at *:8080.
[19:36:08.660][127.0.0.1:54903] client connect
[19:36:08.712][127.0.0.1:54903] server connect mitmproxy.org:443 (18.155.129.5:443)
127.0.0.1:54903 -> quic stream 2 -> mitmproxy -> quic stream 2 -> mitmproxy.org:443

    Control Stream

    SETTINGS Frame
    MAX_FIELD_SECTION_SIZE:   0x3fffffffffffffff
    QPACK_MAX_TABLE_CAPACITY: 0x0
    QPACK_BLOCKED_STREAMS:    0x0
```

Last but not least, if you prefer to debug your connections in Wireshark, mitmproxy's
QUIC proxying also supports [SSLKEYLOGFILE](https://docs.mitmproxy.org/stable/howto-wireshark-tls/).
This allows you to decrypt QUIC traffic in Wireshark for applications that do not support SSLKEYLOGFILE 
natively.


## This release is brought to you by... NLnet!

We are very happy to announce that this release kicks off a series of releases supported by the 
[NGI0 Entrust fund](https://nlnet.nl/entrust/), a fund established by [NLnet](https://nlnet.nl/) with financial support 
from the European Commission's [Next Generation Internet programme](https://www.ngi.eu/). 🎉

We have always been very careful about accepting funding for mitmproxy. 
Be assured that this has not changed. We won't be adding telemetry, there won't be ads on the website, 
and we won't take VC funding next. :-)

## Full Changelog

* Add experimental support for HTTP/3 and QUIC.
  ([#5435](https://github.com/mitmproxy/mitmproxy/issues/5435), @meitinger)
* ASGI/WSGI apps can now listen on all ports for a specific hostname. 
  This makes it simpler to accept both HTTP and HTTPS.
  ([#5725](https://github.com/mitmproxy/mitmproxy/pull/5725), @mhils)
* Add `replay.server.add` command for adding flows to server replay buffer
  ([#5851](https://github.com/mitmproxy/mitmproxy/pull/5851), @italankin)
* Remove string escaping in raw view.
  ([#5470](https://github.com/mitmproxy/mitmproxy/issues/5470), @stephenspol)
* Updating `Request.port` now also updates the Host header if present.
  This aligns with `Request.host`, which already does this.
  ([#5908](https://github.com/mitmproxy/mitmproxy/pull/5908), @sujaldev)
* Fix editing of multipart HTTP requests from the CLI.
  ([#5148](https://github.com/mitmproxy/mitmproxy/issues/5148), @mhils)
* Add documentation on using Magisk module for intercepting traffic in Android production builds.
  ([#5924](https://github.com/mitmproxy/mitmproxy/pull/5924), @Jurrie)
* Fix a bug where the direction indicator in the message stream view would be in the wrong direction.
  ([#5921](https://github.com/mitmproxy/mitmproxy/issues/5921), @konradh)
* Fix a bug where peername would be None in tls_passthrough script, which would make it not working.
  ([#5904](https://github.com/mitmproxy/mitmproxy/pull/5904), @truebit)
* the `esc` key can now be used to exit the current view
  ([#6087](https://github.com/mitmproxy/mitmproxy/pull/6087), @sujaldev)
* focus-follow shortcut will now work in flow view context too.
  ([#6088](https://github.com/mitmproxy/mitmproxy/pull/6088), @sujaldev)
* Fix a bug where a server connection timeout would cause requests to be issued with a wrong SNI in reverse proxy mode.
  ([#6148](https://github.com/mitmproxy/mitmproxy/pull/6148), @mhils)
* The `server_replay_nopop` option has been renamed to `server_replay_reuse` to avoid confusing double-negation.
  ([#6084](https://github.com/mitmproxy/mitmproxy/issues/6084), @prady0t, @Semnodime)
* Add zstd to valid gRPC encoding schemes.
  ([#6188](https://github.com/mitmproxy/mitmproxy/pull/6188), @tsaaristo)
* For reverse proxy directly accessed via IP address, the IP address is now included
  as a subject in the generated certificate.
  ([#6202](https://github.com/mitmproxy/mitmproxy/pull/6202), @mhils)
* Enable legacy SSL connect when connecting to server if the `ssl_insecure` flag is set.
  ([#6281](https://github.com/mitmproxy/mitmproxy/pull/6281), @DurandA)
* Change wording in the [http-reply-from-proxy.py example](https://github.com/mitmproxy/mitmproxy/blob/main/examples/addons/http-reply-from-proxy.py).
  ([#6117](https://github.com/mitmproxy/mitmproxy/pull/6117), @Semnodime)
* Added option to specify an elliptic curve for key exchange between mitmproxy <-> server
  ([#6170](https://github.com/mitmproxy/mitmproxy/pull/6170), @Mike-Ki-ASD)
* Add "Prettier" code linting tool to mitmweb.
  ([#5985](https://github.com/mitmproxy/mitmproxy/pull/5985), @alexgershberg)
* When logging exceptions, provide the entire exception object to log handlers
  ([#6295](https://github.com/mitmproxy/mitmproxy/pull/6295), @mhils)
* mitmproxy now requires Python 3.10 or above.
  ([#5954](https://github.com/mitmproxy/mitmproxy/pull/5954), @mhils)

### Deprecations

* The `onboarding_port` option has been removed. The onboarding app now responds
  to all requests for the hostname specified in `onboarding_host`.
* `connection.Client` and `connection.Server` now accept keyword arguments only.
  This is a breaking change for custom addons that use these classes directly.

---
title: "Mitmproxy 12: Interactive Contentviews"
date: 2025-04-29
weight: 10
tags:
  - releases
authors:
  - maximilian-hils
---

We're thrilled to announce the release of mitmproxy 12, introducing *Interactive Contentviews*!
It's now possible to modify the prettified representation of binary protocols, 
which is then re-encoded back into the original binary format.

<!--more-->

# Interactive Contentviews

First [introduced in 2011], the ability to pretty-print HTTP message bodies has been a mitmproxy feature 
since the very early days.
The functionality later became a shared component between the console and web interfaces 
in 2015 ([#764]), soon followed by support for custom user-provided views ([#833]). 
However, these views were always read-only; editing binary protocols meant changing raw bytes.

Now, with interactive contentviews, you can directly edit the human-readable, prettified representation,
and mitmproxy will handle the task of re-encoding it back into its binary form.
This dramatically simplifies tinkering with unknown binary protocols such as gRPC/Protobuf or MsgPack.

<figure>
<video controls>
    <source src="grpc.mp4" type="video/mp4">
</video>
<figcaption>Modifying a gRPC message on the fly (without knowing its schema).</figcaption>
</figure>

[introduced in 2011]: https://github.com/mitmproxy/mitmproxy/commit/93ef691badcdaa1b7a5801eb40982c69f9b89534
[#764]: https://github.com/mitmproxy/mitmproxy/pull/764
[#833]: https://github.com/mitmproxy/mitmproxy/pull/832

## Spotlight: gRPC & Protobuf

The prime example of interactive contentviews is our enhanced gRPC and Protobuf support.
You can now modify Protobuf messages directly within mitmproxy, 
whether you have access to the Protobuf definitions (`.proto` files) or not.

- **Known Protobufs:** Set the new [`protobuf_definitions`] option in mitmproxy to your `.proto` file 
  and edit fields by name.
- **Unknown Protobufs:** You won't have field names, but you can still interactively modify primitive values 
  (strings, integers, nested messages) and mitmproxy will re-encode your changes.

{{< figure src="grpc.png" 
    alt="A screenshot of mitmproxy's gRPC rendering, both with and without protobuf definitions" 
    caption="gRPC with (left) and without (right) Protobuf definitions." >}}

[`protobuf_definitions`]: https://docs.mitmproxy.org/stable/concepts/options/#protobuf_definitions

## New Contentview API

Underpinning this interactivity is a revamped and drastically simpler Contentview API. 
Instead of returning a list of lines with inline markup, 
the new [`prettify`] method simply takes `bytes` and returns `str`, and then [`reencode`] does the reverse.
As an example, here's a simple interactive contentview that dumps and parses data as hex:

```python
from mitmproxy import contentviews

class Hex(contentviews.InteractiveContentview):
    def prettify(
        self, 
        data: bytes,
        metadata: contentviews.Metadata
    ) -> str:
        return data.hex()

    def reencode(
        self,
        prettified: str,
        metadata: contentviews.Metadata
    ) -> bytes:
        return bytes.fromhex(prettified)

contentviews.add(Hex)
```

Adding this to mitmproxy is as easy as `mitmproxy -s example.py`,
please check out our [new contentview documentation] for more examples!

[`prettify`]: https://docs.mitmproxy.org/stable/api/mitmproxy/contentviews.html#Contentview.prettify
[`reencode`]: https://docs.mitmproxy.org/stable/api/mitmproxy/contentviews.html#Contentview.reencode
[new contentview documentation]: https://docs.mitmproxy.org/stable/addons/contentviews/

## Rust-based Contentviews 🦀

With the new Contentview API, we're also increasing our investment in Rust:

- **Contentviews can now be written in Rust.** 
  Access to the crates.io ecosystem (and [Serde] in particular) makes it easy to write safe and performant
  contentviews. The new gRPC, Protobuf, and MsgPack contentviews are all Rust-based.
- **Syntax highlighting is now done centrally in Rust.** For mitmproxy and mitmweb, the [mitmproxy-highlight] crate does
  all the work (using [tree-sitter] under the hood). Contentviews only need to declare their output format.
  This is much more efficient than the previous implementation, where every contentview had to do highlighting itself.

[Serde]: https://serde.rs/
[mitmproxy-highlight]: https://github.com/mitmproxy/mitmproxy_rs/tree/main/mitmproxy-highlight
[tree-sitter]: https://tree-sitter.github.io/tree-sitter/

# Other Changes in mitmproxy 12

- Added support for selecting multiple flows in mitmweb using Ctrl+Click and Shift+Click.
  Multi-selection is now supported for deleting, duplicating, marking, reverting, replaying ,resuming, and aborting flows.
  ([#7319](https://github.com/mitmproxy/mitmproxy/pull/7319), @lups2000, @mhils)
- Add a new feature to store streamed bodies for requests and responses.
  ([#7637](https://github.com/mitmproxy/mitmproxy/pull/7637), @mkiami)
- Add support for TLS 1.3 Post Handshake Authentication.
  ([#7576](https://github.com/mitmproxy/mitmproxy/pull/7576), @mhils, @cataggar)
- Add search functionality to the documentation.
  ([#7603](https://github.com/mitmproxy/mitmproxy/pull/7603), @mhils)
- Introduce a new theme for docs.mitmproxy.org.
  ([#7593](https://github.com/mitmproxy/mitmproxy/pull/7593), @mhils)
- Add CRL entries to dummy cert when the upstream certificate has some.
  ([#7609](https://github.com/mitmproxy/mitmproxy/pull/7609), @Yepoleb, @JordanPlayz158)
- Fix a bug where mitmproxy would incorrectly send empty HTTP/2 data frames.
  ([#7574](https://github.com/mitmproxy/mitmproxy/pull/7574), @mhils, @Dieken)
- Enhance homebrew installation command for Brewfile users.
  ([#7566](https://github.com/mitmproxy/mitmproxy/pull/7566), @AntoineJT)
- Fix a bug where mitmdump would exit prematurely in server replay mode.
  ([#7571](https://github.com/mitmproxy/mitmproxy/pull/7571), @mhils)
- Fix a bug where WebSocket Messages view jumps to top when a message is received
  ([#7572](https://github.com/mitmproxy/mitmproxy/pull/7572), @DenizenB)
- Create content view for Socket.IO over WebSocket transport
  ([#7570](https://github.com/mitmproxy/mitmproxy/pull/7570), @DenizenB)
- Correctly forward HTTP_1_1_REQUIRED errors in HTTP/2 streams.
  ([#7575](https://github.com/mitmproxy/mitmproxy/pull/7575), @mhils)
- Fix a bug where HAR export would crash for malformed flows.
  ([#7666](https://github.com/mitmproxy/mitmproxy/pull/7666), @mhils)
- Fix a bug where mitmweb would crash when viewing flows with undefined headers.
  ([#7595](https://github.com/mitmproxy/mitmproxy/pull/7595), @emanuele-em)
- Fix a bug where mitmproxy does not listen on IPv4 and IPv6 by default in wireguard mode.
  ([#7589](https://github.com/mitmproxy/mitmproxy/pull/7589), @errorxyz)
- Adjust popover placement for browsers that support anchor positioning (Chrome, Edge)
  ([#7642](https://github.com/mitmproxy/mitmproxy/pull/7642), @lups2000)
- Fix mitmweb crash when searching or highlighting using ~h, ~hq, or ~hs.
  ([#7652](https://github.com/mitmproxy/mitmproxy/pull/7652), @lups2000)
- `mitmproxy.dns.Message` has been renamed to `mitmproxy.dns.DNSMessage`
  ([#7670](https://github.com/mitmproxy/mitmproxy/pull/7670), @mhils)

[tree-sitter]: https://tree-sitter.github.io/tree-sitter/


## Acknowledgments

This work was supported by the [NGI0 Entrust fund] established by [NLnet].

[NGI0 Entrust fund]: https://nlnet.nl/entrust/
[NLnet]: https://nlnet.nl/
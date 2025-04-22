---
title: "Mitmproxy 12: Interactive Contentviews"
date: 2025-04-22
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

(protobuf gif)

[introduced in 2011]: https://github.com/mitmproxy/mitmproxy/commit/93ef691badcdaa1b7a5801eb40982c69f9b89534
[#764]: https://github.com/mitmproxy/mitmproxy/pull/764
[#833]: https://github.com/mitmproxy/mitmproxy/pull/832

## Spotlight: gRPC & Protobuf

The prime example for interactive contentviews is our enhanced gRPC and Protobuf support.
You can now modify Protobuf messages directly within mitmproxy, 
whether you have access to the Protobuf definitions (`.proto` files) or not.

- **Known Protobufs:** Set the new [`protobuf_definitions`] option in mitmproxy to your `.proto` file 
  and edit fields by name.
- **Unknown Protobufs:** You won't have field names, but you can still interactively modify primitive values 
  (strings, integers, nested messages) and mitmproxy will re-encode your changes.

(screenshot of example gRPC with and without definitions)

[`protobuf_definitions`]: https://docs.mitmproxy.org/stable/concepts/options/#protobuf_definitions

## New Contentview API

Underpinning this interactivity is a revamped and drastically simpler Contentview API. 
Instead of returning a list of lines with inline markup, 
the new [`prettify`] method simply takes `bytes` and returns `str`, and then [`reencode`] does the reverse.
As a simple example, here's what's mitmproxy's builtin contentview for DNS messages looks like:

(DNS example snippet)

Check out our [new contentview documentation] for more examples!

[`prettify`]: https://docs.mitmproxy.org/stable/api/mitmproxy/contentviews.html#Contentview.prettify
[`reencode`]: https://docs.mitmproxy.org/stable/api/mitmproxy/contentviews.html#Contentview.reencode
[new contentview documentation]: https://docs.mitmproxy.org/stable/addons/contentviews/

## Rust-based Contentviews

With the new API, we're also increasing our investment in Rust to deliver safe and performant contentviews:

- **Builtin contentviews can now also be written in Rust.** In fact, the gRPC, Protobuf, and MsgPack contentviews
  are all Rust-based. The [MsgPack implementation] is a great example to demonstrate how access to the crates.io 
  ecosystem and the [serde] framework in particular makes writing contentviews super easy.
- **Syntax highlighting is now done in Rust.** For mitmproxy and mitmweb, the [mitmproxy-highlight] crate does all the
  work (using [tree-sitter] under the hood).

[MsgPack implementation]: https://github.com/mitmproxy/mitmproxy_rs/blob/5ec05682b122a2c1ee6584b4fe57a698eef573fd/mitmproxy-contentviews/src/msgpack.rs
[serde]: https://serde.rs/
[mitmproxy-highlight]: https://github.com/mitmproxy/mitmproxy_rs/tree/main/mitmproxy-highlight
[tree-sitter]: https://tree-sitter.github.io/tree-sitter/

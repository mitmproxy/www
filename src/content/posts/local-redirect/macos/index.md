---
title: "Intercepting macOS Applications"
date: 2023-12-05
weight: 10
tags:
  - gsoc
  - local-capture
authors:
  - emanuele-micheletti
  - maximilian-hils
---

mitmproxy can now transparently intercept traffic from macOS applications running on the same device, 
without fiddling with any proxy settings.

<!--more-->

##### *Editorial Note: Hi!*

*My name is [Emanuele Micheletti], and I'm one of this year's Google Summer of Code students for mitmproxy, 
mentored by [Maximilian Hils]. In this post I will present the implementation of a macOS Network Extension 
to transparently intercept macOS traffic![^source]*

[Emanuele Micheletti]: {{< relref "/authors/emanuele-micheletti" >}}
[Maximilian Hils]:  {{< relref "/authors/maximilian-hils" >}}
[^source]: You can find the source code for this not in the main mitmproxy repository, but over at https://github.com/mitmproxy/mitmproxy_rs!

## The Problem: Transparent Proxies are Hard

Transparently intercepting network traffic has been a long-standing usability issue for mitmproxy users. 
_iptables_, _nftables_, and _pf.conf_ are hard to get right, especially for users who are not as familiar with networking concepts.
While we have relatively extensive [documentation](https://docs.mitmproxy.org/stable/howto-transparent/) on this,
it's still a pain to set up.

In 2022, we've introduced [WireGuard® mode]({{< relref "wireguard-mode" >}}), which makes interception 
much easier for external devices such as smartphones or IoT devices.
But this does not work for traffic originating from the same machine that mitmproxy is running on.
Setting up a redirecting VPN does not work here, because we catch our own outgoing traffic again and will end up in an endless loop.

## The Solution: Local Redirect Mode

The above problem was the motivation to implement a new [proxy mode](https://docs.mitmproxy.org/stable/concepts-modes/) in mitmproxy, 
_local redirect mode_. In this mode, macOS users can instruct mitmproxy to transparently intercept traffic from the current machine:

```shell
mitmproxy --mode local
```

By default, all traffic will be intercepted, but we can also narrow it down to specific applications and processes:

```shell
# Intercept curl only
mitmproxy --mode local:curl
# Intercept everything *but* curl
mitmproxy --mode local:!curl
# Intercept a specific PID
mitmproxy --mode local:4123
```

As all other proxy modes, this works on all available interfaces: mitmdump, mitmproxy and mitmweb.


## How does it work?

Behind the scenes, there are a bunch of things going on. To get access to the network traffic, 
we [implemented a macOS Network Extension](https://github.com/mitmproxy/mitmproxy_rs/tree/0.4.1/mitmproxy-macos/redirector)
in Swift.
This extension looks at individual UDP and TCP flows, determines if they need to be redirected, and then forwards
them to [mitmproxy_rs](https://github.com/mitmproxy/mitmproxy_rs) as events over a Unix pipe. 
As with WireGuard mode, we have opted to implement the mitmproxy side in Rust, which lends itself very well
to writing this sort of highly-concurrent code. We're also able to reuse our Rust bindings from WireGuard mode.

{{<
figure src="architecture-macos.png"
caption="Architecture of the Transparent mode in macOS"
width="100%"
>}}

We initially built the local redirector using Apple's _Packet Tunnel Provider_ API, but this made
it hard to only process traffic from specific applications. We've since switched to the _App Proxy Provider_ API,
which, while limited to TCP and UDP only, allows us to leave some flows to the operating system to handle.


## When is it available?

Local redirect mode is already available in mitmproxy 10.1.5+!
We're announcing it only now because we first needed to [figure out how to ship
a signed and notarized system extension](https://github.com/Homebrew/homebrew-core/pull/145547#issuecomment-1732616565) 
via Homebrew. But thanks to the fantastic Homebrew folks, 
`brew install mitmproxy` now works!

## What about certificates?

So far this post has focused on _redirecting_ the traffic to mitmproxy, but in many cases we still need to get the 
target application to trust your local mitmproxy certificates. As part of GSoC, I have also implemented relevant functionality
within the [security-framework](https://github.com/x52dev/security-framework) crate, which wraps the 
Apple Security Framework in Rust. Thanks to these changes, mitmproxy will soon be able to automatically install the
certificate when running in local redirect mode as well!

## What's next?

We're pretty excited to have a first version of local redirect mode available for macOS users in the latest release, 
but we're only getting started here. There are three areas we're currently working on:

1. Windows Support! [@mhils](https://github.com/mhils) has been working on a similar solution for Windows, 
   which will be based on the [WinDivert](https://reqrypt.org/windivert.html). Expect a blog post on this soon!
2. Redirection on Linux is still in its infancy, but [@decathorpe](https://github.com/decathorpe) has plans for an EBPF-based 
   solution.
3. Last but not least, local redirect mode is bound to receive a UI integration into mitmweb.
   My work for the macOS bits of this is [in progress](https://github.com/mitmproxy/mitmproxy_rs/pull/118) as well!

## Acknowledgments

This work supported by [Google Summer of Code] under the umbrella of the [Honeynet&nbsp;Project], and the 
[NGI0 Entrust fund](https://nlnet.nl/entrust/) established by [NLnet](https://nlnet.nl/).

[Honeynet&nbsp;Project]: https://www.honeynet.org/
[Google Summer of Code]: https://summerofcode.withgoogle.com/
[NLnet]: https://nlnet.nl/
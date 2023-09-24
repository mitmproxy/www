---
title: "Intercepting macOS Applications"
date: 2023-09-30
weight: 10
tags: [ tech, Rust, Swift ]
author:
  name: Emanuele Micheletti
  twitter: emanuele_em_
---

mitmproxy 10.x introduces support for transparently intercepting macOS applications running on the same device.
This makes it possible to intercept all local applications with the click of a button, without fiddling with any proxy settings.

<!--more-->

##### *Editorial Note: Hi!*

*My name is [Emanuele Micheletti], and I'm one of this year's Google Summer of Code students for mitmproxy, 
mentored by [Maximilian Hils]. In this post I will present the implementation of a macOS Network Extension 
to transparently intercept macOS traffic![^source]*

[Emanuele Micheletti]: https://twitter.com/emanuele_em_
[Maximilian Hils]:  https://twitter.com/maximilianhils
[^source]: You can find the source code for this not in the main mitmproxy repository, but over at https://github.com/mitmproxy/mitmproxy_rs!

## The Problem

While mitmproxy has long supported transparent proxying, 
Intercepting traffic on macOS was technically possible but, when the machine launching Mitmproxy was the same that was to
be intercepted, it was not possible to distinguish between outgoing traffic from Mitmproxy and outgoing traffic from
non-Mitmproxy apps, the result was an endless loop with Mitmproxy intercepting Mitmproxy itself.

Fiddling with rdr rules in _pf.conf_ - as shown
in [docs](https://docs.mitmproxy.org/stable/howto-transparent/#work-around-to-redirect-traffic-originating-from-the-machine-itself-1) -
was a workaround for this problem, but this solution was far from being the definitive solution.

## The Solution

The above problem was the pretext for implementing from scratch the new transparent mode for the local machine on macOS,
thus taking advantage from Rust capabilities in [mitmproxy_rs](https://github.com/mitmproxy/mitmproxy_rs) in addition to
the proximity between Swift and Apple's operating system.
Also in the macOS version - as well in the Windows one - there is a redirector app that first intercepts IP raw packets,
sends them to Mitmproxy and then it handles the reinjection of the mitmproxy outgoing packets back into the machine.

<br>
{{<
figure src="architecture.svg"
caption="Architecture of the Transparent mode in macOS"
width="100%"
>}}
<br>

## How to use it

Nothing could be simpler:

```shell
mitmproxy --mode osproxy
```

By default, all traffic will be intercepted but it is possible to specify one or more process to intercept - or to not
intercept - simply by adding a substring corresponding to the app identifier or pid associated with it, like these
examples:

```shell
# To intercept only curl
mitmproxy --mode osproxy:curl
# To intercept everything except for curl
mitmproxy --mode osproxy:!curl
```

This mode works on all available interfaces: mitmdump, mitmproxy and mitmweb.

## Other notable improvements:

With transparent mode, the ability to automatically install the mitmproxy certificate on macOS, directly from Rust, was
introduced. In these months some new system functions have been added
within [x52dev/security-framework](https://github.com/x52dev/security-framework) - a wrapper of Apple Security Framework
written in Rust. Thanks to these changes from now on it will not be necessary to download, install and self-sign
mitmproxy certificates, but everything will be happen automatically!

## What's next?

This version is still experimental and bugs-prone. Some features are not fully implemented yet, the app filter, for
example, is being improved and still has some minor issues.
The final name to be given to the mode is being discussed (at the time of writing); it may change in the future along
with some strictly usability aspects.

## Acknowledgements

This work supported by [Google Summer of Code] under the umbrella of the [Honeynet&nbsp;Project], and the 
[NGI0 Entrust fund](https://nlnet.nl/entrust/) established by [NLnet](https://nlnet.nl/).

[Honeynet&nbsp;Project]: https://www.honeynet.org/
[Google Summer of Code]: https://summerofcode.withgoogle.com/
[NLnet]: https://nlnet.nl/
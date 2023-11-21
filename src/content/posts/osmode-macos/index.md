---
title: "Transparent mode is growing, MacOS is now supported"
date: 2023-08-23
weight: 10
tags: [tech, Rust, Swift]
author:
    name: Emanuele Micheletti
    twitter: emanuele_em_
---

<!-- intro -->
The transparent mode of mitmproxy finally gives a welcome to MacOS. This new version - although in its initial state - allow the user to intercept traffic at OS layer in a very simple way, saving the user from having to manually set up either traffic redirection or worry about installing and self-signing Mitmproxy certificate.

This project is part of a [Google Summer of Code Journey](https://github.com/mitmproxy/mitmproxy/issues/5850), with the goal to solve a long-known [github issue](https://github.com/mitmproxy/mitmproxy/issues/1261). 
With this new features, it will not only be possible to intercept traffic from the same machine that launches Mitmproxy, but also to redirect IP traffic natively, with a perfect symbiosis between Rust and Swift.

## The problem

Intercepting traffic on MacOS was tecnically possible but, when the machine launching Mitmproxy was the same that was to be intercepted, it was not possible to distinguish between outgoing traffic from Mitmproxy and outgoinf traffic from non-Mitmproxy apps, the result was an endless loop with Mitmproxy intercepting Mitmproxy itself.

Fiddling with rdr rules in _pf.conf_ - as shown in [docs](https://docs.mitmproxy.org/stable/howto-transparent/#work-around-to-redirect-traffic-originating-from-the-machine-itself-1) - was a workaround for this problem, but this solution was far from being the definitive solution.

## The solution

The above problem was the pretext for implementing from scratch the new transparent mode for the local machine on MacOS, thus taking advantage from Rust capabilities in [mitmproxy_rs](https://github.com/mitmproxy/mitmproxy_rs) in addition to the proximity between Swift and Apple's operating system.
Also in the MacOS version - as well in the Windows one - there is a redirector app that first intercepts IP raw packets, sends them to Mitmproxy and then it handles the reinjection of the mitmproxy outgoing packets back into the machine.

<br>
{{<
figure src="architecture.svg"
caption="Architecture of the Transparent mode in MacOS"
width="100%"
>}}
<br>

## How to use it

Nothing could be simpler:

```shell
mitmproxy --mode osproxy
```
By default, all traffic will be intercepted but it is possible to specify one or more process to intercept - or to not intercept - simply by adding a substring corresponding to the app identifier or pid associated with it, like these examples:
```shell
# To intercept only curl
mitmproxy --mode osproxy:curl
# To intercept everything except for curl
mitmproxy --mode osproxy:!curl
```
This mode works on all avalaible interfaces: mitmdump, mitmproxy and mitmweb.

## Other notable improvements:

With transparent mode, the ability to automatically install the mitmproxy certificate on MacOS, directly from Rust, was introduced. In these months some new system functions have been added within [x52dev/security-framework](https://github.com/x52dev/security-framework) - a wrapper of Apple Security Framework written in Rust. Thanks to these changes from now on it will not be necessary to download, install and  self-sign mitmproxy certificates, but everything will be happen automatically!

## What's next?

This version is still experimental and bugs-prone. Some features are not fully implemented yet, the app filter, for example, is being improved and still has some minor issues.
The final name to be given to the mode is being discussed (at the time of writing); it may change in the future along with some strictly usability aspects.

## Acknowledgements

None of this would have been possible without [@Mhils](https://github.com/mhils) mentorship, his patience and top-notch skills. A big thank to Google that allow this type of incredible experiences and also to the entire huge OSS world that live behing projects like Mitmproxy.

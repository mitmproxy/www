---
title: "Mitmproxy 5.2"
date: 2020-07-23
weight: 10
tags: [
    "releases",
]
author:
  name: Martin Plattner
  twitter: martinplattnr
---

We are excited to announce the release of [mitmproxy 5.2](https://github.com/mitmproxy/mitmproxy/releases/tag/v5.2)! This release comes not only with a long list of improvements and bugfixes -- 48 PRs from over 30 contributors -- but also with the first fruits from this year's Google Summer of Code:
In this post we take a look the new and improved replacement features.

<!--more-->

##### *Editorial Note: Hi!*

*My name is [Martin Plattner](https://mplattner.at) ([@mplattner](https://github.com/mplattner)) and I'm this years' [Google Summer of Code](https://summerofcode.withgoogle.com/) student for mitmproxy.
My main task so far was the implementation of the new replacement addons that I describe below.
It's been a great experience already and I'm looking forward to the rest of the summer.*

## New Replacement UX

The existing `Replace` addon was cumbersome to use: there was no way to specify where the replacements are applied, [among other shortcomings](https://github.com/mitmproxy/mitmproxy/issues/3948).
We completely revised the current implementation and introduce four new addons that provide a unified user experience to perform replacements: *ModifyBody*, *ModifyHeaders*, *MapRemote*, and *MapLocal*.

 - The `ModifyBody` addon applies replacements in the body of requests and responses.
A simple rule like `/Hi/Hello` replaces all occurrences of `Hi` with `Hello`.

 - `ModifyHeaders` works on headers: it can set, replace, or remove existing headers. For example, `|User-Agent|Wget/1.11.4` sets the user agent header on all requests to impersonate wget.
Common use-cases for this addon are to set cache or security headers for development and security research.

 - The `MapRemote` addon transparently serves resources from an alternative remote location.
The URL is rewritten before performing the request.
mitmproxy then fetches the new resource and serves it instead of the original.

 - The last addon is `MapLocal`, which maps remote resources to local files.
For example, using the rule `|example.com/js|~/js` you can redirect all requests to
`example.com/js/*` to the local directory `~/js`.

All addons use a configuration pattern of the form `/filter/subject/replacement`.
The optional [mitmproxy filter expression](https://docs.mitmproxy.org/archive/v5/concepts-filters/) can be used to only target specific messages, for example only HTTP GET requests using `~m GET`.

Time for an example. Let's use `ModifyBody` and `MapRemote` to make browsing the web more fun:
We replace `BBC` with `DOG` in the body of all pages and redirect all image requests to [placedog.net](https://placedog.net).

{{< figure src="../mitmproxy52/mapremote_bbc_dogs.jpg" >}}

```plain
mitmproxy
  --modify-body "/BBC/Dog"
  --map-remote "|^.+\.jpg$|https://placedog.net/640/480?random"
  --no-http2  # Full HTTP/2 redirects are coming soon!
```

More seriously, a real-world use case for developers would be to serve certain files from the dev environment while browsing the production environment, for example with a rule like `|www.example.org/css/|dev.example.org/css/`.



This should give you a glance of what you can do with the new replacement addons.
We hope these new features are helpful and we're happy to hear your feedback.
For more details and examples please see the [documentation](https://docs.mitmproxy.org/stable/overview-features/).

## Release Changelog

Thanks to our great contributors there are many other notable changes:

* Add Filter message to mitmdump (@sarthak212)
* Display TCP flows at flow list (@Jessonsotoventura, @nikitastupin, @mhils)
* Colorize JSON Contentview (@sarthak212)
* Fix console crash when entering regex escape character in half-open string (@sarthak212)
* Integrate contentviews to TCP flow details (@nikitastupin)
* Added add-ons that enhance the performance of web application scanners (@anneborcherding)
* Increase WebSocket message timestamp precision (@JustAnotherArchivist)
* Fix HTTP reason value on HTTP/2 reponses (@rbdixon)
* mitmweb: support wslview to open a web browser (@G-Rath)
* Fix dev version detection with parent git repo (@JustAnotherArchivist)
* Restructure examples and supported addons (@mhils)
* Certificate generation: mark SAN as critical if no CN is set (@mhils)
* mitmweb: "New -> File" menu option has been renamed to "Clear All" (@yogeshojha)
* Add support for HTTP Trailers to the HTTP/2 protocol (@sanlengjingvv and @Kriechi)
* Fix certificate runtime error during expire cleanup (@gorogoroumaru)
* Fixed the DNS Rebind Protection for secure support of IPv6 addresses (@tunnelpr0)
* WebSockets: match the HTTP-WebSocket flow for the ~websocket filter (@Kriechi)
* Fix deadlock caused by the "replay.client.stop" command (@gorogoroumaru)
* Add new MapLocal addon to serve local files instead of remote resources (@mplattner and @mhils)
* Add minimal TCP interception and modification (@nikitastupin)
* Add new CheckSSLPinning addon to check SSL-Pinning on client (@su-vikas)
* Add a JSON dump script: write data into a file or send to an endpoint as JSON (@emedvedev)
* Fix console output formatting (@sarthak212)
* Add example for proxy authentication using selenium (@anneborcherding and @weichweich)


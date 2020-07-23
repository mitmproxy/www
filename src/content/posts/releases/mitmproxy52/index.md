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

We are excited to announce the release of [mitmproxy 5.2](https://github.com/mitmproxy/mitmproxy/releases/tag/v5.2).
It comes with many improvements and bugfixes: 48 merged PRs with 211 commits from over 30 contributors - see the full changelog below.
In this post we take a look the new and improved replacement features.

<!--more-->

## Unified Replacement UX

The existing `Replace` addon was cumbersome to use: there was no way to specify where the replacements are applied, [among other shortcomings](https://github.com/mitmproxy/mitmproxy/issues/3948).
We completely revised the current implementation and got rid of of the existing addon.
Instead, we introduce four new addons that provide a unified user experience to perform replacements.
All addons use a configuration pattern of the form `/filter-expression/subject/replacement`, where the first character is used as the separator.
The optional filter expression can be used to only target specific messages, e.g. only `GET` requests using `~m GET`

The `ModifyBody` addon applies replacements in the body of requests and responses.
A simple rule like `/Hi/Hello` replaces all occurrences of `Hi` with `Hello`.


`ModifyHeaders` works on headers: it can set, replace, or remove existing headers.
The rule `/Set-Cookie/` removes all cookie headers and `|User-Agent|Wget/1.11.4` sets or changes the user agent header.
Common use-cases for this addon could be to set cache or security headers for debugging purposes while developing.

The `MapRemote` addon transparently serves resources from an alternative remote location.
The URL is rewritten before performing the request.
mitmproxy then fetches the new resource and serves it instead of the original.

Time for an example. Let's use `ModifyBody` and `MapRemote` to make browsing the web more fun.
We replace `BBC` and `Trump` with `Dog` in the body of all pages and redirect all image requests to [placedog.net](https://placedog.net).

{{< highlight plain >}}
mitmproxy \
  --modify-body "/BBC/Dog" --modify-body "/Trump/Dog" \
  --map-remote "|.*\.jpg$|https://placedog.net/640/480?random"
{{< / highlight >}}

{{< figure src="../mitmproxy52/mapremote_bbc_dogs.jpg" >}}

More seriously, a real-world use case for developers could be to serve certain files from the dev environment while browsing the production environment,
e.g., with the rule `|www.example.org/css/|dev.example.org/css/`.

The last addon is `MapLocal`, which maps remote resources to local files.
For example, using the rule `|example.com/js|~/js` you can redirect all requests to
`example.com/js/*` to the local directory `~/js`.

This should give you a glance of what you can do with the new replacement addons.
We hope these new features are helpful and we're happy to hear your feedback.
For more details and examples please see the [documentation](https://docs.mitmproxy.org/stable/overview-features/).

## Other changes

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

## GSoC 2020

My name is [Martin Plattner](https://mplattner.at) ([@mplattner](https://github.com/mplattner)) and I'm this years' [Google Summer of Code](https://summerofcode.withgoogle.com/) student for mitmproxy.
My main task so far was the implementation of the new replacement addons that I've described above.
It's been a great experience already and I'm looking forward to the rest of the summer.
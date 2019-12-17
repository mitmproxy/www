---
title: "Mitmproxy 5"
date: 2019-12-16
weight: 10
tags: [
    "releases",
]
author:
  name: Maximilian Hils
  twitter: maximilianhils
---

We've just released [mitmproxy
5](https://github.com/mitmproxy/mitmproxy/releases/tag/v5.0.0), the latest and greatest version of mitmproxy. It brings a shiny colorful table view and tons of small fixes: Since the last release, the project has had 495 commits by 70 contributors, resulting in 244 closed issues and 197 closed PRs.

<!--more-->

{{< figure src="../mitmproxy5/mitmproxy-v5.png" >}}

## New Table UI

As a major change, mitmproxy 5.0 comes with the new default table view contributed by <a href="https://github.com/Jessonsotoventura">@Jessonsotoventura</a> and <a href="https://github.com/BkPHcgQL3V">@BkPHcgQL3V</a>. Both hadn't contributed to mitmproxy before, so it's exciting to see a new major feature from fresh contributors. 

We're of course curious and asked Jesson about his first mitmproxy dev experience:

<blockquote>
It all started with @BkPHcgQL3V, who built out the original design for the table view. Now the portion of code base that creates the flow list is self-contained and with a few tweaks to the original UI and some urwid magic the list view became a table view. @BkPHcgQL3V had done all the hard work, but the PR stalled out. This is where I come in, I wanted to improve mitmproxy, specifically, I wanted to add a view for plain TCP flows. But I had two problems: First, I didn't kown how to use urwid to create a UI. Second, I wanted to use a table to represent TCP traffic. So while looking for a way to learn the inner workings of mitmproxy, I stumbled upon the stalled PR and forced it alive. I poked and prodded @mhils until he responded, and added his suggestions – the ability to switch back to the old list view and color palettes. Once it was merged, I started to use the UI and sure enough it makes using mitmproxy more convenient. So give it a go, find bugs, post issues, make pull requests and keep an eye out for a couple of protocols leveraging the table view in the near future.
</blockquote>

If that sounds fun and you want to get involved, please join us in the developer chat! 😀

## iOS 13

We've been a bit lazy with shipping a 4.x patch release, but mitmproxy 5 finally brings support for iOS 13. Contributed by <a href="https://github.com/vin01">@vin01</a>, we now generate certificates that include an ExtendedKeyUsage extension. You may need to delete your existing mitmproxy CA (<code>~/.mitmproxy</code>) and generate a new one by restarting mitmproxy.


## Security Fixes

This release also includes two security fixes:

* Fixed command injection vulnerabilities when exporting flows as curl/httpie commands. (<a href="https://github.com/cript0nauta">@cript0nauta</a>)
* Do not echo unsanitized user input in HTTP error responses. (<a href="https://github.com/fimad">@fimad</a>)

Most users should be unaffected, but please upgrade nonetheless!

## What's more?

This release adds a lot of polish. Here's the full changelog:

* Moved to Github CI for Continuous Integration, dropping support for old Linux and macOS releases. (#3728)
* Vastly improved command parsing, in particular for setting flow filters (@typoon)
* Added a new flow export for raw responses (@mckeimic)
* URLs are now edited in an external editor (@Jessonsotoventura)
* mitmproxy now has a command history (@typoon)
* Added terminal like keyboard shortcuts for the command bar (ctrl+w, ctrl+a, ctrl+f, ...) (@typoon)
* Fixed issue with improper handling of non-ascii characters in URLs (@rjt-gupta)
* Filtering can now use unicode characters (@rjt-gupta)
* Fixed issue with user keybindings not being able to override default keybindings
* Improved installation instructions
* Added support for IPV6-only environments (@sethb157)
* Fixed bug with server replay (@rjt-gupta)
* Fixed issue with duplicate error responses (@ccssrryy)
* Users can now set a specific external editor using $MITMPROXY_EDITOR (@rjt-gupta)
* Config file can now be called `config.yml` or `config.yaml` (@ylmrx)
* Fixed crash on `view.focus.[next|prev]` (@ylmrx)
* Updated documentation to help using mitmproxy certificate on Android (@jannst)
* Added support to parse IPv6 entries from `pfctl` on MacOS. (@tomlabaude)
* Fixed instructions on how to build the documentation (@jannst)
* Added a new `--allow-hosts` option (@pierlon)
* Added support for zstd content-encoding (@tsaaristo)
* Fixed issue where the replay server would corrupt the Date header (@tonyb486)
* Improve speed for WebSocket interception (@MathieuBordere)
* Fixed issue with parsing JPEG files. (@lusceu)
* Improve example code style (@BoboTiG)
* Fixed issue converting void responses to HAR (@worldmind)
* Color coded http status codes in mitmweb (@arun-94)
* Added organization to generated certificates (@Abcdefghijklmnopqrstuvwxyzxyz)
* Errors are now displayed on sys.stderr (@JessicaFavin)
* Fixed issue with replay timestamps (@rjt-gupta)
* Fixed copying in mitmweb on macOS (@XZzYassin)
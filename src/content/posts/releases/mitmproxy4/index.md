---
title: "Mitmproxy 4"
date: 2018-05-15
weight: 10
tags: [
    "releases",
]
---

We've just released [mitmproxy
v4.0](https://github.com/mitmproxy/mitmproxy/releases/latest), and it's an
absolute corker. Among the usual long list of bugfixes and improvements, one
thing stands out: speed. Users should see about **4x** improvement in core
request throughput for mitmdump, and a **10x** or more improvement for mitmproxy
console. Let's dig into the details.

<!--more-->

{{< figure src="../mitmproxy3/mitmproxy-v3.png" >}}

## Speed!

At its core, mitmproxy co-ordinates communication by shunting messages between
client connection threads and a single main controller thread. The mechanics of
this process has always been a drag on our performance, especially when
interactive event loops enter the picture. This release shifts the core
controller thread to Python's built-in
[asyncio](https://docs.python.org/3/library/asyncio.html) event loop. The result
is rather remarkable: a roughly **4x** speedup in mitmdump, and a more than
**10x** speedup for mitmproxy console.


## Console key binding configuration

The key bindings for mitmproxy console can now be configured through the
 `keys.yaml` file, under the mitmproxy configuration directory (`~/.mitmproxy`).
 Here's an example of this file's syntax:

{{< highlight yaml  >}}
-
  # Simple global binding
  key: ctrl a
  cmd: replay.client @marked
-
  # Bind key only in the fowlist
  key: "1"
  ctx: ["flowlist"]
  cmd: console.nav.down
  help: Go to next flow
{{< / highlight >}}

Please see the [docs](https://docs.mitmproxy.org/stable/tools-mitmproxy/) for
more information.

## Other notable changes

There are a number of other changes to note:

- Mitmproxy now only supports Python 3.6 and newer. The immediate reason for
  this shift is improvements to the the asyncio module in 3.6. We plan to be
  fairly aggressive about deprecating support for older versions of Python from
  here on.
- The `--conf` and `--cadir` command-line flags have been removed, and replaced
  with `--confdir`. This flag directs mitmproxy to use a specified configuration
  directory, with all the configuration files it might contain.
- The `allow_remote` option has been replaced by the much more flexible
  `block_global` and `block_private` options.
- We no longer magically capture `print` statements in addons and turn them into
  logs. Please use the `ctx.log.*` functions explicitly.


## Release cadence

This release sees a shift in the mitmproxy project's release cadence. It's been
just less than three months since the release of v3.0, and we intend to maintain
this pace into the future. Henceforth, you should expect mitmproxy releases at
approximately 2-3 month intervals.


## GSoC

We're also very happy to announce that the project will host two brilliant
students under the [Google Summer of Code
2018](https://summerofcode.withgoogle.com/) program this year. GSoC has played
an important role in mitmproxy's history - it's an opportunity for us to induct
talented co-conspirators into the project as full contributors.

[Roman Samoilenko](https://www.linkedin.com/in/roman-samoilenko-ab041114a/)
([@kajojify](https://github.com/kajojify)) will be working on the new [command
language](https://github.com/mitmproxy/mitmproxy/issues/3087) for mitmproxy.
This is the glue that binds together mitmproxy and its addons through a system
of flexible, typed commands. Once this is in place, it will make entirely new
patterns of interaction with mitmproxy possible.

[Pietro Tirenna](http://madt1m.github.io/)
([@madt1m](https://github.com/madt1m)) will be modernising mitmproxy's
[serialisation format](https://github.com/mitmproxy/mitmproxy/issues/3075). The
new format will allow random access and in-place modification of flows and
provide APIs for storing auxiliary flow data. This is a critical change that
will set the stage for a huge slew of improvements to mitmproxy in coming
releases.

We'd like to thank Roman and Pietro for tackling two very ambitious and
important projects with us.
---
title: "Mitmproxy 3"
date: 2018-02-22
weight: 10
tags: [
    "releases",
]
---

We're delighted to announce the release of [mitmproxy
v3.0](https://github.com/mitmproxy/mitmproxy/releases/latest). This is a massive
milestone release, featuring a substantial revamp of mitmproxy's internal
structure and serious improvements in all tools across the board. Everyone should
update!

The project's momentum remains fearsome: this release features 1235 commits by
19 contributors, resulting in 287 closed issues and 308 merged PRs. With this
release, we're also launching a new website (you're looking at it), a new
project blog (you're reading this release notice on it), and [cleaner
docs](/docs/latest).

Let's dig into the details.

## Internals

Mitmproxy now has a powerful new [addon
infrastructure](/docs/latest/addons-overview/). Addons can hook into mitmproxy's
[internal events](/docs/latest/addons-events/), can expose [typed
options](/docs/latest/addons-options) for configuration, and can create [typed
commands](/docs/latest/addons-events/) for user interaction. We've migrated much
of mitmproxy's [own functionality into a set of internal
addons](https://github.com/mitmproxy/mitmproxy/tree/master/mitmproxy/addons),
resulting in a much cleaner and more maintainable code structure.

Perhaps the most exciting aspect of this change is the power it gives
third-party addons and user scripts. We expose precisely the same functionality
mitmproxy uses for itself to users. Typed options declared by addons
automatically appear in type-aware options editors in the official tools, are
automatically included in configuration files, and can automatically be
controlled from the command line. Typed commands exposed by addons get tab
completion in mitmproxy console for free, and can be bound to keys. If you're
working on an extension of mitmproxy, please let us know - mitmproxy addons are
now more powerful and easier to write than ever, and we'd like your feedback to
help us make them better still.


## Mitmproxy console

{{< figure src="./mitmproxy-v3.png" >}}

The mitmproxy console app has been rebuilt around the new addon mechanism. Every
user interaction and key binding simply invokes an addon command. Keystrokes can
be bound directly to commands, and the command language can be invoked from an
interactive, smart, syntax-aware prompt. User addons and scripts are first-class
citizens, and get the same tab completion, type-aware options editor and key
binding support as builtins.

The introduction of [commands](/docs/latest/concepts-commands) makes mitmproxy a
massively more flexible and powerful tool. Any operation on flows can be invoked
from the command prompt and combined with flow selectors. So, for instance, we
can replay all flows with the domain "google.com" like so:

{{< figure src="./command-example.png" >}}

Along with this comes many, many user interface improvements. Major changes
include horizontal and vertical multi-pane layouts, customizable keybindings, an
options editor, and a command palette. There are too many minor improvements to
list, but my personal favourite is the new "B" keybinding (the `browser.start`
command), which opens an isolated instance of Chrome automatically set up to go
through the running proxy. Very handy.


## Mitmweb, protocol support and others

As usual, there are many other improvements in this release. Mitmweb, the
mitmproxy web interface, has continued to mature with a new options editor, and
many other improvements. This will open a slew of new use cases for our toolset
down the track. Mitmproxy's content views - including the beautifiers for
JavaScript and CSS and image summary viewers - are now faster and better. Our
underlying protocol support has improved, with a better websockets stack and the
introduction of request streaming for HTTP1 and HTTP2.

For a complete list of changes, see the
[CHANGELOG](https://github.com/mitmproxy/mitmproxy/blob/master/CHANGELOG).



## GSOC

Of special note during this release cycle is the work of our two brilliant [GSOC
2017](https://summerofcode.withgoogle.com/) students, who participated in
mitmproxy's development under the umbrella of the [HoneyNet
Project](https://www.honeynet.org/). [Matthew
Shao](https://github.com/matthewshao) made major improvements to the mitmproxy
web interface, including adding a new options editor, vastly improving our
testing and working on a static web viewer for mitmproxy dumps. Matthew wrote a
detailed blog about his work on the [HoneyNet
blog](http://honeynet.org/node/1359). [Ujjwal
Verma](https://github.com/ujjwal96) pushed our content views and protocol layers
ahead very significantly. You can thank him for faster, more stable decoding of
images, protobufs, and better prettifying of JavaScript and CSS. He also
migrated our websockets implementation to
[wsproto](https://github.com/python-hyper/wsproto), and added request streaming
to HTTP1 and HTTP2. We look forward to working with both Matthew and Ujjwal in
the years to come.



## Survey

Mitmproxy doesn't have telemetry and collects as little data as possible on its
users. We rely on your manual feedback to let us know what to build. Please take
a moment to fill in the [2018 mitmproxy user
survey](https://goo.gl/forms/Or2mwRtcG5h8yr813) - this feeds directly into our
dev priorities for the next year.




---
title: "Google Summer of Code 2018"
date: 2018-03-20
weight: 10
tags: [
    "gsoc",
]
author:
  name: Aldo Cortesi
  twitter: cortesi
---

{{< image src="gsoc.png" >}}

Mitmproxy has participated in the [Google Summer of
Code](https://summerofcode.withgoogle.com/) program under the umbrella of the
[Honeynet Project](https://www.honeynet.org/) since 2012. The students that have
come to us through GSoC have had a deep and lasting impact on our project - no
less than two of mitmproxy's current co-leaders started their journey as GSoC
students. For the right student, GSOC is a wonderful opportunity to be mentored
to become a full-fledged mitmproxy dev team member. There's only about one week
left before our application for slots needs to be submitted, so if you want to
come along for the adventure, you have to move quickly!

<!--more-->

The first step is to choose a project to work on. We have a huge number of
interesting areas to explore, and you should feel free to mix projects according
to your interests. Below are some ideas with a rough project size estimations -
an enterprising student should be able to complete one large or 3 or more small
projects during the GSoC period. For many students, starting with a small
project is a great way to get familiar with the codebase, even if you then move
on to a larger block of work next. Note that these are just suggestions - if you
have a compelling idea not on the list, come and discuss it with us.

- **[large]** A major feature on mitmproxy’s roadmap is the replacement of our
  proxy core with an implementation that separates I/O and protocol logic (“sans
  I/O”). This work is already under way, and students up for a challenge could
  help solidify the HTTP, HTTP/2, and WebSockets implementations that will power
  a future version of mitmproxy. Writing a TLS or HTTP implementation that is
  used by thousands of users is an exciting and amazing challenge. We’d love to
  have a student with us on that quest, but be warned it’s a very steep and
  stony path that requires very strong software engineering skills to be
  successful.
- **[large]** Ecosystem germination: Mitmproxy's addon mechanism has undergone a
  complete revolution in the last year. We can now write powerful, isolated
  addons that reach into almost any facet of mitmproxy's operation. We're now
  ready to take the next step, and work out how to foster an addon ecosystem
  outside of the core. This involves planning and implementing methods for
  addon distribution, considering the thorny problem of how to manage addons
  with third-party dependencies, setting up an addon registry, and solidifying
  our APIs to make the third-party addon experience even better. This is an
  opportunity to have a huge impact on the future of mitmproxy as a project.
- **[large]** Mitmproxy urgently needs a new built-in primitive: sessions.
  Sessions will hold information related to a given capture session, keep a
  spool of captures on-disk, and allow users to annotate flows and save hot
  configuration without affecting their global config files. This will solve
  some large outstanding issues for mitmproxy and pave the way for us to take
  the next step in our interactive tooling. [{{< issue 2175 >}}]
- **[large]** Mitmproxy's current serialisation format has served us well, but
  has a number of shortcomings. It's hard to maintain, has impedance
  mismatches with the structure of our data, and is hard to use from other
  languages. Your task will be to grow a clean, lean serialisation format
  based on Google protobufs - at first as an exporter addon, and then to
  migrate it into mitmproxy's core. As part of this, you will also map out the
  protobuf-generated language bindings for the capture format that will make
  mitmproxy's data accessible from other programming universes. [{{< issue 2660 >}}]
- **[medium/large]** We’d love to improve mitmproxy’s performance. It’s a
  well-known fact that you can’t improve what you can’t measure, and at the
  moment mitmproxy is flying blind. Your mission, should you choose to accept
  it, would be to set up a benchmarking suite for mitmproxy to measure our key
  indicators, work out how to run this reliably in the cloud, and create a
  performance dashboard that will be linked to from our website. As a next step,
  you may choose to fix some of the performance issues you discovered.
- **[medium/large]** We're interested in trialling the sans-I/O core we have
  under development with non-web protocols. There are a huge number of protocols
  that make use of TLS and could usefully be intercepted. Common protocols that
  are not overly complicated - SMTP, POP, and IMAP spring to mind - might find a
  home within the mitmproxy project itself. A stretch goal here might be SSH
  interception, which will require a somewhat lower-level approach. You could
  also explore some more exotic protocols like RDP - these might use the core
  but remain external to mitmproxy. The project here would be to extend the set
  of protocols we implement, and solidify the sans-I/O APIs to ensure that
  they're general-purpose and fit for use.
- **[medium]** Many mitmproxy users want to use mitmproxy to just see all
  traffic of their current device without configuring individual applications,
  but that requires a complicated iptables configuration or undocumented
  scripts on Windows. You can make tremendous improvements to mitmproxy
  onboarding experience here! [{{< issue 1261 >}}]
- **[medium]** Extend mitmproxy's console UI to support WebSockets and raw TCP
  mode. These protocols are well-supported and mature in the core, but we
  haven't found the time to expose them to users in the UI. We need YOUR help!
- **[small/medium]** Improved Contentviews [{{< issue 1662 >}}]
- **[small/medium]** Importers and Exporters for related file formats, such as
  HAR. [{{< issue 1477 >}}]
- **[small]** Support for upstream SOCKS proxies [{{< issue 211 >}}]
- **[small]** "Map Remote Editor": Other proxies have a feature which maps one
  URL to another, e.g. one can map https://example.com/foo.js to a local file
  that is served to the client instead. It is easy to write a mitmproxy script
  that does this, but we want this to be a built-in feature! Fun fact: This task
  was initially proposed by a GSoC student in [{{< issue 1454 >}}]!
- **[variable]** [See our issue tracker for many more
  ideas](https://github.com/mitmproxy/mitmproxy/issues), small and large.


# The next step

The next step is to [join us on Slack](https://slack.mitmproxy.org/) to discuss
your project idea. After that, you will be asked to prepare a formal application
that we can comment on and tweak for final submission.






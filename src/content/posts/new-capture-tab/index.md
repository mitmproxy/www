---
title: "New Capture Tab Page in mitmweb"
date: 2024-07-25
weight: 10
tags: [ releases, gsoc ]
author:
  name: Matteo Luppi
---

Mitmweb now features a dedicated Capture tab page, enabling users to dynamically select their preferred proxy mode on the fly. We are glad to announce that the first MVP of this feature is already available in the [latest release of mitmproxy](https://github.com/mitmproxy/mitmproxy/releases/tag/v10.4.0).

<!--more-->

##### *Editorial Note: Hi!*

*Hi! My name is [Matteo Luppi], and I’m one of this year’s GSoC students for mitmproxy. Under the mentorship of [Maximilian Hils], my primary focus has been on enhancing mitmweb. In this blog post, I’ll introduce you to our new Capture tab page in mitmweb.*

[Matteo Luppi]: https://github.com/lups2000
[Maximilian Hils]:  https://twitter.com/maximilianhils

## Idea behind the feature

Let’s start with the inspiration behind this new feature. My GSoC work aimed to improve the onboarding experience for new mitmproxy users and simplify the UX for those who enjoy using mitmweb. Enhancing the visibility and accessibility of switching proxy modes, a crucial functionality of mitmproxy, was a key goal.
In previous versions of mitmweb, changing the proxy mode was only possible through the Options Modal, which appeared after clicking on "Edit Options".

{{<
figure src="options_modal.png"
caption="Options Modal when changing proxy modes"
width="100%"
>}}

As you might imagine, this process could be quite confusing and obscure for first-time users. To address this, we designed a new Capture tab page where all the proxy modes are listed, allowing users to change modes easily and intuitively on the fly.

## How it looks

Now, when users run mitmweb from the terminal, they will immediately see the new Capture page with the regular mode set by default, listening on port 8080.

{{<
figure src="default_regular.png"
caption="Default configuration when opening mitmweb"
width="100%"
>}}

Users can change the modes according to their preferences, and these changes will take effect immediately after toggling the mode fields.

{{<
figure src="multiple_modes.png"
caption="Example of toggling multiple modes"
width="100%"
>}}

The options modal is still available, so if you’re accustomed to using it, rest assured that you can still change your modes there, and the changes will be reflected appropriately. Even if you start mitmweb with a specific configuration from the terminal, the changes will be applied accordingly.


## What’s Next?

This feature represents my work for the first part of GSoC, and there’s still much room for improvement. Upcoming enhancements include adding the remaining modalities, introducing multiple reverse mode features, improving the UI for changing configurations such as listen_port or listen_host, and creating a display for active processes on the machine in local mode. We have some exciting ideas in the pipeline, but no spoilers just yet!

If you have any doubts or suggestions, feel free to reach out. We’re always happy to help!

## Acknowledgments

I would like to thank my mentor Max, who has been incredibly supportive and helpful throughout this project, and [Google Summer of Code] for giving me this opportunity!

[Google Summer of Code]: https://summerofcode.withgoogle.com/
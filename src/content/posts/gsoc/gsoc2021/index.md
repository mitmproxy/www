---
title: "Google Summer of Code 2021"
date: 2021-09-02
weight: 10
tags:
  - gsoc
authors:
  - toshiaki-tanaka
---

{{< image src="gsoc.png" >}}

Hello, my name is Toshiaki Tanaka. I'm a Japanese university student majoring in medicine. Even though I don't major in
computer science, I occasionally play CTFs. For this I've used mitmproxy quite a bit, and so I applied to be a Google
Summer of Code (GSoC) 2021 student for the project... and got accepted!
In this post I would like to share my GSoC experience with future applicants.

<!--more-->

## Applying for GSoC

At first, I worked on an issue that was tagged
with ["help wanted"](https://github.com/mitmproxy/mitmproxy/labels/help%20wanted)
to gain a deeper understanding of the code base and to be recognized by people in the mitmproxy organization. Then I
thought about what kind of features would be nice to have in mitmproxy. But I noticed later that I didn't need to think
about what to implement in GSoC because the organizations prepare
an [ideas list](https://github.com/mitmproxy/mitmproxy/issues/4404) for the participants. Still, it was a good
experience to design and implement a new feature.

## My GSoC Proposal

My project was to add more features to mitmweb (mitmproxy's web UI) and make it easier to use. You can find my proposal
[here](https://docs.google.com/document/d/1CqnkSsZUX9ZIzV3-YLwZ2YFDbYU50fYGuY57ohBmkPQ/). It's not perfect, but it might
help you preparing yours. When you finish writing your proposal, you should show it to the mentors as soon as possible.
You will receive feedback from them and you can polish your proposal, which will raise the possibility of being
accepted.

## Meeting My Mentor

After I sent my draft proposal, I had a meeting with my mentor Maximilian Hils. It was really casual meeting. Also, he
was very considerate of me being a non-native English speaker. I was really relaxed during the meeting. In the meeting,
he asked me about some details in my proposal which he did not understand. I explained what I meant and clarified the
proposal. Also, he proposed that we should integrate mitmproxy's command feature into mitmweb. While I first planned to
work on a different idea, I realized that this looked more interesting and chose to do it.

## Writing Code!

[Here](https://gist.github.com/gorogoroumaru/32aec49d469d10be870953526e14d6ab#file-gsoc2021report-md) is an overview of
my GSoC achievements. I developed easier ways to forward intercepted HTTP messages and to create interception rules.
Also, I made a terminal where we can use mitmproxy commands. In addition, I transformed mitmweb from JavaScript into
TypeScript and upgraded mitmweb's React version to be able to use React hooks.

## GSoC Evalutions

The evaluations during GSoC were done very casually. I didn't need to prepare for it at all. All you have to do is just
to enjoy GSoC, if you work actively on your project there is nothing you need to worry about.

## Should You Apply?

Even if you are not sure that you are good enough for GSoC, apply to GSoC anyway. The mentors will help you to complete
your project. I'm a Japanese student and not proud of my English skills, but the mentor was very considerate of it. I
could finish the project without falling behind. The schedule is flexible, so it's not a problem if GSoC conflicts with
school events in some extent. You only need to let your mentor know about all conflicts in your proposal.

## Acknowledgments

Thanks to Maximilian Hils for being such a good mentor! I could not finish my project without his help. Finally, thanks
to all the developers who have contributed to mitmproxy so far, and to Google for organizing GSoC.

---
title: "Google Summer of Code 2021"
date: 2021-09-02
weight: 10
tags: [
    "gsoc",
]
author:
  name: Toshiaki Tanaka
  twitter: gorogoroumaru
---

{{< image src="gsoc.png" >}}

## Introduction
Hello, my name is Toshiaki Tanaka. I'm Japanese university student who major in medicine. I got approved of the GSoC 2021 event for mitmproxy organization. I applied to mitmproxy organization because I had played CTF and used mitmproxy. Also, when I sent a pull request to mitmproxy, the reviewers were so nice.

## Before Application
At first, I worked on a "good first issue" to gain a deeper understanding of the code base and to be recognized by people in the mitmproxy organization. Then I thought about what kind of functions would be nice to have in mitmproxy. But I noticed later that I didn't need to think about what to implement in GSoC because the organizations prepare it for the participants. If you are interested in the project ideas, please take a look at this. (https://github.com/mitmproxy/mitmproxy/issues/4404)  Still, it was a good experience to design and implement a function.

## Proposal
My project was to make mitmweb (mitmproxy web UI) rich and easy to use. This is the [link](https://docs.google.com/document/d/1CqnkSsZUX9ZIzV3-YLwZ2YFDbYU50fYGuY57ohBmkPQ/edit?usp=sharing) for my proposal. It's not perfect, but it might help. When you finish writing your proposal, you should show it to the mentors as soon as possible. You can receive feedbacks from the mentors and polish your proposal, which will raise the possibility of being accepted.

## Meeting
After I sent my draft proposal, I had a meeting with my mentor Maximilian Hils. It was really casual meeting. Also, he was very considerate of non-English speaker. I'm really relaxed during the meeting. In the meeting, he asked me where he could not understand my proposal. I explained my opinion and fixed the proposal. Also, he proposed me a project which is to integrate mitmproxy command feature into mitmweb. At first, I planed to do a different project, but I realized that this looks more interesting and chose to do it.

## Coding
This is the [link](https://gist.github.com/gorogoroumaru/32aec49d469d10be870953526e14d6ab#file-gsoc2021report-md) for my GSoC achievements. I made utility functions for forwarding intercepted HTTP communication and making interception rules easily. Also, I made a terminal where we can use mitmproxy commands. In addition, I transformed mitmweb from javascript into typescript and upgraded version of react in mitmweb to be able to use react hooks.

## Evaluation
The evaluation was done very casually. I didn't prepare for it at all. All you have to do is just enjoy the GSoC event.

## Advice for later participants
Even if you are not sure that you will be able to complete the GSoC, apply to GSoC anyway. The mentors will help you to complete your project. I'm a Japanese student and not proud of my English skill, but the mentor is very considerate of it. I could finish the project without falling behind. The schedule is flexible, so it's not a problem if GSoC conflicts with school events in some extent. 

## Acknowledgements
Thanks to Maximilian Hils for being such a good mentor! I could not finish my project without his help. Finally, thanks to all the developers who have contributed to mitmproxy so far, and to Google for organizing the GSoC event.
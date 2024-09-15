---
title: "Mitmproxy 10.5: DNS, HTTP3, and Beyond"
date: 2024-09-12
weight: 10
tags:
  - gsoc
  - releases
authors:
  - gaurav-jain
---

We are excited to announce the release of mitmproxy 10.5, which introduces support for HTTP3 in both transparent
and reverse proxy modes. On the DNS side, we've introduced various improvements over the past few releases
that we'll cover in this blogpost.

<!--more-->

##### *Editorial Note:*

*Hi! I'm [Gaurav Jain], one of the students selected for this year's Google Summer of Code program to work on mitmproxy.
During this summer, I've worked on improving various low-level networking parts of mitmproxy some of which include
HTTP/3 and DNS. You can find my project report [here]*

[Gaurav Jain]:  {{< relref "/authors/gaurav-jain" >}}
[here]: https://gist.github.com/errorxyz/af6f26549e9122f3ff3b93fd9d257df1

## HTTP/3

Thanks to the awesome work of [Manuel Meitinger] and [Maximilian Hils] in setting up the [initial codebase] for
HTTP/3 and QUIC, this release addresses various bugs that were affecting HTTP/3 and QUIC modes to deliver a fully
functional product. We can now start an HTTP/3 reverse proxy using:

[Manuel Meitinger]: https://github.com/meitinger
[Maximilian Hils]:  {{< relref "/authors/maximilian-hils" >}}
[initial codebase]: https://mitmproxy.org/posts/releases/mitmproxy-10.1/

```shell
# Starts HTTP/1, HTTP/2, HTTP/3 proxy simultaneously
$ mitmproxy --mode reverse:https://http3.is

# Starts HTTP/3-only reverse proxy
$ mitmproxy --mode reverse:http3://http3.is
```

Note that we can run the reverse proxy on any port irrespective of the port advertised by the [alt-svc] header.
We also support proxying HTTP3 flows via local-redirect mode.

[alt-svc]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Alt-Svc

```shell
$ mitmproxy --mode local --set experimental_transparent_http3=true
```

Any cURL, Chromium or Firefox based HTTP/3 client ([setup]) can be used to access these features. There are still some
bugs that are yet to be fixed which you can find in our [bug-tracker].

[setup]: (https://github.com/mitmproxy/mitmproxy/issues/7025#issuecomment-2351138170)
[bug-tracker]: (https://github.com/mitmproxy/mitmproxy/issues)

## DNS

### DNS server

We're happy to share that DNS mode now supports proxying[^1] all query types. These queries are by default forwarded to
the systems' DNS servers. We can specify custom DNS servers as well using the `dns_name_servers` option:

```shell
$ mitmdump --mode dns --set dns_name_servers=1.1.1.1 --set dns_name_servers=8.8.8.8
```

![dns](dns.png)

With this release, mitmproxy also provides the option to specify custom answers for A/AAAA lookups. This can be done
by specifying the lookups in the hosts file of your respective operating system and setting the `dns_use_hosts_file`
option to `true`.

```shell
$ echo "1.2.3.4 mitmproxy.org" >> /etc/hosts
$ mitmdump --mode dns --set dns_use_hosts_file=true

# dig does not check the hosts file of the system that it running on
$ dig mitmproxy.org +short @127.0.0.1
1.2.3.4
```

### DNS-over-TCP

DNS-over-UDP inherently has a message size limit of 512 bytes. Also, because UDP is a stateless protocol, it cannot
handle message fragmentation and reassembly. This prevents us from being able to transmit larger DNS messages. On the
other hand, since TCP is a stateful protocol, we can send a single DNS message fragmented over multiple TCP messages,
thus allowing for larger DNS messages to be transmitted. Additionally, DNS-over-TCP supports query pipelining, enabling
multiple queries to be sent over a single TCP connection, which helps reduce latency.

```shell
$ mitmproxy --mode dns
$ dig mitmproxy.org TXT +tcp @127.0.0.1
; <<>> DiG 9.19.21-1-Debian <<>> mitmproxy.org @127.0.0.1 TXT +tcp
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 46898
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1
<snipped>
;; Query time: 72 msec
;; SERVER: 127.0.0.1#53(127.0.0.1) (TCP)
;; WHEN: Mon Sep 16 01:42:12 IST 2024
;; MSG SIZE  rcvd: 2728
```

### Stripping ECH keys

Read [this] article to understand how mitmproxy works and sniffs SNI.

[this]: https://docs.mitmproxy.org/stable/concepts-howmitmproxyworks/

Enter Encrypted Client Hellos (ECH): ECH makes it difficult for mitmproxy to sniff the SNI by encrypting them. However,
we bypass this problem by preventing ECHs altogether. This is done by stripping the ECH keys required for encryption
from DNS HTTPS type records (if they're found). Without these keys, clients cannot encrypt their client hellos, forcing
them to transmit the SNI plaintext, allowing us to perform our man-in-the-middle attack.

Read more about ECH [here](https://blog.cloudflare.com/encrypted-client-hello/)

## Acknowledgement

This work has been sponsored by the [Google Summer of Code] program and would not have been as successful without the
invaluable guidance and support from my mentor [Maximilian Hils].

[Google Summer of Code]: https://summerofcode.withgoogle.com/
[Maximilian Hils]:  {{< relref "/authors/maximilian-hils" >}}

[^1]: By proxying, we mean that mitmproxy allows all query types to "pass" through. However, only certain records such
as NS, TXT, A, AAAA, and (partially) HTTPS are actually parsed by mitmproxy.

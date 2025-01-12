---
title: "Intercepting Linux Applications"
date: 2025-01-12
weight: 10
tags:
  - releases
  - local-capture
authors:
  - maximilian-hils
  - emanuele-micheletti
  - gaurav-jain
  - fabio-valentini
---

Following Windows and macOS, mitmproxy's local capture mode is now available on Linux as well!
mitmproxy 11.1 can seamlessly intercept local applications on all three major platforms.

<!--more-->

## Windows, macOS, ...and now Linux!

After debuting local capture mode for [macOS]
and [Windows] about a year ago, we're happy to report that our eBPF-based Linux implementation 
is now ready for testing. On all three platforms, users can now intercept specific applications without 
setting system-wide proxy settings.

[macOS]: {{< relref "./macos" >}}
[Windows]: {{< relref "./windows" >}}

You can try it out as follows:

```shell
# Capture all local traffic
mitmproxy --mode local
# Capture cURL only
mitmproxy --mode local:curl
```

## How it works

mitmproxy's traditional proxying modes (HTTP/SOCKS/reverse proxy) are platform-independent, but
local capture mode requires a unique approach for every operating system.
macOS tormented us with hard-to-debug code-signing requirements for system extensions,
but it provided us with relatively nice [APIs for traffic redirection] in return.
Windows did not bring such comforts, but it had [external libraries] to make up for it.
Finally, Linux offered us a plethora of solutions that *almost* met our requirements, but
most of them turned out to have one or two crucial gaps.

#### Road to eBPF

We initially looked at iptables/nftables to redirect traffic. While both tools work great to capture connections
for a particular IP address or pid, they fall short of redirecting traffic for a particular
process name. However, we wanted to capture by process name to have the same capture mechanism across platforms. 
Network namespaces would have been equally wonderful to use, but we found them very hard to package into a 
good user experience.
To cut a long story short, we eventually decided to write an [eBPF] program to redirect traffic.

eBPF is a technology that allows us to run a program within the Linux kernel at a low level, 
but --- in contrast to a kernel extension --- does not require us to modify the kernel.
This is promising in theory, but development proved to be harder than expected. Official documentation for eBPF is sparse
and the kernel's eBPF verifier, which ensures that our program is safe to run, likes to complain in 
mysterious ways. With [kernel/bpf/verifier.c] clocking in at 22.801 lines of C code at the time of writing, making sense
of errors sometimes isn't easy. Fortunately, tools like [Aya] make eBPF development significantly easier and 
Isovalent's [docs.ebpf.io] fills a lot of the documentation gaps.

#### Redirection

{{<
figure src="architecture.png"
caption="mitmproxy_rs architecture"
width="90%"
>}}

To implement the actual redirection, mitmproxy does the following:

1. mitmproxy_rs spawns the redirector as a privileged subprocess with `sudo`.
   This is necessary so that the redirector can invoke the `bpf()` syscall.
2. The redirector...
    1. Creates a new virtual network device (typically `/dev/tun0`).
    2. Loads our [BPF_PROG_TYPE_CGROUP_SOCK] BPF [program].
    3. Connects back to mitmproxy_rs to learn which programs to intercept.
    4. Passes this information to the BPF program via a shared map.
3. Every time a new socket is created, the BPF program determines whether it should be intercepted.
   If that's the case, it re-routes the socket to mitmproxy by assigning it to our virtual network device.
4. The redirector now reads all packets from `/dev/tun0` and forwards them to mitmproxy_rs (and vice versa).
5. mitmproxy_rs reassembles raw packets into TCP/UDP streams using our existing user-space network stack and then 
   passes them on to mitmproxy.

This method is considerably more complex than a simple iptables rule, but we gain fine-grained control
over what to intercept.

[APIs for traffic redirection]: {{< relref "./macos#how-does-it-work" >}}
[external libraries]: {{< relref "./windows#how-it-works" >}}
[eBPF]: https://docs.ebpf.io/
[WireGuard® mode]: {{< relref "wireguard-mode" >}}
[WinDivert]: https://github.com/Rubensei/windivert-rust
[kernel/bpf/verifier.c]: https://github.com/torvalds/linux/blame/master/kernel/bpf/verifier.c
[Aya]: https://aya-rs.dev/
[docs.ebpf.io]: https://docs.ebpf.io/
[BPF_PROG_TYPE_CGROUP_SOCK]: https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_SOCK/
[program]: https://github.com/mitmproxy/mitmproxy_rs/blob/8f9372fc5bde5eb1910fc7e773a60132a17319b5/mitmproxy-linux-ebpf/src/main.rs#L17-L27

#### Limitations

Local capture mode on Linux comes with a few limitations:

- **Egress only:** mitmproxy will capture outbound connections only.
  For inbound connections, we recommend reverse proxy mode.
- **Root privileges:** To load the BPF program, mitmproxy needs to spawn a privileged subprocess using `sudo`.
  For the web UI, this means that mitmweb needs to be started directly with `--mode local` on the command line
  to get a sudo password prompt.
- **Kernel compatibility:** Our eBPF instrumentation requires a reasonably recent kernel.
  We officially support Linux 6.8 and above, which matches Ubuntu 22.04.
- **Intercept specs:** Program names are matched on the first 16 characters only (based on the kernel's [TASK_COMM_LEN]).
- **Containers:** Capturing traffic from containers will fail unless they use the host network.
  For example, containers can be started with `docker/podman run --network host`.
- **Windows Subsystem for Linux (WSL 1/2):** WSL is unsupported as eBPF is disabled by default.


[TASK_COMM_LEN]: https://github.com/torvalds/linux/blob/fbfd64d25c7af3b8695201ebc85efe90be28c5a3/include/linux/sched.h#L306

## Next Steps

Local redirect mode is now available for Windows, Linux, and macOS users in mitmproxy 11.1.
We have more plans to improve the user experience,
but we already want to make the current state available for everyone to try. 
If you are curious about contributing, please join us on [GitHub]!

[GitHub]: https://github.com/mitmproxy/mitmproxy/issues/6531

## Acknowledgments

This work was supported by the [NGI0 Entrust fund] established by [NLnet].

[NGI0 Entrust fund]: https://nlnet.nl/entrust/
[NLnet]: https://nlnet.nl/
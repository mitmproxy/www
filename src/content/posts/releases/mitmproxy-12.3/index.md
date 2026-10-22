---
title: "Mitmproxy 12.3: eMudhra Edition"
date: 2026-10-22
weight: 10
tags:
  - releases
authors:
  - maximilian-hils
---

We're excited to announce the release of mitmproxy 12.3, *eMudhra Edition*!
This release ships both a new `--emudhra` switch to intercept clients trusting the compromised eMudhra CA,
and a security update that distrusts said CA for outgoing connections.

<!--more-->

# eMudhra CA Compromise

Earlier this week, the private keys of eight eMudhra intermediate CA certificates [were publicly disclosed].
For an intercepting TLS proxy like mitmproxy, this cuts both ways:

1. **Client interception (`--emudhra`):** Normally, inspecting HTTPS traffic with mitmproxy requires installing mitmproxy's local CA certificate into the target client or device's trust store. With `mitmproxy --emudhra`, mitmproxy instead signs generated leaf certificates with one of the compromised keys. Any client or device that hasn't updated its trust store yet will accept those certificates out of the box.
2. **Upstream verification (Defense):** Mitmproxy 12.3 updates [`certifi`] (our trust store) so that mitmproxy itself no longer trusts the affected eMudhra roots.

Outside of browsers, most TLS implementations do not perform revocation checks by default and do not require Certificate Transparency. Both would have greatly mitigated the impact of this event.

#### Intercepting old clients: `--emudhra-old`

The compromised intermediate CA is signed by two different root CAs:

- **`emSign ECC Root CA - G3`** (created in 2018), present in all modern trust stores.
- **Sectigo's `AAA Certificate Services`** (created in 2004), present in older or frozen pre-2021 trust stores.

Mitmproxy sends both certificate chains in the TLS handshake. However, OpenSSL-based clients are unable to process this and only consider the first.
If you're testing older clients that only trust `AAA Certificate Services`, pass `--emudhra-old` to put the Sectigo cross-sign first.

[were publicly disclosed]: https://emudhra.we-have-a-problem.com/
[chosen by fair dice roll]: https://xkcd.com/221/
[`certifi`]: https://github.com/certifi/python-certifi

# Beyond eMudhra: Mitmweb Improvements

Thanks to [@sleeyax](https://github.com/sleeyax) and [@lups2000](https://github.com/lups2000), mitmweb received a major visual and usability polish in 12.3:

- **Dark Mode:** Mitmweb now has a dark theme, configurable via the `web_theme` option (`system`, `dark`, or `light`, [#8317](https://github.com/mitmproxy/mitmproxy/pull/8317)).
- **Resizable & Configurable Columns:** Drag column header edges to resize flow-table columns, double-click to fit contents, and toggle visible columns from the Appearance menu ([#8358](https://github.com/mitmproxy/mitmproxy/pull/8358)).
- **Refined Flow Table:** Colored status-code and HTTP method badges ([#8335](https://github.com/mitmproxy/mitmproxy/pull/8335)), theme-aware SVG resource icons ([#8337](https://github.com/mitmproxy/mitmproxy/pull/8337)), and live panel splitter resizing ([#8492](https://github.com/mitmproxy/mitmproxy/pull/8492)).

# Other Changes in mitmproxy 12.3

- Fix the WBXML contentview raising a `KeyError` on tags that are missing from the code page,
  instead of showing them as `UNKNOWN_TAG_XX`.
  ([#8495](https://github.com/mitmproxy/mitmproxy/pull/8495), @kayaal34)
- Fix `Set-Cookie` attribute parsing: prevent subsequent attributes (such as `Secure` or `HttpOnly`) from being swallowed into `Expires` when `Expires` contains non-date or short values (e.g. `Expires=0`), and correctly parse RFC 850 dates with full weekday names.
  ([#8489](https://github.com/mitmproxy/mitmproxy/pull/8489), @7-Bala)
- Fix typos in the `save_stream_file` option help, docstrings and examples.
  ([#8494](https://github.com/mitmproxy/mitmproxy/pull/8494), @qodelicious)
- Fix the global `listen_port` option being applied to proxy modes that don't
  bind a port (e.g. `local`), which caused a "Cannot spawn multiple servers on
  the same address" error when enabling local capture.
  ([#8471](https://github.com/mitmproxy/mitmproxy/pull/8471), @WarpFoxHub)
- Raise the upper bound of the `typing-extensions` dependency from 4.14 to 4.16.0 on Python 3.12, so that mitmproxy
  can be installed next to packages that require a newer release (for example pydantic 2.12 and later).
  ([#8472](https://github.com/mitmproxy/mitmproxy/pull/8472), @jpcaruana)
- Accept colons in Basic authentication passwords.
  ([#8469](https://github.com/mitmproxy/mitmproxy/pull/8469), @gigioneggiando)
- Clarify that inbound header validation covers requests and responses.
  ([#8470](https://github.com/mitmproxy/mitmproxy/pull/8470), @gigioneggiando)
- mitmweb: Support `float` addon options in the Options editor.
  ([#3144](https://github.com/mitmproxy/mitmproxy/issues/3144))
- Add `launch_edge()` to the Browser addon, so `browser.start edge` can
  launch an isolated, proxy-configured instance of Microsoft Edge, matching
  the existing Chrome and Firefox support.
  ([#8407](https://github.com/mitmproxy/mitmproxy/issues/8407), @eliahu-frusin)
- Replace deprecated pyparsing APIs with their snake_case equivalents to avoid
  `PyparsingDeprecationWarning` during command and flow-filter parsing.
  ([#8344](https://github.com/mitmproxy/mitmproxy/pull/8344), @Dnsayhey)
- mitmweb: Replace the flow table's raster resource type icons with SVG icons so they follow the active theme.
  ([#8337](https://github.com/mitmproxy/mitmproxy/pull/8337), @sleeyax)
- Bracket IPv6 target literals in the `CONNECT` request and `Host` header sent
  to an upstream proxy (`--mode upstream`), producing a valid `[2001:db8::1]:443`
  authority per RFC 3986 instead of the malformed `2001:db8::1:443`.
  ([#8326](https://github.com/mitmproxy/mitmproxy/pull/8326), @gaurav0107)
- mitmweb: Fix an infinite update cycle in the event log by only recomputing the virtual-scroll window in `componentDidUpdate` when the event list or `rowHeight` actually change.
  ([#8312](https://github.com/mitmproxy/mitmproxy/pull/8312), @hexbinoct)
- Remove the unused `msgpack` dependency. The msgpack contentview is
  implemented in Rust and shipped with `mitmproxy_rs` since mitmproxy 12.
  ([#8319](https://github.com/mitmproxy/mitmproxy/pull/8319), @lukehsiao)
- Update Linux binary builder to Debian 12, bumping the minimum glibc version to 2.36.
  ([#8458](https://github.com/mitmproxy/mitmproxy/pull/8458), @mhils)
- Fix a crash on OpenSSL builds that reject a TLS protocol version at
  context-setup time (e.g. SSLv3): `is_supported_version` now treats such a
  version as unsupported instead of raising an unhandled `SSL.Error`.
  ([#8294](https://github.com/mitmproxy/mitmproxy/pull/8294), @gaurav0107)
- mitmweb: Fix the flow table header of the sorted column keeping a light background and hiding its sort chevron under the dark theme.
  ([#8336](https://github.com/mitmproxy/mitmproxy/pull/8336), @sleeyax)
- mitmweb: Add a dark theme, selectable via the new `web_theme` option (`system`, `dark`, or `light`).
  `system` follows the operating system's color-scheme preference.
  ([#8317](https://github.com/mitmproxy/mitmproxy/pull/8317), @sleeyax)
- mitmweb: Make flow-table columns resizable by dragging their header edges, or fit a column to its contents by double-clicking one.
  Widths persist across reloads.
  The Appearance section of the Options menu picks which columns the flow table shows and restores their default widths.
  ([#8358](https://github.com/mitmproxy/mitmproxy/pull/8358), @sleeyax)
- mitmweb: Show colored status-code badges and method badges in the flow table, and add hover
  tooltips to the TLS, replay, intercept, and error indicators.
  ([#8335](https://github.com/mitmproxy/mitmproxy/pull/8335), @sleeyax)
- mitmweb: Honor the `view_order_reversed` option for live flows. New flows are
  now placed at the top of the table when the option is set, instead of always
  being appended at the bottom.
  ([#8288](https://github.com/mitmproxy/mitmproxy/pull/8288), @hexbinoct)
- Fix contentview detection for XML files that start with CRLF.
  ([#8243](https://github.com/mitmproxy/mitmproxy/pull/8243), @ADiTyaRaj8969)
- mitmweb: Fix the filter input losing half-typed text on unrelated parent re-renders.
  ([#8234](https://github.com/mitmproxy/mitmproxy/pull/8234), @ariel42)
- mitmweb: Fix an infinite update cycle in `FlowTable` by only recomputing the virtual-scroll window in `componentDidUpdate` when `flowView` or `rowHeight` actually change.
  ([#8233](https://github.com/mitmproxy/mitmproxy/pull/8233), @ariel42)
- mitmweb: Fix AVIF images and `image/vnd.microsoft.icon` favicons not rendering in the response tab.
  ([#8232](https://github.com/mitmproxy/mitmproxy/pull/8232), @ariel42)
- mitmweb: Fix correctly displaying multiple blank lines in content renderer.
  ([#8248](https://github.com/mitmproxy/mitmproxy/pull/8248), @vincentdehaan)
- Fix QUIC connections never starting if --allow-hosts or --ignore-hosts is set.
  ([#8295](https://github.com/mitmproxy/mitmproxy/pull/8295), @tbodt)
- Correctly read the SNI hostname from fragmented QUIC client hellos.
  ([#8296](https://github.com/mitmproxy/mitmproxy/pull/8296), @tbodt)
- mitmweb: Fix for modified reason phrase not being sent
  ([#8333](https://github.com/mitmproxy/mitmproxy/pull/8333), @grusski)
- Use stdlib (PEP-784) for Zstandard compression on Python 3.14+
  ([#8397](https://github.com/mitmproxy/mitmproxy/pull/8397), @Rogdham)
- mitmweb: Fix the flow details splitter and make dragging resize the panels live.
  ([#8492](https://github.com/mitmproxy/mitmproxy/pull/8492), @lups2000)

#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

aws --profile mitmproxy \
    s3 cp ./assets/index.html s3://snapshots.mitmproxy.org/
aws --profile mitmproxy \
    s3 cp ./assets/list.js s3://snapshots.mitmproxy.org/
aws --profile mitmproxy \
    s3 cp ./assets/index.html s3://snapshots.mitmproxy.org/error.html
aws --profile mitmproxy \
    cloudfront create-invalidation --distribution-id E2JOW7X9ZEK7GJ --paths "/*"

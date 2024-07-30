#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

aws configure set preview.cloudfront true
aws --profile mitmproxy \
    s3 sync --acl public-read ./src/public s3://www.mitmproxy.org/
aws --profile mitmproxy \
    cloudfront create-invalidation --distribution-id E18EVZZRMM1SSD --paths "/*"

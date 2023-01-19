#!/usr/bin/bash

set -e
set -x

export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=

while true; do
        curl https://api.github.com/repos/mitmproxy/mitmproxy -o /data/github-stats.json

        npx playwright screenshot \
                --wait-for-timeout 30000 \
                --full-page \
                --device="Desktop Chrome HiDPI" \
                --viewport-size "430,500" \
                https://uploads.hi.ls/2022-07/render.html \
                /data/twitter-timeline.png
        pngquant /data/twitter-timeline.png -o /data/twitter-timeline.png -f

        aws s3 sync /data s3://www-test.mitmproxy.org/data
        aws cloudfront create-invalidation --distribution-id E3UCZ4MLN4TO7U --paths "/data/*"

        aws s3 sync /data s3://www.mitmproxy.org/data
        aws cloudfront create-invalidation --distribution-id E18EVZZRMM1SSD --paths "/data/*"

        echo "Done. Sleeping for one hour."
        sleep 1h
done
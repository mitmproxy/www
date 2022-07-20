#!/usr/bin/bash

set -e

s3Key=
s3Secret=
bucket=www.mitmproxy.org
subdir=data/

s3Upload () {
	file=$1
	contentType=$2
	resource="/${bucket}/${subdir}${file}"
	dateValue=`date -R`
	stringToSign="PUT\n\n${contentType}\n${dateValue}\n${resource}"
	signature=`echo -en ${stringToSign} | openssl sha1 -hmac ${s3Secret} -binary | base64`
	curl -X PUT -T "${file}" \
	  -H "Host: ${bucket}.s3.amazonaws.com" \
	  -H "Date: ${dateValue}" \
	  -H "Content-Type: ${contentType}" \
	  -H "Authorization: AWS ${s3Key}:${signature}" \
	  https://s3.amazonaws.com/${subdir}${file}

	# same, but for www-test
	resource="/www-test.mitmproxy.org/${subdir}${file}"
	stringToSign="PUT\n\n${contentType}\n${dateValue}\n${resource}"
	signature=`echo -en ${stringToSign} | openssl sha1 -hmac ${s3Secret} -binary | base64`
        curl -X PUT -T "${file}" \
          -H "Host: www-test.mitmproxy.org.s3.amazonaws.com" \
          -H "Date: ${dateValue}" \
          -H "Content-Type: ${contentType}" \
          -H "Authorization: AWS ${s3Key}:${signature}" \
          https://s3-us-west-2.amazonaws.com/${subdir}${file}
	echo "${file}: S3 upload complete."
}


while true; do
	curl https://api.github.com/repos/mitmproxy/mitmproxy -o github-stats.json
	s3Upload github-stats.json application/json
	npx playwright screenshot \
		--wait-for-timeout 30000 \
		--full-page \
		--viewport-size "430,500" \
		https://uploads.hi.ls/2022-07/render.html \
		twitter-timeline.png
	pngquant twitter-timeline.png -o twitter-timeline.png -f
	s3Upload twitter-timeline.png image/png
	echo "Done. Sleeping for six hours."
	sleep 6h
done
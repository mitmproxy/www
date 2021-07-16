#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

cd src

# check for valid JSON
cat data/publications.json | jq empty

# check for existing publication types
allowed_types=$(cat <<-MOT
blog post
media
research
talk
MOT
)
types=$(cat data/publications.json | jq -r '.[].type' | sort | uniq)

if [[ ${types} != ${allowed_types} ]]; then
  echo "Found invalid publication type!"
  exit 1
fi

cat data/publications.json | jq -e '.[] | select(.type =="research") | select(.conference == null)'
if [ $? -eq 0 ]; then
  echo "Research artifact without conference!"
  exit 1
fi

hugo

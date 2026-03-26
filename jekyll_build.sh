#!/usr/bin/env bash
# Local build: Ruby 4 + github-pages needs Liquid taint compat + UTF-8 for Sass.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"
export RUBYOPT="-r${ROOT}/lib/ruby40_liquid_compat.rb${RUBYOPT:+ ${RUBYOPT}}"
exec bundle exec jekyll build "$@"

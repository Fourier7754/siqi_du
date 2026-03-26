# frozen_string_literal: true

# Ruby 3.2+ removed taint tracking; Liquid 4.0.x still calls `obj.tainted?` in Variable#taint_check.
# The `github-pages` gem forces Jekyll `safe: true`, so files in `_plugins/` are NOT loaded locally.
# Load this file before Jekyll via RUBYOPT, e.g.:
#   RUBYOPT="-r${PWD}/lib/ruby40_liquid_compat.rb" bundle exec jekyll build
#
require "liquid"

module LiquidVariableTaintCompat
  # Liquid 4.0.x calls `taint_check(context, obj)` then `obj.tainted?` inside the original impl.
  def taint_check(_context, _obj)
    # Intentionally empty: taint semantics removed from Ruby 3.2+.
  end
end

Liquid::Variable.prepend(LiquidVariableTaintCompat)

#!/usr/bin/env bash
# Host-aware production build.
# - Netlify sets NETLIFY=true → standard Next.js build (.next)
# - Everywhere else → Vinext/Sites artifact (dist/)
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "${script_dir}/.." && pwd)"
cd "${project_root}"

if [[ "${NETLIFY:-}" == "true" ]] || [[ "${BUILD_TARGET:-}" == "netlify" ]]; then
  echo "[build] Netlify target — running next build"
  exec npx --no-install next build
fi

echo "[build] Sites/Vinext target — running verified vinext build"
exec bash "${script_dir}/build-verified.sh"

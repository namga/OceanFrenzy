#!/usr/bin/env bash
set -euo pipefail
GRADLE_FILE="android/app/build.gradle"
if [[ ! -f "$GRADLE_FILE" ]]; then
  echo "Missing $GRADLE_FILE. Run npx cap add android first." >&2
  exit 1
fi
python3 - "$GRADLE_FILE" <<'PYCODE'
from pathlib import Path
import re, sys
p=Path(sys.argv[1]); s=p.read_text()
s, n1 = re.subn(r'versionCode\s+\d+', 'versionCode 100', s, count=1)
s, n2 = re.subn(r'versionName\s+["\'][^"\']+["\']', 'versionName "1.0.0"', s, count=1)
if not n1 or not n2:
    raise SystemExit('Could not safely locate versionCode/versionName in app/build.gradle')
p.write_text(s)
PYCODE

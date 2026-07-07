# READ-ONLY script (writes only $env:TEMP\mv_stage1_endpoint.py, throwaway).
# PREREQ: MV server RUNNING (launch_mediavault.bat). PowerShell 7.
# Verifies the live /api/tags vocab endpoint reflects Stage 1: exhibit not
# retired, event/lineup/attributes namespaces present.

$py = Join-Path $env:TEMP 'mv_stage1_endpoint.py'
$code = @'
import json, urllib.request
raw = urllib.request.urlopen('http://127.0.0.1:51822/api/tags', timeout=15).read()
data = json.loads(raw)
rows = data if isinstance(data, list) else data.get('tags', data.get('rows', []))
seen = {}
for r in rows:
    slug = r.get('slug', '')
    ns = slug.split(':', 1)[0] if ':' in slug else r.get('namespace', '')
    if ns and ns not in seen:
        seen[ns] = {k: r.get(k) for k in r.keys() if 'retir' in k.lower() or k in ('tier', 'namespace')}
print('namespaces seen at endpoint:', sorted(seen.keys()))
for ns in ('exhibit', 'event', 'lineup', 'attributes', 'presentation'):
    print('  %s: %s' % (ns, seen.get(ns, 'ABSENT')))
print('STAGE1_ENDPOINT_CHECK_DONE')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
Write-Host 'STAGE1B_SCRIPT_DONE'

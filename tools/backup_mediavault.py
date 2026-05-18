import shutil, hashlib, datetime, os, sys

DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

if not os.path.exists(DB):
    print(f"ABORT: DB not found at {DB}")
    sys.exit(1)

ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
backup_dir = r"C:\AI\Platform\MediaVault\core\backups"
os.makedirs(backup_dir, exist_ok=True)
dest = os.path.join(backup_dir, f"mediavault.pre-criterion1-{ts}.sqlite")

if os.path.exists(dest):
    print(f"ABORT: backup target already exists: {dest}")
    sys.exit(1)

src_sha = sha256(DB)
shutil.copy2(DB, dest)
dst_sha = sha256(dest)

print(f"Source : {DB}")
print(f"  SHA256: {src_sha}")
print(f"  Size  : {os.path.getsize(DB)} bytes")
print(f"Backup : {dest}")
print(f"  SHA256: {dst_sha}")
print(f"  Size  : {os.path.getsize(dest)} bytes")
print()
if src_sha == dst_sha:
    print("RESULT: Backup verified - SHA256 matches. Safe to proceed.")
else:
    print("RESULT: BACKUP FAILED - SHA256 mismatch. DO NOT PROCEED.")
    sys.exit(1)

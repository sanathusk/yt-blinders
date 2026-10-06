# YT Blinders Release Checklist

Follow this checklist to build, verify, package, and publish a new release of **YT Blinders**.
Releases are manual: bump the version, push a `v*` tag, and GitHub Actions builds the zip.

---

## 1. Bump the Version

Keep these two files in sync (same version in both):

- [ ] [`package.json`](package.json) (`"version"`)
- [ ] [`manifest.json`](manifest.json) (`"version"`)

Commit the bump on `main`, e.g.:

```bash
bun run check
bun run build
bun run verify
git add package.json manifest.json
git commit -m "chore: release X.Y.Z"
git push origin main
```

- [ ] **Sync store copy manually if needed:**
  [`CHROMEWEBSTORE.md`](CHROMEWEBSTORE.md) Version History is **not** auto-updated — edit it in the same commit or a follow-up if the store listing changed.

## 2. Tag and Push

- [ ] Create the tag (must match `v*` so `release.yml` triggers):

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
```

---

## 3. GitHub Actions Workflow Execution

The pushed `v*` tag triggers `release.yml` (`.github/workflows/release.yml`):

- [ ] **Monitor Workflow:**
  Check the **Actions** tab → **Release Build & Package** run for tag `vX.Y.Z`.
  It runs the shared `build-verify` action (`bun install` → `check` → `build` → `verify`), then zips `dist/` to `yt-blinders-vX.Y.Z.zip`.
- [ ] **Verify GitHub Release Draft:**
  Go to **Releases** → `vX.Y.Z` (created as a **draft** by `release.yml` via `softprops/action-gh-release`):
  - Release notes are auto-generated (`generate_release_notes: true`) — edit them if needed.
  - Verify `yt-blinders-vX.Y.Z.zip` was uploaded (`fail_on_unmatched_files: true`).
  - Click **Publish release** when ready.

Local pre-checks (optional, CI already runs them):

```bash
bun run check
bun run build
bun run verify
```

---

## 4. Chrome Web Store Publishing

- [ ] **Download the Zip Asset:**
  Download the attached `yt-blinders-vX.Y.Z.zip` file from the GitHub Release page.
- [ ] **Upload to Chrome Developer Console:**
  1. Go to the [Chrome Web Store Developer Dashboard](https://developer.chrome.com/docs/webstore/publish/).
  2. Select the **YT Blinders** item (or create a new item if this is the initial submission).
  3. Upload the downloaded `yt-blinders-vX.Y.Z.zip` package in the **Package** tab.
- [ ] **Review Store Listings:**
  Verify listing copy against [`CHROMEWEBSTORE.md`](CHROMEWEBSTORE.md) if changes were made to descriptions, screenshots, or privacy policies.
- [ ] **Submit for Review:**
  Click **Submit for review**.

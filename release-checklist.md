# YT Blinders Release Checklist

Follow this checklist to build, verify, package, and publish a new release of **YT Blinders**.
Versioning is automated with [release-please](https://github.com/googleapis/release-please).

---

## 1. Land Changes With Conventional Commits

`release-please` decides the next version from commit messages on `main`.
Use squash-merge so each PR becomes one release note entry:

- `fix:` → patch bump (e.g. `1.0.0` → `1.0.1`)
- `feat:` → minor bump (e.g. `1.0.0` → `1.1.0`)
- `feat!:`, `fix!:` (breaking change) → major bump
- `chore:`, `docs:`, `refactor:` → no release (CI lint still requires this format)

CI (`ci.yml`) lints PR titles. `release-please[bot]` PRs are exempt.

## 2. Merge the Release PR (Automatic Versioning)

Once `feat:`/`fix:` commits land on `main`, the **Release Please** workflow opens
(or updates) a `chore(main): release X.Y.Z` PR. It bumps automatically:

- [ ] [`package.json`](package.json) (under `"version"`, via `node` strategy)
- [ ] [`manifest.json`](manifest.json) (under `"version"`, via `extra-files` in `release-please-config.json`)
- [ ] `CHANGELOG.md` (generated notes)

Review that PR:

- [ ] **Verify version bump + changelog look correct.**
- [ ] **Sync store copy manually if needed:**
  [`CHROMEWEBSTORE.md`](yt-blinders/CHROMEWEBSTORE.md) Version History is **not** auto-updated — edit it in the Release PR or a follow-up before merging if the store listing changed.
- [ ] **Merge the Release PR** (squash or merge commit both work).

Merging automatically:

1. Commits `CHANGELOG.md` + version bumps to `main`.
2. Creates git tag `vX.Y.Z` (config: `include-v-in-tag: true`).
3. Creates a GitHub Release with generated notes.
4. Updates `.release-please-manifest.json` tracking state.

Do **not** create tags manually (`git tag -a v...`) — it bypasses the changelog.

Config: `release-please-config.json`, `.release-please-manifest.json`,
workflow: `.github/workflows/release-please.yml`.

---

## 3. GitHub Actions Workflow Execution

The tag `v*` pushed by `release-please` triggers `release.yml`:

- [ ] **Monitor Workflow:**
  Check the **Actions** tab → **Release Build & Package** run for tag `vX.Y.Z`.
  It runs the shared `build-verify` action (`bun install` → `check` → `build` → `verify`), then zips `dist/` to `yt-blinders-vX.Y.Z.zip`.
- [ ] **Verify GitHub Release Assets:**
  Go to **Releases** → `vX.Y.Z` (already published by `release-please`):
  - Release notes come from `release-please` (not `generate_release_notes`).
  - Verify `yt-blinders-vX.Y.Z.zip` was uploaded by `release.yml` (`softprops/action-gh-release`, `fail_on_unmatched_files: true`).
  - No manual publish step — the release is already public.

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

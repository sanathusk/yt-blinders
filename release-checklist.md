# YT Blinders Release Checklist

Follow this checklist to build, verify, package, and publish a new release of **YT Blinders**.

---

## 1. Pre-Release Checks & Versioning

- [ ] **Sync Version Numbers:**
  Ensure the version matches across all files:
  - [ ] [`package.json`](file:///Users/sanath/git_views_sanath/yt-blinders/package.json) (under `"version"`)
  - [ ] [`manifest.json`](file:///Users/sanath/git_views_sanath/yt-blinders/manifest.json) (under `"version"`)
  - [ ] [`CHROMEWEBSTORE.md`](file:///Users/sanath/git_views_sanath/yt-blinders/CHROMEWEBSTORE.md) (in Version History)
- [ ] **Run Code Quality Tools:**
  Format and lint the codebase:
  ```bash
  npm run check:fix
  ```
- [ ] **Perform Local Verification:**
  Build and verify the build output locally to catch errors early:
  ```bash
  npm run build
  npm run verify
  ```

---

## 2. Creating the Release Tag

To trigger the automated GitHub Actions release workflow, tag and push the code:

- [ ] **Commit all version changes:**
  ```bash
  git add package.json manifest.json CHROMEWEBSTORE.md
  git commit -m "chore: bump version to v1.X.X"
  git push origin main
  ```
- [ ] **Create a git tag:**
  ```bash
  git tag -a v1.X.X -m "Release v1.X.X"
  ```
- [ ] **Push the tag to GitHub:**
  ```bash
  git push origin v1.X.X
  ```

---

## 3. GitHub Actions Workflow Execution

Once the tag is pushed, the GitHub Action starts:

- [ ] **Monitor Workflow:**
  Check the **Actions** tab on your GitHub repository to ensure the workflow completes successfully.
- [ ] **Verify GitHub Release Draft:**
  Once completed, go to your repository's **Releases** page:
  - Check the auto-generated release draft notes.
  - Verify that the artifact `yt-blinders-v1.X.X.zip` is attached as a release asset.
  - Publish the Release.

---

## 4. Chrome Web Store Publishing

- [ ] **Download the Zip Asset:**
  Download the attached `yt-blinders-v1.X.X.zip` file from the newly published GitHub Release page.
- [ ] **Upload to Chrome Developer Console:**
  1. Go to the [Chrome Web Store Developer Dashboard](https://developer.chrome.com/docs/webstore/publish/).
  2. Select the **YT Blinders** item (or create a new item if this is the initial submission).
  3. Upload the downloaded `yt-blinders-v1.X.X.zip` package in the **Package** tab.
- [ ] **Review Store Listings:**
  Verify listing copy against [`CHROMEWEBSTORE.md`](file:///Users/sanath/git_views_sanath/yt-blinders/CHROMEWEBSTORE.md) if changes were made to descriptions, screenshots, or privacy policies.
- [ ] **Submit for Review:**
  Click **Submit for review**.

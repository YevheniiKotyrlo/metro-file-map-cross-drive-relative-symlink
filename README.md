# metro-file-map-cross-drive-relative-symlink

On Windows, `metro-file-map` resolves a relative symlink that sits on another drive than the project to a path under the project's drive (`D:\C:\…`), so a module reached through that symlink cannot be resolved. This repository is a plain Metro 0.87.2 project with:

- `make-store.js`, which lays out two packages, `greeting` and `punctuation`, in a store folder the way Bun's isolated installs and pnpm do: `greeting`'s dependency on `punctuation` is the relative symlink `..\..\punctuation@1.0.0\node_modules\punctuation`. It links the project's `node_modules/greeting` into the store.
- `metro.config.js`, which adds the store's `node_modules` to `watchFolders`.
- `index.js`, which requires `greeting`.
- `use-metro-main.js`, which puts the `metro-file-map` a built react/metro checkout holds in place of the installed one.

## Steps

Windows with two drives (here `C:` and `D:`), Node 22 or later, npm. Creating a relative symlink needs Developer Mode or an elevated shell.

1. Clone onto one drive and install:
   ```sh
   git clone https://github.com/YevheniiKotyrlo/metro-file-map-cross-drive-relative-symlink D:\metro-file-map-cross-drive-relative-symlink
   cd D:\metro-file-map-cross-drive-relative-symlink
   npm install
   ```
2. Make the store in a new folder on the other drive, here `C:\Temp\store`:
   ```sh
   node make-store.js C:\Temp\store
   ```
3. Bundle:
   ```sh
   npm run bundle
   ```

Expected: `bundle.js` is written.

Seen: the build fails with `Unable to resolve module punctuation from C:\Temp\store\node_modules\.store\greeting@1.0.0\node_modules\greeting\index.js: punctuation could not be found within the project or in these directories`.

With the store on the same drive as the project (a fresh clone, `node make-store.js D:\Temp\store`), the same build writes `bundle.js`.

## On react/metro main

Between steps 1 and 2, build a checkout of react/metro and put its `metro-file-map` in place:

```sh
git clone --depth 1 https://github.com/react/metro C:\Temp\metro
cd C:\Temp\metro
yarn install --frozen-lockfile
node scripts/build.js
cd D:\metro-file-map-cross-drive-relative-symlink
node use-metro-main.js C:\Temp\metro
```

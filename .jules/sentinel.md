## 2024-09-06 - Accidental Commit of `pnpm-lock.yaml`
**Vulnerability:** N/A (Process Issue)
**Learning:** While implementing a security enhancement, I ran `pnpm install` which generated a `pnpm-lock.yaml` file. This file was unintentionally included in the commit, causing a code review rejection due to its large size and out-of-scope nature.
**Prevention:** Always check the diff before finalizing changes. Ensure that auto-generated files, especially lockfiles, are not included unless the explicit goal is to update dependencies. For this repository, `pnpm-lock.yaml` should not be committed.
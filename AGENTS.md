<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Portfolio
This repository is part of the Envision Construction portfolio. Inside this repository, this file wins.
Never, in any session:
- Deploy a Cloud Build-triggered service by hand or write out a manual deploy command for one. Ship by
  merging to the default branch, or re-run the trigger.
- Read live database schemas or rows into code graphs, docs, commits, reviews or memory.
- Report a financial figure without a named entity; ask which entity first.
- Add a call or write path on a deprecated system (Procore, Sage Intacct, Brex).
- Commit or print secrets, tokens or personal data.
Ask first, and wait for an explicit yes: a push to main, a force-push, a visibility change.
Before a change that crosses this repository's boundary (deploy path, another repository's API or data, auth,
ownership), read https://github.com/Envision-Construction/central-command/blob/main/ORIENTATION.md and this
repository's row in central-command `repo-manifest.json`; check the live trigger list rather than any prose.

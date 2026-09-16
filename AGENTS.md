<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Zod Rules
- **Follow Zod v4 Strictly**: Ensure you use Zod v4 API patterns. For example, use `z.url()` instead of `z.string().url()`. Check type signatures to confirm compatibility with Zod v4.

# Git Commit Rules
- Use the following conventional commit structure: `feat: msg`, `msc: msg`, `refactor: msg`, `fix: msg`, etc.

# Project Structure Rules
- **Keep the Root Clutter-Free**: Since this project uses a `src` directory, ALL application-related code (such as `utils`, `lib`, `components`, `hooks`, etc.) MUST be placed inside the `src/` directory. Do not create these folders in the root directory.
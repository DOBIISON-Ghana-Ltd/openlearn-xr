<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Zod Rules
- **Follow Zod v4 Strictly**: Ensure you use Zod v4 API patterns. For example, use `z.url()` instead of `z.string().url()`. Check type signatures to confirm compatibility with Zod v4.

# Git Commit Rules
- Use the following conventional commit structure: `feat: msg`, `msc: msg`, `refactor: msg`, `fix: msg`, etc.
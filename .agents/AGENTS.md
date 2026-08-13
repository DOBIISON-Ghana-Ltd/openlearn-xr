# Rules

- **`cn` Utility & ClassName Rule**: Use the `cn()` utility function (imported from `@/lib/utils/cn`) when combining multiple classNames, handling conditional styles, or merging external props. DO NOT wrap static classNames in `cn()` when there are no conditional styles or dynamic values. NEVER use template literals (e.g., `` `${base} ${className}` ``) or string concatenation for component classNames. Always use object syntax for conditional classes (e.g., `cn("base-class", { "active-class": condition })`).


- **Base UI Polymorphism (`render` vs `asChild`)**: This workspace uses `@base-ui/react` primitives. Do not use Radix's `asChild` prop on custom components like `Button`. Instead, use Base UI's `render` prop (e.g., `render={<a href={url} />}`) to customize element tags and prevent runtime layout/prop warnings.

- **Figma Design Implementation & UI Component Rule**: When implementing Figma designs (or using the Figma MCP to build pages/components), DO NOT import or use pre-built components from `src/components/ui/`. You may take inspiration from their layout or logic, but components must be built directly using bare primitives from `@base-ui/react` (where necessary) and styled directly using the project's Figma design tokens.

- **Deprecated Codebase Directories Rule**:
  - All subdirectories inside `src/components/` are **deprecated**, EXCEPT `src/components/(new)/`. Do not import from or base architectural decisions on code in deprecated component folders (e.g., `src/components/sim/`, `src/components/ui/`).
  - The `src/app/app/` directory is **deprecated**. Active routes and pages are located strictly within `src/app/(new)/`.




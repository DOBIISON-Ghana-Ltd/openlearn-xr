# Rules

- **`cn` Utility Usage**: Always use the object syntax for conditional classes (e.g., `cn("base-class", { "active-class": condition })`) instead of boolean short-circuiting (e.g., `cn("base-class", condition && "active-class")`). This improves readability and maintains consistency across the codebase.

- **Base UI Polymorphism (`render` vs `asChild`)**: This workspace uses `@base-ui/react` primitives. Do not use Radix's `asChild` prop on custom components like `Button`. Instead, use Base UI's `render` prop (e.g., `render={<a href={url} />}`) to customize element tags and prevent runtime layout/prop warnings.


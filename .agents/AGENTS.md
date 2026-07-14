# Rules

- **`cn` Utility Usage**: Always use the object syntax for conditional classes (e.g., `cn("base-class", { "active-class": condition })`) instead of boolean short-circuiting (e.g., `cn("base-class", condition && "active-class")`). This improves readability and maintains consistency across the codebase.

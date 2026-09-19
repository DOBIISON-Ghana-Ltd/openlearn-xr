---
name: base-ui
description: >
  Official Base UI (@base-ui/react) guide, patterns, and component documentation map.
  Use whenever building, editing, or styling UI components using @base-ui/react primitives
  (Dialog, Popover, Menu, Select, Tabs, Tooltip, Switch, Checkbox, ScrollArea, Form, Field, etc.),
  handling Base UI portal containers, focus management, or render prop polymorphism.
  Triggers on: "@base-ui/react", "Base UI", "base-ui", "Dialog.Root", "Menu.Root", "Select.Root",
  "Tabs.Root", "Tooltip.Root", "Switch.Root", "base-ui.com/llms.txt", or any Base UI primitive.
compatibility: "React 19, Tailwind CSS v4, @base-ui/react ^1.0.0"
license: MIT
metadata:
  source: https://base-ui.com/llms.txt
  version: 1.0.0
---

# Base UI (`@base-ui/react`)

Base UI is a library of unstyled, accessible, composable UI primitives for React.
The source of truth for Base UI documentation is **`https://base-ui.com/llms.txt`**.

---

## 1. Documentation Index & Component Map

Whenever working with a specific Base UI component, fetch or consult its direct markdown reference at `https://base-ui.com/react/components/<name>.md`:

### Core Components
| Component | Import | Documentation Path |
| :--- | :--- | :--- |
| **Dialog** | `import { Dialog } from '@base-ui/react/dialog'` | `https://base-ui.com/react/components/dialog.md` |
| **Alert Dialog** | `import { AlertDialog } from '@base-ui/react/alert-dialog'` | `https://base-ui.com/react/components/alert-dialog.md` |
| **Menu** | `import { Menu } from '@base-ui/react/menu'` | `https://base-ui.com/react/components/menu.md` |
| **Select** | `import { Select } from '@base-ui/react/select'` | `https://base-ui.com/react/components/select.md` |
| **Tabs** | `import { Tabs } from '@base-ui/react/tabs'` | `https://base-ui.com/react/components/tabs.md` |
| **Popover** | `import { Popover } from '@base-ui/react/popover'` | `https://base-ui.com/react/components/popover.md` |
| **Tooltip** | `import { Tooltip } from '@base-ui/react/tooltip'` | `https://base-ui.com/react/components/tooltip.md` |
| **Scroll Area** | `import { ScrollArea } from '@base-ui/react/scroll-area'` | `https://base-ui.com/react/components/scroll-area.md` |
| **Switch** | `import { Switch } from '@base-ui/react/switch'` | `https://base-ui.com/react/components/switch.md` |
| **Checkbox** | `import { Checkbox } from '@base-ui/react/checkbox'` | `https://base-ui.com/react/components/checkbox.md` |
| **Radio** | `import { Radio } from '@base-ui/react/radio'` | `https://base-ui.com/react/components/radio.md` |
| **Form** | `import { Form } from '@base-ui/react/form'` | `https://base-ui.com/react/components/form.md` |
| **Field** | `import { Field } from '@base-ui/react/field'` | `https://base-ui.com/react/components/field.md` |
| **Input** | `import { Input } from '@base-ui/react/input'` | `https://base-ui.com/react/components/input.md` |
| **OTP Field** | `import { OTPField } from '@base-ui/react/otp-field'` | `https://base-ui.com/react/components/otp-field.md` |
| **Drawer** | `import { Drawer } from '@base-ui/react/drawer'` | `https://base-ui.com/react/components/drawer.md` |
| **Accordion** | `import { Accordion } from '@base-ui/react/accordion'` | `https://base-ui.com/react/components/accordion.md` |
| **Collapsible** | `import { Collapsible } from '@base-ui/react/collapsible'` | `https://base-ui.com/react/components/collapsible.md` |
| **Combobox** | `import { Combobox } from '@base-ui/react/combobox'` | `https://base-ui.com/react/components/combobox.md` |
| **Preview Card**| `import { PreviewCard } from '@base-ui/react/preview-card'` | `https://base-ui.com/react/components/preview-card.md` |
| **Toast** | `import { Toast } from '@base-ui/react/toast'` | `https://base-ui.com/react/components/toast.md` |

---

## 2. Critical Rules & Invariants

### A. Polymorphism (`render` vs `asChild`)
- Base UI uses the **`render`** prop (e.g., `<Button render={<a href="/link" />}>`).
- **DO NOT** use Radix's `asChild` prop on Base UI components.

### B. Portal Anatomy & Container
- Trigger/Popup primitives (`Dialog`, `Menu`, `Popover`, `Select`, `Tooltip`) structure overlays inside a `<Component.Portal>`:
  ```tsx
  <Dialog.Root open={open}>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal container={containerRef}>
      <Dialog.Backdrop className="..." />
      <Dialog.Popup className="...">
        <Dialog.Title>...</Dialog.Title>
        <Dialog.Description>...</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
  ```
- If portaling into a specific DOM container instead of `document.body`, pass `container={containerRef}` to `<Component.Portal>`.

### C. Styling & State Attributes
Base UI components use data attributes to reflect state in CSS:
- `data-state="open"` / `data-state="checked"`
- `data-starting-style` and `data-ending-style` for CSS transitions
- `data-disabled` / `disabled`
- `data-highlighted` for menu/select keyboard items

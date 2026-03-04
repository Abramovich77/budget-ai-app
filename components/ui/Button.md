# Button Component

A comprehensive, accessible button component with multiple variants, sizes, and states.

## Features

- ✅ Multiple variants (primary, secondary, outline, ghost, danger, success)
- ✅ Multiple sizes (sm, md, lg, xl)
- ✅ Loading state with spinner
- ✅ Icon support (left or right positioning)
- ✅ Full width option
- ✅ Rounded corners option
- ✅ Smooth animations and transitions
- ✅ Press animation (active:scale-95)
- ✅ Focus styles for accessibility
- ✅ Disabled state
- ✅ Dark mode support
- ✅ TypeScript support with proper types

## Usage

### Basic Button

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Variants

```tsx
// Primary action (default)
<Button variant="primary">Primary</Button>

// Secondary action
<Button variant="secondary">Secondary</Button>

// Outlined style
<Button variant="outline">Outline</Button>

// Minimal style
<Button variant="ghost">Ghost</Button>

// Destructive actions
<Button variant="danger">Delete</Button>

// Positive actions
<Button variant="success">Save</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button> {/* default */}
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Loading State

```tsx
const [isLoading, setIsLoading] = useState(false);

<Button loading={isLoading} onClick={handleSave}>
  Save Changes
</Button>
```

### With Icons

```tsx
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

// Icon on the left (default)
<Button icon={<PlusIcon className="w-5 h-5" />} iconPosition="left">
  Add Item
</Button>

// Icon on the right
<Button icon={<TrashIcon className="w-5 h-5" />} iconPosition="right">
  Delete
</Button>

// Icon only (no text)
<Button icon={<CheckIcon className="w-5 h-5" />} />
```

### Full Width

```tsx
<Button fullWidth variant="primary">
  Full Width Button
</Button>
```

### Rounded

```tsx
<Button rounded variant="primary">
  Rounded Button
</Button>
```

### Disabled

```tsx
<Button disabled>
  Disabled Button
</Button>
```

### Custom Styling

```tsx
<Button className="custom-class" style={{ marginTop: 20 }}>
  Custom Styled
</Button>
```

## Button Group

Group multiple buttons together with consistent spacing:

```tsx
import { ButtonGroup } from '@/components/ui/Button';

// Horizontal group (default)
<ButtonGroup spacing="normal">
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Save</Button>
</ButtonGroup>

// Vertical group
<ButtonGroup orientation="vertical" spacing="tight">
  <Button variant="outline">Option 1</Button>
  <Button variant="outline">Option 2</Button>
  <Button variant="outline">Option 3</Button>
</ButtonGroup>

// Loose spacing
<ButtonGroup spacing="loose">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## Complete Examples

### Form Actions

```tsx
<ButtonGroup>
  <Button variant="ghost" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="primary" loading={isSaving} onClick={onSave}>
    Save Changes
  </Button>
</ButtonGroup>
```

### Delete Confirmation

```tsx
<ButtonGroup>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button
    variant="danger"
    icon={<TrashIcon className="w-5 h-5" />}
    loading={isDeleting}
    onClick={onDelete}
  >
    Delete
  </Button>
</ButtonGroup>
```

### Add Item

```tsx
<Button
  variant="primary"
  size="lg"
  icon={<PlusIcon className="w-6 h-6" />}
  iconPosition="left"
  fullWidth
  onClick={onAddItem}
>
  Add New Transaction
</Button>
```

### Modal Actions

```tsx
<div className="flex justify-end gap-3 mt-6">
  <Button variant="ghost" onClick={onClose}>
    Cancel
  </Button>
  <Button variant="success" loading={isSubmitting} onClick={onSubmit}>
    Confirm
  </Button>
</div>
```

### Toolbar Actions

```tsx
<ButtonGroup spacing="tight">
  <Button variant="outline" size="sm" icon={<EditIcon />} />
  <Button variant="outline" size="sm" icon={<CopyIcon />} />
  <Button variant="outline" size="sm" icon={<TrashIcon />} />
</ButtonGroup>
```

## Props

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "success"` | `"primary"` | Button style variant |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `icon` | `React.ReactNode` | - | Icon element |
| `iconPosition` | `"left" \| "right"` | `"left"` | Icon position |
| `fullWidth` | `boolean` | `false` | Full width button |
| `rounded` | `boolean` | `false` | Fully rounded corners |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Button content |

All standard `button` HTML attributes are also supported.

### ButtonGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | `"tight" \| "normal" \| "loose"` | `"normal"` | Space between buttons |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Button layout |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Button elements |

## Accessibility

- ✅ Keyboard navigable (Tab, Enter, Space)
- ✅ Focus ring for keyboard users
- ✅ Disabled state properly communicated
- ✅ Loading state disables interaction
- ✅ ARIA-compliant

## Animations

- **Hover**: Background color change, shadow increase
- **Active**: Scale down (0.95) for press effect
- **Loading**: Rotating spinner
- **Transition**: All properties animated (200ms ease-in-out)

## Dark Mode

All variants automatically adapt to dark mode with proper contrast and colors.

## Best Practices

1. **Use appropriate variants:**
   - `primary` for main actions
   - `secondary` for alternative actions
   - `outline` for less prominent actions
   - `ghost` for minimal UI impact
   - `danger` for destructive actions (delete, remove)
   - `success` for positive confirmations

2. **Button sizing:**
   - `sm` for compact UIs (toolbars, tables)
   - `md` for standard forms
   - `lg` for prominent CTAs
   - `xl` for hero sections

3. **Loading states:**
   - Always show loading state for async operations
   - Disable button during loading

4. **Icons:**
   - Use consistent icon library
   - Match icon size to button size
   - Left icons for actions, right for navigation

5. **Grouping:**
   - Group related actions together
   - Place primary action last (right-most)
   - Use consistent spacing

## Migration from Old Code

### Before

```tsx
<button
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### After

```tsx
<Button variant="primary" loading={isLoading}>
  Submit
</Button>
```

## TypeScript

The component is fully typed and provides autocomplete for all props:

```tsx
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  console.log('Button clicked');
};

<Button
  variant="primary"  // ✅ Autocomplete available
  size="md"          // ✅ Autocomplete available
  onClick={handleClick}  // ✅ Type-safe
>
  Click Me
</Button>
```

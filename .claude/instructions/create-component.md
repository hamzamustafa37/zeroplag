# Create Component

## Context
Building a component for the plagiarism/grammar checker app.

## Steps

1. **Determine Component Type**
   - UI primitive → components/ui/[name]/
   - Feature-specific → components/[feature]/[name]/
   - Shared → components/shared/[name]/

2. **File Structure**
   [name]/
   ├── [name].tsx
   ├── [name].types.ts
   ├── [name].variants.ts
   ├── [name].stories.tsx
   └── [name].test.tsx

3. **Component Template**
   Use forwardRef, cn() for classes, separate types file.

4. **Requirements**
   - forwardRef for ref forwarding
   - cn() for Tailwind class merging
   - Export types separately
   - Add displayName
   - Support className prop

5. **Testing Checklist**
   - Renders without crashing
   - Forwards ref correctly
   - Applies custom className
   - Handles disabled state
   - Accessible (ARIA labels)
   - Matches snapshot

6. **Export**
   Add barrel export to components/[category]/index.ts

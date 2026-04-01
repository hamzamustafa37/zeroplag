# Refactor Component

## Context
Refactoring an existing component.

## Steps

1. **Analysis**
   - Identify issues
   - Check usage across codebase
   - Review prop patterns

2. **Backup**
   git mv to .legacy.tsx

3. **Refactor Patterns**
   - Split large components
   - Memoize expensive renders
   - Extract compound components
   - Extract custom hooks

4. **Prop Changes**
   - Maintain backward compatibility
   - Add @deprecated for old props
   - Update interfaces
   - Run type-check

5. **Testing**
   - Ensure tests pass
   - Add new tests
   - Visual regression test

6. **Migration**
   - Find all usages
   - Update imports

7. **Documentation**
   - Update stories
   - Update CLAUDE.md
   - Migration guide if breaking

8. **Cleanup**
   Remove .legacy.tsx

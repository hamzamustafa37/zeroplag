# Setup Feature

## Context
Setting up a new feature module.

## Steps

1. **Folder Structure**
   components/[feature]/
   lib/[feature]/
   hooks/use-[feature]-query.ts
   app/(dashboard)/[feature]/page.tsx

2. **Types Definition**
   Create lib/[feature]/types.ts with interfaces.

3. **Service Layer**
   Create lib/[feature]/service.ts with DB calls.

4. **React Query Hook**
   Create hooks/use-[feature]-query.ts

5. **Main Component**
   Create components/[feature]/[feature]-panel.tsx

6. **Route Page**
   Create app/(dashboard)/[feature]/page.tsx

7. **Checklist**
   - Types defined
   - DB schema updated
   - API route created
   - Service layer done
   - React Query hooks done
   - Components built
   - Route page added
   - Tests written
   - Stories added
   - Docs updated

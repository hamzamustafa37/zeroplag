# Add API Route

## Context
Adding a new API endpoint to the Next.js app.

## Steps

1. **Route Location**
   - Public API → app/api/[route]/route.ts
   - Protected → + auth middleware
   - WebSocket → app/api/ws/[route]/route.ts

2. **HTTP Methods**
   Export GET, POST, PUT, DELETE as named functions.

3. **Route Template**
   - Auth check first
   - Rate limit second
   - Parse body
   - Zod validation
   - Business logic
   - Return response
   - Error handling wrapper

4. **Error Handling**
   - Try/catch wrapper
   - Log with route identifier
   - Return JSON error object
   - Don't expose internals

5. **Validation**
   - Use Zod
   - Return 400 for validation errors
   - Include specific field errors

6. **Testing**
   Create tests/integration/api/[route].test.ts

7. **Documentation**
   Update CLAUDE.md or api-contracts.md

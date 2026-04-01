# Debug Issue

## Context
Systematic debugging for production issues.

## Steps

1. **Reproduce**
   - Get exact steps
   - Check environment
   - Try incognito mode
   - Check locally

2. **Gather Data**
   - Add logging
   - Check Sentry
   - Vercel logs
   - DB query logs
   - Network tab

3. **Isolate**
   - Binary search commenting
   - Check recent deployments
   - Rollback test
   - Check dependencies

4. **Common Issues**
   White screen → runtime error
   Infinite loading → missing await
   Wrong data → stale cache
   Slow render → large lists
   500 error → API exception

5. **Fix**
   - Write reproduction test
   - Implement fix
   - Verify tests pass
   - Check no regressions

6. **Deploy**
   - Create branch
   - Commit fix
   - Open PR

7. **Monitor**
   - Watch error rates
   - Check performance
   - Verify in production
   - Close incident

8. **Document**
   - Add to runbook
   - Update troubleshooting
   - Share learnings

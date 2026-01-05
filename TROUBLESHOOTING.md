# 🔧 Troubleshooting Guide - Elevare/LucresIA

Comprehensive troubleshooting guide for common issues in development, testing, and production environments.

---

## Table of Contents

1. [Build & Compilation Issues](#build--compilation-issues)
2. [Database Connection Problems](#database-connection-problems)
3. [Authentication & Authorization Errors](#authentication--authorization-errors)
4. [AI Integration Issues](#ai-integration-issues)
5. [S3 Upload Failures](#s3-upload-failures)
6. [Instagram API Errors](#instagram-api-errors)
7. [Performance Issues](#performance-issues)
8. [Frontend UI Problems](#frontend-ui-problems)
9. [Analytics Tracking Issues](#analytics-tracking-issues)
10. [Deployment Problems](#deployment-problems)

---

## Build & Compilation Issues

### ❌ TypeScript Compilation Errors

**Problem**: `npm run check` fails with TypeScript errors

**Solutions**:

1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **Check TypeScript version**:
   ```bash
   npm list typescript
   # Should be 5.3.x or higher
   ```

3. **Verify tsconfig.json settings**:
   - Target should be `ES2020` or higher
   - Include paths configured correctly
   - Check for conflicting `@types/*` packages

4. **Common specific errors**:
   - **Regex Unicode flag error**: Upgrade target to `ES2020` or replace Unicode regex
   - **Module not found**: Check import paths and ensure files exist
   - **Type mismatch in tRPC**: Verify Zod schema matches TypeScript types

### ❌ Build Fails with "Out of Memory"

**Problem**: `npm run build` crashes with heap out of memory

**Solutions**:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or add to package.json script:
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

### ❌ Vite Build Takes Too Long (>5 minutes)

**Problem**: Production build is extremely slow

**Solutions**:

1. **Use SWC instead of Babel**:
   ```bash
   npm install -D @vitejs/plugin-react-swc
   ```

2. **Disable source maps temporarily**:
   ```typescript
   // vite.config.ts
   build: {
     sourcemap: false, // Speeds up build significantly
   }
   ```

3. **Check for large dependencies**:
   ```bash
   npm run build -- --mode analyze
   # Opens bundle analyzer
   ```

---

## Database Connection Problems

### ❌ "Connection refused" Error

**Problem**: Cannot connect to PostgreSQL database

**Solutions**:

1. **Verify database is running**:
   ```bash
   # Local PostgreSQL
   sudo service postgresql status
   
   # Docker
   docker ps | grep postgres
   ```

2. **Check DATABASE_URL format**:
   ```bash
   # Correct format:
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   
   # Common mistakes:
   # - Missing protocol (postgresql://)
   # - Wrong port (5432 default)
   # - Incorrect credentials
   ```

3. **Test connection manually**:
   ```bash
   psql -h localhost -U username -d dbname
   ```

4. **Check firewall rules**:
   ```bash
   sudo ufw status
   # Ensure port 5432 is open
   ```

### ❌ "Too Many Connections" Error

**Problem**: Database connection pool exhausted

**Solutions**:

1. **Increase connection limit**:
   ```typescript
   // drizzle.config.ts
   export default {
     pool: {
       min: 2,
       max: 10, // Increase if needed
     }
   };
   ```

2. **Check for connection leaks**:
   ```bash
   # Find queries holding connections
   SELECT * FROM pg_stat_activity WHERE state != 'idle';
   ```

3. **Restart application to release connections**

### ❌ Migration Fails

**Problem**: `drizzle-kit push` or migration fails

**Solutions**:

1. **Check migration order**:
   ```bash
   ls -la drizzle/
   # Ensure migrations are numbered correctly
   ```

2. **Rollback and retry**:
   ```bash
   # Manual rollback if needed
   psql -d dbname -c "DROP TABLE IF EXISTS quick_create_posts CASCADE;"
   
   # Re-run migration
   npm run db:push
   ```

3. **Verify schema syntax**:
   - Check for typos in column names
   - Ensure data types are valid
   - Verify foreign key constraints exist

---

## Authentication & Authorization Errors

### ❌ "Unauthorized" on Protected Endpoints

**Problem**: tRPC calls return 401 Unauthorized

**Solutions**:

1. **Verify JWT token is sent**:
   ```javascript
   // Browser DevTools > Network > Headers
   // Should see: Authorization: Bearer <token>
   ```

2. **Check JWT_SECRET matches**:
   ```bash
   # Server and client must use same secret
   echo $JWT_SECRET
   ```

3. **Token may be expired**:
   ```typescript
   // Check token expiration
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   console.log(new Date(decoded.exp * 1000)); // Expiration time
   ```

4. **Clear cookies and re-login**:
   ```javascript
   // Browser console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
   });
   ```

### ❌ Google OAuth Login Fails

**Problem**: "Invalid OAuth client" or redirect errors

**Solutions**:

1. **Verify credentials in .env**:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-secret
   ```

2. **Check authorized redirect URIs in Google Console**:
   - Must include: `http://localhost:5000/api/auth/callback/google`
   - And production: `https://yourdomain.com/api/auth/callback/google`

3. **Ensure OAuth consent screen is configured**:
   - Go to Google Cloud Console
   - APIs & Services > OAuth consent screen
   - Add test users if in development mode

---

## AI Integration Issues

### ❌ OpenAI API Returns "Invalid API Key"

**Problem**: AI caption generation fails with authentication error

**Solutions**:

1. **Verify OPENAI_API_KEY in .env**:
   ```bash
   # Key should start with sk-
   OPENAI_API_KEY=sk-...
   ```

2. **Test API key directly**:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

3. **Check API key permissions**:
   - Ensure key has access to GPT-4 models
   - Verify billing is active

### ❌ AI Generation is Too Slow (>10s)

**Problem**: Caption generation takes longer than expected

**Solutions**:

1. **Use streaming for faster perceived performance**:
   ```typescript
   const completion = await openai.chat.completions.create({
     model: "gpt-4-turbo",
     stream: true, // Enable streaming
     // ...
   });
   ```

2. **Reduce max_tokens**:
   ```typescript
   max_tokens: 300, // Lower from 500+
   ```

3. **Switch to faster model temporarily**:
   ```typescript
   model: "gpt-3.5-turbo", // Faster than GPT-4
   ```

4. **Implement timeout and fallback**:
   ```typescript
   const timeout = 10000; // 10s
   const caption = await Promise.race([
     generateWithAI(preset),
     new Promise((_, reject) => 
       setTimeout(() => reject(new Error('Timeout')), timeout)
     )
   ]).catch(() => generateFromTemplate(preset));
   ```

### ❌ Engagement Score Always Returns Same Value

**Problem**: Scoring algorithm not working correctly

**Solutions**:

1. **Verify input data**:
   ```typescript
   console.log('Caption:', caption);
   console.log('Images:', imageUrls);
   console.log('Preset:', presetId);
   ```

2. **Check scorer function logic**:
   ```bash
   # View scorer implementation
   cat server/_core/engagementScorer.ts
   ```

3. **Test scorer independently**:
   ```typescript
   import { calculateEngagementScore } from './engagementScorer';
   
   const result = calculateEngagementScore({
     caption: 'Test caption',
     imageUrls: ['url1', 'url2'],
     presetId: 'transformacao-incrivel',
   });
   
   console.log('Score breakdown:', result);
   ```

---

## S3 Upload Failures

### ❌ "Access Denied" on Upload

**Problem**: Image upload to S3 fails with 403 Forbidden

**Solutions**:

1. **Verify AWS credentials in .env**:
   ```bash
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_S3_BUCKET=your-bucket-name
   AWS_REGION=us-east-1
   ```

2. **Check IAM permissions**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket/*"
       }
     ]
   }
   ```

3. **Test AWS credentials**:
   ```bash
   aws s3 ls s3://your-bucket --profile your-profile
   ```

4. **Verify bucket CORS configuration**:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:5000", "https://yourdomain.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

### ❌ Upload Hangs or Times Out

**Problem**: Upload never completes

**Solutions**:

1. **Check file size limits**:
   ```typescript
   // Max file size: 10MB
   if (file.size > 10 * 1024 * 1024) {
     throw new Error('File too large');
   }
   ```

2. **Implement upload progress tracking**:
   ```typescript
   const upload = s3.upload({
     Bucket: bucket,
     Key: key,
     Body: file,
   });
   
   upload.on('httpUploadProgress', (progress) => {
     console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
   });
   ```

3. **Use multipart upload for large files**:
   ```typescript
   const upload = new Upload({
     client: s3,
     params: {
       Bucket: bucket,
       Key: key,
       Body: file,
     },
     partSize: 5 * 1024 * 1024, // 5MB parts
   });
   ```

---

## Instagram API Errors

### ❌ "Invalid Access Token"

**Problem**: Instagram publish fails with token error

**Solutions**:

1. **Refresh Instagram access token**:
   - Instagram tokens expire every 60 days
   - Implement token refresh flow
   - Store refresh token securely

2. **Verify Instagram Business Account**:
   - Personal accounts don't support API
   - Must be Business or Creator account

3. **Check API permissions**:
   - Required: `instagram_basic`, `instagram_content_publish`
   - Re-authenticate if permissions changed

### ❌ "Media URL Not Accessible"

**Problem**: Instagram cannot download image from URL

**Solutions**:

1. **Ensure S3 URLs are publicly accessible**:
   ```typescript
   // Generate presigned URL for Instagram
   const url = s3.getSignedUrl('getObject', {
     Bucket: bucket,
     Key: key,
     Expires: 3600, // 1 hour
   });
   ```

2. **Verify image format and size**:
   - Supported: JPG, PNG
   - Max size: 8MB
   - Min resolution: 320x320
   - Max resolution: 1080x1080 for feed

3. **Test URL directly**:
   ```bash
   curl -I https://your-s3-url
   # Should return 200 OK
   ```

---

## Performance Issues

### ❌ QuickCreate Takes >5 Minutes

**Problem**: Creation time exceeds target

**Solutions**:

1. **Profile where time is spent**:
   ```typescript
   console.time('preset-selection');
   // ... preset selection logic
   console.timeEnd('preset-selection');
   
   console.time('image-upload');
   // ... upload logic
   console.timeEnd('image-upload');
   ```

2. **Common bottlenecks**:
   - **Slow uploads**: Compress images client-side before upload
   - **AI generation**: Use template fallback if >10s
   - **Database queries**: Add indexes on userId, sessionId

3. **Optimize image compression**:
   ```typescript
   import imageCompression from 'browser-image-compression';
   
   const compressed = await imageCompression(file, {
     maxSizeMB: 1,
     maxWidthOrHeight: 1920,
     useWebWorker: true,
   });
   ```

### ❌ Slow Database Queries

**Problem**: tRPC endpoints respond slowly (>1s)

**Solutions**:

1. **Add database indexes**:
   ```sql
   CREATE INDEX idx_posts_userId_status ON quick_create_posts(userId, status);
   CREATE INDEX idx_posts_sessionId ON quick_create_posts(sessionId);
   ```

2. **Use query EXPLAIN ANALYZE**:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM quick_create_posts WHERE userId = 123;
   ```

3. **Implement caching**:
   ```typescript
   // Use Redis for frequently accessed data
   const cached = await redis.get(`user:${userId}:posts`);
   if (cached) return JSON.parse(cached);
   ```

### ❌ High Memory Usage

**Problem**: Node process uses >1GB RAM

**Solutions**:

1. **Check for memory leaks**:
   ```bash
   node --inspect server/index.ts
   # Open chrome://inspect in Chrome
   # Take heap snapshots
   ```

2. **Limit concurrent operations**:
   ```typescript
   import pLimit from 'p-limit';
   
   const limit = pLimit(10); // Max 10 concurrent
   const promises = images.map(img => limit(() => uploadToS3(img)));
   ```

3. **Restart periodically** (production):
   ```bash
   # PM2 with max memory restart
   pm2 start server/index.ts --max-memory-restart 1G
   ```

---

## Frontend UI Problems

### ❌ QuickCreate Flow Stuck on Step

**Problem**: Cannot advance to next step despite valid input

**Solutions**:

1. **Check validation logic**:
   ```typescript
   // Verify canAdvance conditions
   const state = useQuickCreateMachine();
   console.log('Can advance?', state.canAdvance);
   console.log('Current data:', state);
   ```

2. **Verify event tracking**:
   ```typescript
   // Ensure analytics doesn't block UI
   try {
     track('step_completed', data);
   } catch (e) {
     console.error('Analytics error:', e);
     // Don't block UI on analytics failure
   }
   ```

3. **Check browser console for errors**:
   - Press F12
   - Look for JavaScript errors
   - Check Network tab for failed API calls

### ❌ Engagement Score Not Updating

**Problem**: Score remains at 0% or doesn't change

**Solutions**:

1. **Verify debounce is working**:
   ```typescript
   // Should update 1 second after typing stops
   const debouncedAnalyze = useMemo(
     () => debounce(analyzeContent, 1000),
     []
   );
   ```

2. **Check API call succeeds**:
   ```typescript
   // Browser DevTools > Network
   // Look for POST to /api/trpc/quickCreate.analyzeContent
   ```

3. **Verify scorer returns valid data**:
   ```typescript
   const result = await analyzeContent({ caption, ... });
   console.log('Score result:', result);
   // Should have: total, text, visual, cta, hashtags, timing
   ```

### ❌ Images Not Displaying After Upload

**Problem**: Uploaded images show broken icon

**Solutions**:

1. **Check S3 URL format**:
   ```typescript
   // Should be fully qualified URL
   console.log('Image URL:', imageUrl);
   // Correct: https://bucket.s3.region.amazonaws.com/key
   ```

2. **Verify CORS on S3 bucket**:
   - Must allow GET from your domain
   - Check browser console for CORS errors

3. **Test image URL directly**:
   ```bash
   curl -I https://your-image-url
   # Should return 200 OK
   ```

---

## Analytics Tracking Issues

### ❌ Events Not Appearing in PostHog

**Problem**: Analytics events not tracked

**Solutions**:

1. **Verify POSTHOG_API_KEY configured**:
   ```bash
   echo $POSTHOG_API_KEY
   ```

2. **Check PostHog initialization**:
   ```typescript
   // Should initialize on app start
   posthog.init(apiKey, {
     api_host: 'https://app.posthog.com',
   });
   ```

3. **Test event manually**:
   ```typescript
   import { track } from './lib/analytics';
   
   track('test_event', { test: true });
   // Check PostHog dashboard in 1-2 minutes
   ```

4. **Check for ad blockers**:
   - Ad blockers may block analytics
   - Test in incognito mode

### ❌ Session ID Not Consistent

**Problem**: Analytics events have different session IDs

**Solutions**:

1. **Verify session storage**:
   ```typescript
   // Should persist across page refreshes
   const sessionId = sessionStorage.getItem('quickCreateSessionId');
   console.log('Session ID:', sessionId);
   ```

2. **Generate ID only once**:
   ```typescript
   // In useQuickCreateMachine
   const [sessionId] = useState(() => {
     return sessionStorage.getItem('sessionId') || generateId();
   });
   ```

---

## Deployment Problems

### ❌ Build Succeeds Locally but Fails in CI

**Problem**: GitHub Actions build fails

**Solutions**:

1. **Check Node version consistency**:
   ```yaml
   # .github/workflows/deploy.yml
   - uses: actions/setup-node@v3
     with:
       node-version: '18' # Match local version
   ```

2. **Verify environment variables in CI**:
   - Go to GitHub Settings > Secrets
   - Ensure all required secrets are set

3. **Check disk space**:
   ```yaml
   # Add to workflow
   - name: Check disk space
     run: df -h
   ```

4. **Clear cache and retry**:
   - GitHub Actions > Re-run jobs > Re-run all jobs with clean cache

### ❌ "Command not found" in Production

**Problem**: npm scripts fail on server

**Solutions**:

1. **Use full paths**:
   ```bash
   # Instead of:
   npm run build
   
   # Use:
   /usr/bin/npm run build
   ```

2. **Install dependencies globally if needed**:
   ```bash
   npm install -g pm2
   npm install -g drizzle-kit
   ```

3. **Check PATH variable**:
   ```bash
   echo $PATH
   # Should include /usr/local/bin and node paths
   ```

### ❌ Server Crashes After Deploy

**Problem**: Application exits unexpectedly in production

**Solutions**:

1. **Check PM2 logs**:
   ```bash
   pm2 logs elevare
   pm2 describe elevare
   ```

2. **Look for uncaught exceptions**:
   ```typescript
   // Add global error handlers
   process.on('uncaughtException', (error) => {
     console.error('Uncaught Exception:', error);
     // Log to Sentry
     process.exit(1);
   });
   
   process.on('unhandledRejection', (reason, promise) => {
     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
   });
   ```

3. **Check port conflicts**:
   ```bash
   lsof -i :5000
   # Kill conflicting process if needed
   ```

4. **Verify environment variables loaded**:
   ```bash
   pm2 env 0
   # Check DATABASE_URL, JWT_SECRET, etc.
   ```

---

## Quick Diagnostic Checklist

When encountering issues, run through this checklist:

- [ ] Check logs: `pm2 logs` or browser console
- [ ] Verify environment variables: `.env` file present and correct
- [ ] Test database connection: `psql` or health check endpoint
- [ ] Check network: `curl` API endpoints
- [ ] Review recent changes: `git log` and `git diff`
- [ ] Clear caches: `rm -rf node_modules dist` and reinstall
- [ ] Test in isolation: Minimal reproduction case
- [ ] Check service status: Database, Redis, etc. are running
- [ ] Review documentation: README, DEPLOY_PRODUCTION.md
- [ ] Search issues: GitHub issues for similar problems

---

## Getting Help

If issues persist after troubleshooting:

1. **Check existing documentation**:
   - README.md
   - DEPLOY_PRODUCTION.md
   - GUIA_TECNICO_ARQUITETURA.md

2. **Gather information**:
   - Error messages (full stack trace)
   - Environment details (OS, Node version, etc.)
   - Steps to reproduce
   - What you've tried

3. **Open GitHub Issue**:
   - Use issue template
   - Include all relevant information
   - Tag appropriately (bug/help-wanted)

4. **Contact support**:
   - Email: dev@elevare.com
   - Slack: #elevare-dev channel

---

**Last Updated**: January 5, 2026  
**Version**: 1.0.0

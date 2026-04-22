# Word Problem Coach - Deployment Instructions

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy

Click this button to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/word-problem-coach&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,ANTHROPIC_API_KEY&project-name=word-problem-coach&repository-name=word-problem-coach)

### Option 2: Manual Deploy

#### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Word Problem Coach MVP"

# Push to GitHub
git remote add origin https://github.com/yourusername/word-problem-coach.git
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_APP_URL=https://wordproblemcoach.com
```

#### Step 4: Deploy

Click "Deploy" — Vercel will build and deploy your app.

---

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Set project name (e.g., "word-problem-coach")
5. Set database password
6. Choose region (closest to your users)
7. Click "Create new project"

Wait ~2 minutes for setup.

### Step 2: Get Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Run Database Schema

1. Go to SQL Editor in Supabase
2. Click "New Query"
3. Copy entire contents of `lib/supabase/schema.sql`
4. Click "Run" (or Cmd/Ctrl + Enter)

You should see: "Success. No rows returned"

### Step 4: Seed Sample Problems

1. Still in SQL Editor
2. Click "New Query"
3. Copy entire contents of `lib/supabase/seed.sql`
4. Click "Run"

Verify: Go to Table Editor → `problems` table — you should see 20 problems.

---

## 🔑 Anthropic API Setup

### Step 1: Get API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to API Keys
4. Click "Create Key"
5. Name it (e.g., "Word Problem Coach")
6. Copy the key → `ANTHROPIC_API_KEY`

### Step 2: Set Usage Limits (Optional)

In Anthropic console:
- Set monthly budget limit
- Configure rate limits

**Estimated costs:** ~$0.01-0.02 per problem session with Claude Sonnet.

---

## 🌐 Custom Domain Setup

### In Vercel:

1. Go to Project Settings → Domains
2. Add your domain: `wordproblemcoach.com`
3. Follow DNS configuration instructions:
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** `cname.vercel-dns.com`

### For Root Domain:

1. Add domain: `wordproblemcoach.com` (without www)
2. Configure at your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

Wait ~5 minutes for DNS propagation.

---

## ✅ Post-Deployment Checklist

### Test All Features

- [ ] Landing page loads
- [ ] Grade selector works
- [ ] Dashboard shows problems
- [ ] Problem solver loads
- [ ] All 4 steps function
- [ ] AI feedback appears (check console for errors)
- [ ] Hints generate correctly
- [ ] "Check My Setup" works
- [ ] "Similar Problem" generates
- [ ] Progress page displays
- [ ] Mobile responsive (test on actual phone)

### Check Analytics

- [ ] Vercel Analytics enabled
- [ ] No errors in Vercel Functions logs
- [ ] Supabase logs show queries

### Performance

- [ ] Lighthouse score >90
- [ ] Time to Interactive <3s
- [ ] No console errors

---

## 🔧 Troubleshooting

### "AI returned no response"

**Cause:** Anthropic API key invalid or rate limited.

**Fix:**
1. Check API key in Vercel env vars
2. Verify key is active in Anthropic console
3. Check usage limits

### "Database error"

**Cause:** Supabase credentials wrong or schema not run.

**Fix:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY`
2. Re-run `schema.sql` in Supabase SQL Editor
3. Check Supabase project is active

### "Problem not found"

**Cause:** No problems in database.

**Fix:**
1. Run `lib/supabase/seed.sql` in Supabase
2. Or add problems manually via Table Editor

### Build fails on Vercel

**Cause:** TypeScript errors or missing dependencies.

**Fix:**
```bash
# Test build locally
npm run build

# Fix any errors shown
# Commit and push fixes
git push
```

---

## 📊 Monitoring

### Vercel Analytics

- Dashboard → Analytics
- Monitor: Page views, bandwidth, function invocations

### Supabase Logs

- Project → Logs
- Filter by: `error` for issues

### Anthropic Usage

- Console → Usage
- Monitor: Tokens, costs, rate limits

---

## 🎯 Going Live

### Pre-Launch Checklist

- [ ] All tests passing
- [ ] Environment variables set in production
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Error tracking set up (optional: Sentry)
- [ ] Analytics configured
- [ ] Backup strategy in place

### Launch!

1. Update Vercel project to Production deployment
2. Share on social media!
3. Monitor logs for first 24 hours

---

## 📈 Scaling

### When You Get Traffic

**Vercel:**
- Auto-scales with traffic
- Pro plan: $20/month for more bandwidth

**Supabase:**
- Free tier: 500MB database, 50k monthly active users
- Pro plan: $25/month for more resources

**Anthropic:**
- Pay per token
- ~1000 problems = ~$10-20

### Optimization Tips

1. **Cache AI responses** — Use Vercel KV or Upstash
2. **Edge functions** — Deploy API routes to edge
3. **Problem pagination** — Load problems in batches
4. **Lazy load components** — Code split heavy components

---

## 🆘 Support

### Vercel
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Discord: [vercel.com/community](https://vercel.com/community)

### Supabase
- Docs: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)

### Anthropic
- Docs: [docs.anthropic.com](https://docs.anthropic.com)
- Email: support@anthropic.com

---

**You're ready to ship! 🚀**

*"Alright legend, let's turn that story into math! 🔥"*

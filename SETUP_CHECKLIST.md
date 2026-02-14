# 🚀 Setup Checklist

Follow these steps to get your Valentine's Day Gallery up and running:

## Step 1: Supabase Setup
- [ ] Go to https://supabase.com and create a free account
- [ ] Create a new project (choose a region close to you)
- [ ] Wait for project to initialize
- [ ] Go to Settings → API and copy:
  - [ ] Project URL
  - [ ] Anon (public) Key

## Step 2: Local Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Paste your Supabase credentials:
  ```
  VITE_SUPABASE_URL=your_project_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  ```

## Step 3: Database Setup
- [ ] In Supabase, go to SQL Editor
- [ ] Run the complete SQL script from [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (Search for "Run this SQL")
- [ ] Wait for all tables to be created

## Step 4: Storage Setup
In Supabase Storage:
- [ ] Create a new bucket named `valentine-images`
- [ ] Make it **Public**
- [ ] Go to Policies and ensure public uploads/downloads are allowed

Or run this SQL in SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public)
  VALUES ('valentine-images', 'valentine-images', true);

CREATE POLICY "Public upload" ON storage.objects FOR INSERT
  TO public WITH CHECK (bucket_id = 'valentine-images');

CREATE POLICY "Public read" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'valentine-images');
```

## Step 5: Test Locally
```bash
npm run dev
```
Visit `http://localhost:5173` and test:
- [ ] Upload images (enter name, select files, click upload)
- [ ] See images appear in gallery
- [ ] Add comments to images
- [ ] Try anonymous comment option
- [ ] Like/unlike images

## Step 6: Generate Production Build
```bash
npm run build
```
Check that `dist/` folder is created with files.

## Step 7: Deploy to Vercel

### Option A: GitHub (Recommended)
1. [ ] Push to GitHub: `git push origin main`
2. [ ] Go to https://vercel.com/dashboard
3. [ ] Click "Add New" → "Project"
4. [ ] Select your GitHub repo
5. [ ] In "Environment Variables", add:
   - [ ] `VITE_SUPABASE_URL`
   - [ ] `VITE_SUPABASE_ANON_KEY`
6. [ ] Click Deploy
7. [ ] Get your live URL when deployment finishes!

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts and add environment variables when asked.

### Option C: Direct Upload
```bash
npm run build
# Upload the "dist" folder to Vercel
```

## Step 8: Go Live
- [ ] Share your Vercel URL with friends
- [ ] They can upload photos, comment, and like
- [ ] Celebrate! 🎉

## Troubleshooting

### "Storage bucket not found"
- Check bucket name is exactly `valentine-images`
- Make sure it's public
- Verify policies are set

### "Image upload fails"
- Check environment variables in `.env.local`
- Verify Supabase URL and Key are correct
- Check browser console for errors

### "Comments don't show"
- Run the database SQL script again
- Check RLS policies are enabled
- Look for errors in Supabase dashboard

### Deployment shows errors
- Run `npm run build` locally to catch errors first
- Check Vercel build logs
- Make sure environment variables are set in Vercel

## Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed documentation
2. Check Supabase docs: https://supabase.com/docs
3. Check Vercel docs: https://vercel.com/docs
4. Common issues usually involve environment variables or RLS policies

---

You've got this! 💝 When you're done, share the link with your Valentine! 💕

# 🔍 Delete Feature Troubleshooting Guide

If the delete button isn't working, follow these steps:

## Step 1: Check Supabase RLS Policies

Go to your Supabase project → **Authentication** → **Policies** and verify these policies exist:

### For `images` table:
1. Go to **SQL Editor**
2. Run this to check existing policies:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'images';
```

### Step 2: Delete Old Policies (if they exist)
If you have conflicting policies, remove them:

```sql
DROP POLICY IF EXISTS "Anyone can delete images" ON images;
DROP POLICY IF EXISTS "Images are publicly readable" ON images;
DROP POLICY IF EXISTS "Anyone can create images" ON images;
```

### Step 3: Create Fresh Policies
Run this complete setup for the images table:

```sql
-- Enable RLS on images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow public to read images
CREATE POLICY "Images read policy" ON images
  FOR SELECT USING (true);

-- Allow public to insert images
CREATE POLICY "Images insert policy" ON images
  FOR INSERT WITH CHECK (true);

-- Allow public to delete images (THIS IS NEEDED FOR DELETE TO WORK!)
CREATE POLICY "Images delete policy" ON images
  FOR DELETE USING (true);
```

## Step 4: Storage Bucket Policies

Make sure the storage bucket `valentine-images` has delete policy:

```sql
DROP POLICY IF EXISTS "Public delete" ON storage.objects;

CREATE POLICY "Public delete" ON storage.objects 
  FOR DELETE 
  TO public 
  USING (bucket_id = 'valentine-images');
```

## Step 5: Test Delete

1. Refresh your browser (clear cache if needed)
2. Upload an image
3. Go to "View All"
4. Hover over an image - delete button (✕) should appear
5. Click delete - browser alert will show error if there's an issue

## Step 6: Check Browser Console

If delete still fails:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try deleting an image
4. Look for error message - share it if you need help

## Common Issues:

**Issue: "Error deleting image: Cannot read property..."**
- RLS policies not set correctly
- Run the fresh policies from Step 3

**Issue: Image deleted but storage file remains**
- This is OK! Database is deleted (main goal)
- Storage cleanup isn't critical

**Issue: Nothing happens when clicking delete**
- Check browser console for errors (F12 → Console)
- Verify policies are created
- Try refreshing page

---

Need help? Check what error appears in the alert or browser console when you try to delete!

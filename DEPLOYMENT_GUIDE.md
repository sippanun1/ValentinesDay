# 💝 Valentine's Day Gallery 💝

A beautiful, interactive website where people can share their Valentine's photos, comment on them, and like their favorites. Built with React, TypeScript, and Supabase.

## Features

✨ **Image Upload** - Users can upload their Valentine's Day photos and create galleries
💬 **Comments** - Others can comment on photos with optional anonymous posting
❤️ **Likes** - Show appreciation with heart-shaped like button
📱 **Responsive Design** - Works perfectly on all devices
🚀 **Easy Deployment** - Deploy to Vercel with one click

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Storage)
- **Styling**: Pure CSS with gradients and animations
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase project (free tier available at https://supabase.com)

### 1. Clone and Setup

```bash
npm install --legacy-peer-deps
```

### 2. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from the API settings

### 3. Set Up Supabase Database

Go to your Supabase project's SQL Editor and run this SQL:

```sql
-- Create galleries table
CREATE TABLE galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create images table
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE NOT NULL,
  commenter_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Create likes table
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(image_id, ip_hash)
);

-- Enable RLS (Row Level Security)
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Galleries are publicly readable" ON galleries
  FOR SELECT USING (true);

CREATE POLICY "Images are publicly readable" ON images
  FOR SELECT USING (true);

CREATE POLICY "Comments are publicly readable" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Likes are publicly readable" ON likes
  FOR SELECT USING (true);

-- Allow public inserts
CREATE POLICY "Anyone can create galleries" ON galleries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create images" ON images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create likes" ON likes
  FOR INSERT WITH CHECK (true);

-- Allow public deletes for likes
CREATE POLICY "Anyone can delete likes" ON likes
  FOR DELETE USING (true);
```

### 4. Create Storage Bucket

1. Go to **Storage** in your Supabase project
2. Create a new bucket called `valentine-images`
3. Make it **Public**
4. Go to **Policies** and add:
   - Allow public uploads
   - Allow public downloads

Or use this SQL in the SQL Editor:

```sql
INSERT INTO storage.buckets (id, name, public)
  VALUES ('valentine-images', 'valentine-images', true);

CREATE POLICY "Public upload" ON storage.objects FOR INSERT
  TO public WITH CHECK (bucket_id = 'valentine-images');

CREATE POLICY "Public read" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'valentine-images');
```

### 5. Configure Environment Variables

Create `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Replace with your actual Supabase credentials from the API settings page.

### 6. Development

```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

### Option 3: Manual Deploy

1. Build the project:
   ```bash
   npm run build
   ```
2. Go to [Vercel](https://vercel.com)
3. Drag and drop the `dist` folder

## Project Structure

```
src/
├── components/
│   ├── ImageUpload.tsx      # Upload form component
│   ├── Gallery.tsx          # Gallery grid display
│   ├── ImageCard.tsx        # Individual image card
│   ├── CommentForm.tsx      # Comment input form
│   ├── CommentList.tsx      # Comments display
│   └── LikeButton.tsx       # Like functionality
├── lib/
│   └── supabase.ts          # Supabase client
├── App.tsx                  # Main app component
├── App.css                  # App styles
├── index.css                # Global styles
└── main.tsx                 # Entry point
```

## Features Explained

### Upload Photos
- Users enter their name and select multiple photos
- Photos are stored in Supabase Storage
- Gallery is created for each uploader

### View Gallery
- Photos displayed in a responsive grid
- Shows uploader's name on each photo
- Like count visible

### Comments
- Users can leave comments on any photo
- Option to post as "Anonymous"
- Comments show commenter name and timestamp
- Similar to Facebook comment style

### Likes
- Heart button to like/unlike photos
- Tracking using browser local storage (anonymous IP hash)
- Live like count updates

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Tips

- Images should be optimized before upload (use online tools like TinyPNG)
- Recommended max file size: 5MB per image
- Supabase free tier has bandwidth limits

## Troubleshooting

### Images not uploading?
- Check Supabase storage bucket is public
- Verify environment variables are correct
- Check browser console for errors

### Comments not showing?
- Verify RLS policies are correctly set
- Check comment table exists in Supabase

### Deployment issues?
- Make sure `dist` folder is created: `npm run build`
- Verify environment variables in Vercel settings
- Check build logs in Vercel dashboard

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check the Supabase and Vercel documentation.

---

Made with ❤️ for Valentine's Day

# Images Folder

Place your images here for the website carousel.

## How to Use:

1. **Add your images** to this folder:
   - `frederick-photo.jpg` - Your main photo
   - `frederick-speaking.jpg` - Speaking/presentation photo  
   - `design-work.jpg` - Design work showcase
   - `workshop.jpg` - Workshop or team photo

2. **Update the content.json** file:
   ```json
   "images": [
     {
       "url": "/images/frederick-photo.jpg",
       "alt": "Frederick's Photo",
       "placeholder": "👨‍💻"
     },
     {
       "url": "/images/frederick-speaking.jpg", 
       "alt": "Frederick Speaking",
       "placeholder": "🎤"
     }
   ]
   ```

## Supported Formats:
- JPG/JPEG
- PNG  
- WebP (recommended for best performance)
- SVG

## Recommended Sizes:
- **Width**: 800-1200px
- **Height**: 600-900px
- **Aspect ratio**: 4:3 or 16:10 works well
- **File size**: Under 500KB each for best performance

## Notes:
- Images will auto-rotate every 4 seconds
- Users can click the dots to manually switch images
- Images should be optimized for web (use tools like TinyPNG) 
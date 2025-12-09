# Background Remover Tool

## Overview
AI-powered background removal tool using Photoroom API. Remove backgrounds from images instantly with transparent PNG output.

## Features
- ✨ Drag & drop image upload
- 🎨 Real-time preview
- 🤖 AI-powered background removal
- 💾 Download processed images
- 📱 Responsive design
- 🔒 Secure and authenticated

## Supported Formats
- **Input**: JPG, PNG, WEBP
- **Output**: PNG with transparent background
- **Max Size**: 10MB

## Setup

### 1. Get Photoroom API Key
1. Sign up at [Photoroom](https://www.photoroom.com/api)
2. Get your API key from the dashboard
3. Add to `.env` file:
   ```
   PHOTOROOM_API_KEY=your-api-key-here
   ```

### 2. API Endpoint
The background removal is handled by `/api/remove-background` which:
- Validates authentication
- Checks file type and size
- Calls Photoroom API
- Returns processed image

## Usage

1. **Upload Image**
   - Drag & drop or click to browse
   - Select JPG, PNG, or WEBP file (max 10MB)

2. **Remove Background**
   - Click "Remove Background" button
   - AI processes the image (usually 2-5 seconds)

3. **Download Result**
   - Preview the result with transparent background
   - Click "Download Image" to save

## Photoroom API Integration

### Basic Request
```typescript
const formData = new FormData();
formData.append('image_file', imageFile);

const response = await fetch('https://sdk.photoroom.com/v1/segment', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
  },
  body: formData,
});
```

### Response
- Success: Returns PNG image with transparent background
- Error codes:
  - 401: Invalid API key
  - 402: Quota exceeded
  - 400: Invalid request

## Advanced Features (Available)

### Background Color
Add a solid color background instead of transparent:
```typescript
formData.append('bg_color', 'ffffff'); // White background
```

### Image Size
Control output dimensions:
```typescript
formData.append('size', 'preview'); // Options: preview, medium, full
```

### Crop
Auto-crop to subject:
```typescript
formData.append('crop', 'true');
```

### Format
Choose output format:
```typescript
formData.append('format', 'png'); // Options: png, jpg
```

## Pricing
Photoroom API pricing (as of 2024):
- **Free**: 25 images/month
- **Basic**: $9/month - 500 images
- **Pro**: $29/month - 2,000 images
- **Enterprise**: Custom pricing

## Error Handling
The tool handles various errors:
- Invalid file type
- File too large
- API quota exceeded
- Network errors
- Invalid API key

## UI Components
- **Upload Zone**: Drag & drop with file validation
- **Preview**: Shows original image with file info
- **Result**: Displays processed image with checkered background
- **Download**: One-click download with custom filename

## Technical Stack
- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, HugeIcons
- **File Upload**: react-dropzone
- **API**: Photoroom Remove Background API
- **Auth**: NextAuth.js

## Future Enhancements
- [ ] Batch processing
- [ ] Background color picker
- [ ] Image editing tools
- [ ] History of processed images
- [ ] Credit system integration
- [ ] Custom background images
- [ ] Image quality settings

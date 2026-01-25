# Lipedema Platform API Server

Simple FastAPI server for the Lipedema Authority Platform admin interface.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install fastapi uvicorn
```

### 2. Start the Server
```bash
python simple_server.py
```

The server will start on `http://localhost:8001`

### 3. Access the API
- **API Documentation**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/health

## 📡 API Endpoints

### GET `/source/instagram_posts`
Get lightweight list of all Instagram posts from source data.

**Response:**
```json
[
  {
    "id": "3564205224647314415",
    "title": "\"מזון על\" זאת שיטת שיווק שמגלגלת המון כסף...",
    "image_url": "https://scontent-mia3-2.cdninstagram.com/...",
    "date": "09/02/2025",
    "likes": 42,
    "category": "nutrition",
    "content": "Full post content..."
  }
]
```

### POST `/drafts/create/{post_id}`
Create a draft from a specific Instagram post ID.

**Response:**
```json
{
  "id": "post_id",
  "title_draft": "Generated article title",
  "markdown_content": "Generated article content...",
  "image_prompt": "Generated DALL-E prompt...",
  "original_image": "Original Instagram image URL"
}
```

## 🔧 Configuration

### Data Source
The server reads Instagram posts from:
```
lipedema_upload/site_content_db.json
```

### Server Configuration
- **Host**: `0.0.0.0`
- **Port**: `8001` (changed from 8000 to avoid conflicts)
- **CORS**: Enabled for all origins (development only)

## 🎯 Usage with Frontend

The API is designed to work with the Next.js admin interface at:
```
http://localhost:3000/admin/editor
```

### Workflow:
1. Frontend fetches posts from `/source/instagram_posts`
2. User selects a post to convert
3. Frontend calls `/drafts/create/{post_id}` to generate article
4. User can edit and save the generated content

## 🧪 Testing

### Test the API endpoints:
```bash
python test_simple_server.py
```

### Manual testing:
```bash
# Get all posts
curl "http://localhost:8001/source/instagram_posts"

# Create draft from specific post
curl -X POST "http://localhost:8001/drafts/create/3564205224647314415"
```

## 📁 Project Structure

```
.
├── simple_server.py           # Main API server
├── test_simple_server.py      # Test script
├── lipedema_upload/
│   └── site_content_db.json   # Instagram posts data
└── lipedema-platform/         # Next.js frontend
    └── src/app/admin/editor/  # Admin interface
```

## 🔒 Security Notes

This is a development server. For production:
- Configure CORS properly
- Add authentication
- Use environment variables
- Implement rate limiting
- Use HTTPS

## 📝 Features

✅ **Simple Instagram Post Listing**  
✅ **Draft Creation from Posts**  
✅ **CORS Enabled for Development**  
✅ **FastAPI Auto-Documentation**  
✅ **Hebrew Content Support**  
✅ **Clean JSON Responses**
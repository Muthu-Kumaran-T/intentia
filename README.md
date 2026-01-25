# Intentia - AI-Powered Intent-Based Social Networking System 🎯

An intelligent social networking platform that revolutionizes user interaction by allowing intent-based content discovery. Unlike traditional social media that displays mixed and overwhelming content, Intentia lets users select their specific intent (e.g., discovering movies, sharing thoughts) and delivers only relevant, category-specific content, creating a focused, non-addictive experience.

## 🌟 Overview

Intentia addresses the core problems of modern social media:
- **Information Overload**: Eliminates endless scrolling through irrelevant content
- **Distraction**: Provides focused, intent-driven experiences
- **Addictive Behavior**: Reduces dopamine-driven infinite scrolling
- **Poor User Experience**: Delivers only what users actually want to see

By leveraging lightweight AI techniques including intent detection, basic text analysis, and rule-based content classification, Intentia creates a safer, clearer, and more controlled social networking environment.

## ✨ Key Features

### 🎯 Intent-Based Content Discovery
- **Select Your Intent**: Choose what you want to do before browsing (discover movies, share thoughts, learn, etc.)
- **Relevant Feed**: See only content matching your selected intent
- **Category-Specific**: No mixed content - stay focused on your purpose

### 🔐 Secure Authentication
- **Two-Factor Authentication (2FA)**: TOTP-based security with Google Authenticator
- **Secure Login/Registration**: Protected user accounts with JWT tokens
- **User Onboarding**: Guided setup process for new users

### 🤖 AI-Powered Features
- **Intent Detection**: Automatically understands user goals
- **Content Classification**: Rule-based categorization of posts
- **Smart Feed Generation**: AI-driven content delivery based on intent
- **Text Analysis**: Basic NLP for content understanding
- **Content Moderation**: Automated filtering for safe experiences

### 🎨 Modern User Experience
- **Clean Interface**: Distraction-free design with Tailwind CSS
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Responsive Design**: Works seamlessly across all devices
- **User Control**: Complete control over content preferences

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for dynamic interfaces
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database for scalable data storage
- **Mongoose** - MongoDB object modeling

### Security & Authentication
- **JWT (JSON Web Tokens)** - Secure authentication
- **Speakeasy** - TOTP generation for 2FA
- **QRCode** - QR code generation for authenticator setup
- **bcrypt** - Password hashing

### AI & Content Processing
- **Intent Detection Engine** - Custom lightweight AI for understanding user goals
- **Rule-Based Classifier** - Content categorization system
- **Text Analysis** - Basic NLP for content understanding

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or Atlas cloud)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Muthu-Kumaran-T/intentia.git
cd intentia
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env` with your credentials:**

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/intentia

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# JWT Expiration
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Start the backend server:**

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `PORT` | Backend server port | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `JWT_EXPIRE` | JWT token expiration time | ✅ Yes |
| `CLIENT_URL` | Frontend URL for CORS | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ⚠️ Optional* |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ⚠️ Optional* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ⚠️ Optional* |

*Optional if not using image upload features

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API base URL | ✅ Yes |

## 📝 How to Generate Secure Secrets

### Generate JWT Secret:

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

## 🗄️ Database Setup

### Local MongoDB:
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

### MongoDB Atlas (Cloud):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Get connection string
4. Update `MONGO_URI` in `.env`

Example Atlas URI:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/intentia?retryWrites=true&w=majority
```

## 🎯 How Intentia Works

### 1. Intent Selection
When users open Intentia, they first select their intent:
- 🎬 **Discover Movies** - Find and discuss films
- 💭 **Share Thoughts** - Express ideas and opinions
- 📚 **Learn Something** - Educational content
- 🎮 **Gaming** - Gaming-related posts
- 🍳 **Food & Recipes** - Culinary content
- ✈️ **Travel** - Travel experiences and tips
- *...and more*

### 2. AI-Powered Content Filtering
Based on the selected intent, the AI system:
- Analyzes user's intent using lightweight ML models
- Classifies content using rule-based algorithms
- Generates a personalized feed with only relevant posts
- Filters out unrelated or distracting content

### 3. Focused Experience
Users enjoy:
- No algorithmic addiction tactics
- No endless scrolling
- No irrelevant advertisements
- Complete control over their experience

## 📱 Setting Up 2FA

1. **Register** a new account
2. **Scan QR Code** with Google Authenticator app
   - Download: [iOS](https://apps.apple.com/app/google-authenticator/id388497605) | [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
3. **Enter 6-digit code** from the app
4. **Complete onboarding** process

## 🏗️ Project Structure

```
intentia/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers & business logic
│   ├── middleware/      # Auth middleware & validators
│   ├── models/          # MongoDB schemas (User, Post, Intent)
│   ├── routes/          # API endpoints
│   ├── services/        # AI services (intent detection, classification)
│   ├── utils/           # Helper functions
│   ├── .env             # Backend environment variables (not in git)
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Login, Dashboard, Feed)
│   │   ├── services/    # API service layer
│   │   ├── utils/       # Helper functions
│   │   ├── App.js       # Main app component with routing
│   │   └── index.js     # React entry point
│   └── .env             # Frontend environment variables (not in git)
│
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

## 🚦 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon (hot reload)
npm start        # Start production server
```

### Frontend
```bash
npm start        # Start development server (http://localhost:3000)
npm build        # Create optimized production build
npm test         # Run tests
```

## 🔒 Security Best Practices

- ✅ Never commit `.env` files to Git
- ✅ Use strong, random JWT secrets (32+ characters)
- ✅ Rotate API credentials regularly
- ✅ Use different credentials for development and production
- ✅ Enable MongoDB authentication in production
- ✅ Use HTTPS in production environments
- ✅ Implement rate limiting on API endpoints
- ✅ Validate and sanitize all user inputs

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check if MongoDB is running: `mongod --version`
- Verify `MONGO_URI` in `.env` is correct
- Check network connectivity (for MongoDB Atlas)
- Ensure firewall allows MongoDB connections

### CORS Error
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check backend CORS configuration in `server.js`
- Clear browser cache and restart both servers

### 2FA QR Code Not Displaying
- Check backend is running on correct port
- Verify API URL in frontend `.env`
- Check browser console for errors
- Ensure QR code generation libraries are installed

## 🎓 Research & Development

Intentia was developed as a research project to explore:
- Intent-based user interfaces in social media
- Lightweight AI for content classification
- Non-addictive social networking design
- User-controlled content delivery systems

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Muthu Kumaran T**
- GitHub: [@Muthu-Kumaran-T](https://github.com/Muthu-Kumaran-T)

## 🙏 Acknowledgments

- Google Authenticator for 2FA implementation
- Tailwind CSS for modern styling framework
- Framer Motion for smooth animations
- MongoDB for scalable database solution
- OpenAI and AI research community for inspiration on intent detection

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: muthukumaranthilagar@gmail.com

---

**⚠️ Important Security Note:** This is a development version. Before deploying to production:
- Replace all placeholder credentials
- Enable MongoDB authentication
- Set up SSL/TLS certificates
- Configure production-grade security headers
- Implement proper logging and monitoring
- Set up automated backups

**Built with ❤️ to make social media better, one intent at a time.**
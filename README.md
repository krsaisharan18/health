# SwasthyaTrack - Personal Health & Fitness Dashboard

A comprehensive full-stack health and fitness tracking application designed specifically for Indian lifestyles, featuring regional food databases, cultural context, and multi-language support.

## 🌟 Features

### Core Functionality
- **User Authentication**: JWT-based secure signup/login system
- **Health Tracking**: Steps, workouts, water intake, meals, and sleep monitoring
- **Indian Food Database**: 500+ regional dishes with accurate nutritional data
- **Cultural Context**: Fitness insights with Indian geographical and cultural references
- **Multi-language Support**: English and Hindi with more languages coming
- **Healthcare Professional Portal**: Separate login for doctors and trainers

### Advanced Features
- **AI-Powered Insights**: Personalized recommendations based on lifestyle
- **Visual Analytics**: Interactive charts and progress tracking
- **BMI & BMR Calculator**: Health metrics with Indian standards
- **Voice Input**: Log meals by speaking in English or Hindi
- **Export Reports**: PDF/CSV reports for healthcare professionals
- **Push Notifications**: Water, exercise, and sleep reminders
- **Gamification**: Streaks, achievements, and motivational challenges

### Indian-Specific Features
- **Regional Cuisine**: Support for all Indian regional foods
- **Vegetarian/Vegan Focus**: Comprehensive plant-based nutrition tracking
- **Traditional Wellness**: Yoga, Pranayama, and Ayurvedic principles
- **Cultural Fitness Context**: "You walked from Mumbai to Pune!" style motivations
- **Festival & Seasonal Adjustments**: Special tracking during Indian festivals

## 🚀 Tech Stack

### Frontend
- **HTML5** with semantic markup
- **TailwindCSS** for responsive design
- **Vanilla JavaScript (ES6)** with modular architecture
- **Chart.js** for data visualization
- **Lucide Icons** for UI icons
- **PWA** capabilities for offline access

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt password hashing
- **RESTful API** design
- **Rate limiting** and security middleware
- **File upload** support for profile images

### Additional Services
- **Email Integration**: Nodemailer for notifications
- **API Integration Ready**: Google Fit, Apple Health compatibility
- **Voice Recognition**: Web Speech API integration
- **PDF Generation**: Report export functionality

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)
- **Desktop** (1024px and up)
- **Large screens** (1280px and up)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd swasthyatrack
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

### Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/swasthyatrack
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# API Keys (Optional)
GOOGLE_FIT_API_KEY=your_google_fit_api_key
NUTRITION_API_KEY=your_nutrition_api_key
```

## 🏗️ Project Structure

```
swasthyatrack/
├── components/
│   ├── navbar.html           # Navigation component
│   ├── footer.html          # Footer component
│   └── badge.html           # Attribution badge
├── scripts/
│   ├── components/
│   │   └── loader.js        # Component loader utility
│   ├── utils/
│   │   └── api.js           # API utility functions
│   ├── home.js              # Homepage functionality
│   ├── dashboard.js         # Dashboard functionality
│   ├── signup.js            # User registration
│   └── login.js             # User authentication
├── models/
│   ├── User.js              # User data model
│   └── HealthLog.js         # Health tracking model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── health.js            # Health data routes
├── middleware/
│   └── auth.js              # JWT middleware
├── config/
│   └── database.js          # Database configuration
├── index.html               # Landing page
├── dashboard.html           # Main dashboard
├── signup.html              # User registration
├── login.html               # User login
├── server.js                # Express server
└── package.json             # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Health Data
- `GET /api/health/dashboard` - Get dashboard data
- `POST /api/health/steps` - Log daily steps
- `POST /api/health/water` - Log water intake
- `POST /api/health/meals` - Log meals
- `POST /api/health/sleep` - Log sleep data
- `GET /api/health/reports` - Generate health reports

### Food Database
- `GET /api/food/search` - Search Indian foods
- `GET /api/food/categories` - Get food categories
- `GET /api/food/nutrition/:id` - Get nutrition info

## 🎯 Key Features Implementation

### Indian Food Database
- 500+ regional dishes with accurate nutritional data
- Support for all major Indian cuisines
- Vegetarian/vegan categorization
- Portion size adjustments for Indian eating habits

### Cultural Context
- Distance comparisons using Indian landmarks
- Motivational messages with cultural relevance
- Festival and seasonal health adjustments
- Traditional wellness integration

### Multi-language Support
- English and Hindi interface
- Voice input in multiple languages
- Cultural context in local languages
- Regional terminology support

## 📊 Sample Data

### Demo User Credentials
- **Email**: demo@swasthyatrack.com
- **Password**: demo123
- **Role**: Regular User

### Doctor Demo Credentials
- **Email**: doctor@swasthyatrack.com
- **Password**: doctor123
- **Role**: Healthcare Professional

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Security headers with helmet.js

## 🚀 Deployment

### Production Deployment

1. **Build for production**
```bash
npm run build
```

2. **Deploy to cloud platforms**
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **DigitalOcean**: Use App Platform
- **AWS**: Use Elastic Beanstalk

3. **Database deployment**
- **MongoDB Atlas**: Cloud MongoDB hosting
- **AWS DocumentDB**: Managed MongoDB service

## 📈 Performance Optimization

- Lazy loading for images and components
- API response caching
- Database query optimization
- Minified assets for production
- CDN integration ready
- Service worker for offline functionality

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@swasthyatrack.com
- Documentation: [docs.swasthyatrack.com](https://docs.swasthyatrack.com)

## 🎉 Acknowledgments

- Indian food nutritional data from various government sources
- Cultural insights from health and wellness experts
- Community feedback from beta users across India
- Open source libraries and frameworks used in this project

---

**SwasthyaTrack** - Empowering Indians to live healthier lives with technology that understands our culture, food, and lifestyle. 🇮🇳💪
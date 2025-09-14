# MockAI - Master Your Job Interviews

![MockAI Preview](project-preview.png)

Your AI-powered interview companion that helps you prepare, practice, and excel in any job interview with personalized guidance and real-time feedback.

## 🚀 Features

- **AI-Powered Interview Practice**: Get realistic interview scenarios tailored to your role
- **Resume Analysis**: Upload your PDF resume for personalized interview questions
- **Real-time Feedback**: Receive instant feedback on your responses
- **Session Management**: Track your practice sessions and progress
- **Secure Authentication**: JWT-based authentication with multiple providers
- **Modern UI**: Beautiful, responsive interface with terminal-inspired design

## 🏗️ Architecture

This project consists of two main components:

### Backend API (`mockai-api`)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **File Processing**: PDF parsing for resume analysis
- **API Documentation**: RESTful endpoints

### Frontend App (`mockai-app`)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Graphics**: Custom terminal background with WebGL effects
- **TypeScript**: Full type safety throughout

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MockAI
```

### 2. Backend Setup
```bash
cd mockai-api
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 3. Frontend Setup
```bash
cd mockai-app
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3001`

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mockaidb"
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Sessions
- `GET /session` - Get user sessions
- `POST /session` - Create new session with resume upload
- `GET /session/:id` - Get specific session

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile

## 🗄️ Database Schema

### User Model
- Authentication with multiple providers (local, OAuth)
- Role-based access control
- Secure password hashing

### Session Model
- Interview session tracking
- Resume text storage
- Job description matching
- Timestamps for progress tracking

## 🎨 UI Features

- **Terminal Animation**: Custom WebGL-powered terminal background
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: Radix UI for accessibility and consistency
- **Smooth Animations**: CSS animations and transitions
- **Dark Theme**: Professional dark mode interface

## 🧪 Testing

### Backend Tests
```bash
cd mockai-api
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
cd mockai-app
npm run lint          # ESLint checks
```

## 📦 Production Build

### Backend
```bash
cd mockai-api
npm run build
npm run start:prod
```

### Frontend
```bash
cd mockai-app
npm run build
npm start
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using NestJS, Next.js, and modern web technologies**
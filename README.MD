## Setup Instructions

1. **Create Project Structure**
   ```bash
   mkdir voting-system
   cd voting-system
   mkdir -p frontend/src/{components,services}
   mkdir -p backend/src/{models,routes,middleware,services,config,scripts}
   ```

2. **Copy Files**
    - Copy all the code blocks above into their respective files
    - Make sure file paths match the structure shown

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
    - Create `.env` files in both backend and frontend directories
    - Update the environment variables as needed

5. **Docker Deployment**
   ```bash
   # From project root
   docker-compose up --build

   # Seed the database
   docker-compose exec backend npm run seed
   ```

6. **Access Application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5000
    - Admin: admin@example.com / admin123

---

## Key Features

- ✅ Email verification voting system
- ✅ Admin panel with 20x vote weight
- ✅ Real-time vote tracking
- ✅ Responsive design with Tailwind CSS
- ✅ Docker containerization
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ Rate limiting and security
- ✅ Error handling and validation
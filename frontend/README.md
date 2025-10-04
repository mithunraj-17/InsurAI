# JobSelect Pro - Frontend

A professional React frontend for the job selection application with user authentication.

## Features

- **User Authentication**: Login, Register, Email Verification
- **Password Management**: Forgot password and reset functionality
- **Professional UI**: Modern, responsive design
- **Dashboard**: Job selection and agent scheduling interface
- **Voice Support Ready**: Prepared for voice recognition integration

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Project Structure

```
src/
├── components/
│   ├── Login.jsx          # User login form
│   ├── Register.jsx       # User registration form
│   ├── Dashboard.jsx      # Main dashboard
│   ├── ForgotPassword.jsx # Password reset request
│   └── ResetPassword.jsx  # Password reset form
├── App.jsx               # Main app with routing
├── App.css              # Application styles
├── index.css            # Base styles
└── main.jsx             # App entry point
```

## API Integration

The frontend connects to the Spring Boot backend at `http://localhost:8080/api/auth/` for:
- User registration
- User login
- Email verification
- Password reset

## Technologies Used

- React 19
- React Router DOM
- Axios for API calls
- Modern CSS with Flexbox/Grid
- Responsive design

## Next Steps

1. Start the backend server (Spring Boot)
2. Configure email settings in backend
3. Run `npm install` and `npm run dev`
4. Access the application at http://localhost:3000
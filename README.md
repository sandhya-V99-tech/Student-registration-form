# Student Registration Form

A modern, responsive student registration system built with Node.js, Express, and a file-based JSON database.

## Features

### 🎨 Frontend
- **Modern UI Design**: Gradient background with rounded card layout
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Interactive Elements**: Smooth hover effects and transitions
- **Icon Integration**: Font Awesome icons inside input fields
- **Section-wise Grouping**: Organized form sections for better UX
- **Eye Toggle**: Password visibility toggle for both password fields
- **Loading States**: Visual feedback during form submission
- **Success Modal**: Beautiful popup after successful registration

### 📝 Form Fields

#### 👤 Personal Details
- Full Name *
- Date of Birth
- Gender (Male / Female / Other)
- Blood Group
- Nationality

#### 📞 Contact Details
- Email *
- Phone Number *
- Alternate Phone Number
- Address
- City
- State
- PIN Code

#### 🎓 Academic Details
- Course *
- Branch / Department *
- Year of Study *
- College Name *
- Roll Number *

#### 🔐 Account Details
- Password *
- Confirm Password *

### ✅ Validations
- Required field validation
- Email format checking
- Phone number validation (10 digits)
- PIN code validation (6 digits)
- Password length validation (minimum 6 characters)
- Password match confirmation
- Real-time inline error messages

### ⚙️ Backend
- **Node.js + Express**: RESTful API server
- **bcrypt**: Secure password hashing
- **JSON File Database**: Simple file-based storage
- **Duplicate Prevention**: Email uniqueness validation
- **Error Handling**: Comprehensive error responses

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: JSON file (students.json)
- **Security**: bcrypt for password hashing
- **Icons**: Font Awesome
- **Styling**: Custom CSS with gradients and animations

## Installation

1. Clone or download the project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### POST /register-student
Registers a new student with all the provided details.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "dob": "2000-01-01",
  "gender": "male",
  "bloodGroup": "A+",
  "nationality": "Indian",
  "email": "john@example.com",
  "phone": "1234567890",
  "altPhone": "0987654321",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400001",
  "course": "B.Tech",
  "branch": "Computer Science",
  "year": "3",
  "college": "IIT Bombay",
  "rollNumber": "CS2023001",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student registered successfully!",
  "student": {
    "id": "unique_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET /students
Retrieves all registered students (passwords excluded).

## Database Structure

The `students.json` file stores student records with the following structure:

```json
[
  {
    "id": "unique_id",
    "fullName": "John Doe",
    "dob": "2000-01-01",
    "gender": "male",
    "bloodGroup": "A+",
    "nationality": "Indian",
    "email": "john@example.com",
    "phone": "1234567890",
    "altPhone": "0987654321",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001",
    "course": "B.Tech",
    "branch": "Computer Science",
    "year": "3",
    "college": "IIT Bombay",
    "rollNumber": "CS2023001",
    "password": "hashed_password",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Project Structure

```
registration-form/
├── package.json          # Project dependencies and scripts
├── server.js            # Express server and API endpoints
├── students.json        # Database file (auto-created)
├── public/              # Frontend files
│   ├── index.html       # Main registration form
│   ├── styles.css       # Styling and responsive design
│   └── script.js        # Form validation and interactions
└── README.md           # Project documentation
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- Input validation and sanitization
- SQL injection prevention (JSON file storage)
- XSS protection through input validation
- Email uniqueness enforcement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

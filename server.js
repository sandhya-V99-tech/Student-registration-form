const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'students.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database file if it doesn't exist
async function initializeDB() {
  try {
    await fs.access(DB_FILE);
  } catch (error) {
    await fs.writeFile(DB_FILE, JSON.stringify([], null, 2));
  }
}

// Read students from JSON file
async function readStudents() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write students to JSON file
async function writeStudents(students) {
  await fs.writeFile(DB_FILE, JSON.stringify(students, null, 2));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Registration endpoint
app.post('/register-student', async (req, res) => {
  try {
    const {
      fullName, dob, gender, bloodGroup, nationality,
      email, phone, altPhone, address, city, state, pinCode,
      course, branch, year, college, rollNumber, password
    } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name, email, and password are required' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number must be 10 digits' 
      });
    }

    // PIN code validation
    const pinRegex = /^[0-9]{6}$/;
    if (pinCode && !pinRegex.test(pinCode)) {
      return res.status(400).json({ 
        success: false, 
        message: 'PIN code must be 6 digits' 
      });
    }

    // Read existing students
    const students = await readStudents();

    // Check for duplicate email
    const existingStudent = students.find(student => student.email === email);
    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const newStudent = {
      id: generateId(),
      fullName,
      dob,
      gender,
      bloodGroup,
      nationality,
      email,
      phone,
      altPhone,
      address,
      city,
      state,
      pinCode,
      course,
      branch,
      year,
      college,
      rollNumber,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Add to database
    students.push(newStudent);
    await writeStudents(students);

    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully!',
      student: {
        id: newStudent.id,
        fullName: newStudent.fullName,
        email: newStudent.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all students (for testing)
app.get('/students', async (req, res) => {
  try {
    const students = await readStudents();
    // Remove passwords from response
    const studentsWithoutPasswords = students.map(student => {
      const { password, ...studentWithoutPassword } = student;
      return studentWithoutPassword;
    });
    res.json({ success: true, students: studentsWithoutPasswords });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
});

// Initialize database and start server
async function startServer() {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

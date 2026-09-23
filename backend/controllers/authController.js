const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const generateToken = require('../utils/generateToken');

// Register a new user (Student/Teacher sign up themselves using their Roll Number / Employee ID)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, rollNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    let linkedTeacher = null;
    let linkedStudent = null;

    if (role === 'Teacher') {
      if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });
      const teacher = await Teacher.findOne({ employeeId });
      if (!teacher) return res.status(404).json({ error: 'No teacher record found with that Employee ID. Ask your admin to add you first.' });
      linkedTeacher = teacher._id;
    }

    if (role === 'Student') {
      if (!rollNumber) return res.status(400).json({ error: 'Roll number is required' });
      const student = await Student.findOne({ rollNumber });
      if (!student) return res.status(404).json({ error: 'No student record found with that Roll Number. Ask your admin to add you first.' });
      linkedStudent = student._id;
    }

    const user = await User.create({ name, email, password, role, linkedTeacher, linkedStudent });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Login existing user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get currently logged-in user's own profile (tests that the token works)
exports.getMe = async (req, res) => {
  res.json(req.user);
};
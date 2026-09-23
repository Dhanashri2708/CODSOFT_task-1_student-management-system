const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // lets Express read JSON sent in requests

app.get('/', (req, res) => {
  res.send('School Management API is running');
});


const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teachers', teacherRoutes);

const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);

const examRoutes = require('./routes/examRoutes');
app.use('/api/exams', examRoutes);

const resultRoutes = require('./routes/resultRoutes');
app.use('/api/results', resultRoutes);

const feeRoutes = require('./routes/feeRoutes');
app.use('/api/fees', feeRoutes);

const academicRecordRoutes = require('./routes/academicRecordRoutes');
app.use('/api/academic-records', academicRecordRoutes);
//for post created ip access list 

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
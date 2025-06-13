const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authenticate = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/master/superAdminRoutes');
const superAdminUserRoutes = require('./routes/superadmin/userRoutes');
const referralRoutes = require('./routes/superadmin/referralRoutes');
const bankRoutes = require('./routes/superadmin/bankRoutes');
const userRoutes = require('./routes/master/userRoutes');
const masterBankRoutes = require('./routes/master/bankRoutes');
const projectRoutes = require('./routes/user/projectRoutes');

app.use('/api', authRoutes);
app.use('/api/master/superadmins', authenticate('master'), superAdminRoutes);
app.use(
  '/api/superadmin/users',
  authenticate('superadmin'),
  superAdminUserRoutes
);
app.use('/api/master/users', authenticate('master'), userRoutes);
app.use('/api/master/banks', masterBankRoutes);
app.use('/api/superadmin/referral', authenticate('superadmin'), referralRoutes);
app.use('/api/banks', authenticate(), bankRoutes);
app.use('/api/user/projects', projectRoutes);
app.use('/api/master/plans', require('./routes/master/planRoutes'));
app.use('/api/master/commissions', require('./routes/master/commissionRoutes'));
app.use(
  '/api/superadmin/commissions',
  require('./routes/superadmin/commissionRoutes')
);
app.use(
  '/api/user/project-inputs',
  require('./routes/user/projectInputRoutes')
);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

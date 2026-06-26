const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = require('../db');

// REGISTER
router.post('/register', async (req, res, next) => {
try {
const { email, password } = req.body;

const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
data: {
email,
password: hashedPassword
}
});

res.status(201).json({
message: 'Register berhasil',
user
});

} catch (err) {
next(err);
}
});

// LOGIN
router.post('/login', async (req, res, next) => {
try {
const { email, password } = req.body;

const user = await prisma.user.findUnique({
where: { email }
});

if (!user) {
return res.status(401).json({
error: 'User tidak ditemukan'
});
}

const valid = await bcrypt.compare(
password,
user.password
);

if (!valid) {
return res.status(401).json({
error: 'Password salah'
});
}

const token = jwt.sign(
{
id: user.id,
role: user.role
},
process.env.JWT_SECRET,
{
expiresIn: '1h'
}
);

res.json({
message: 'Login berhasil',
token
});

} catch (err) {
next(err);
}
});

module.exports = router;
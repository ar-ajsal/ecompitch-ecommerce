const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect('mongodb+srv://ecompitch16_db_user:ajsal@ecompitch.9gfji7g.mongodb.net/ecompitch?retryWrites=true&w=majority');
    
    let admin = await User.findOne({ email: 'admin@bharatbazaar.com' });
    if (admin) {
      console.log('Admin already exists!');
    } else {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@bharatbazaar.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin created successfully!');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();

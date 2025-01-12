import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';

export const signup = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Debugging input data
    const { name, email, password, phone } = req.body;
    
    console.log('Signup Data:', req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, password: hashedPassword, phone });
    // await customer.save();
    // res.status(201).json({ message: 'Customer created successfully' });
    const savedCustomer = await customer.save();
    console.log('Customer Saved:', savedCustomer);

    const token = jwt.sign({ id: savedCustomer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json(
      {
        token,
        user: {
          id: savedCustomer._id,
          name: savedCustomer.name,
          email:savedCustomer.email,
        },
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: 'Invalid email or password' });
    
    const validPassword = await bcrypt.compare(password, customer.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });
    
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET);
    res.json({ token, user :{
      customerId: customer._id,
      name: customer.name,
      email: customer.email,} 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
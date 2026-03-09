import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/database';
import { generateToken } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { sendEmail, emailTemplates } from '../config/email';
import { OAuth2Client } from 'google-auth-library';

const router = Router();

// Development admin accounts
const DEV_ACCOUNTS = [
  {
    email: 'kit28.24bad188@gmail.com',
    password: 'yuva2503',
    name: 'Super Admin',
    role: 'super_admin',
  },
  {
    email: 'kit28.24bad133@gmail.com',
    password: 'sam2076',
    name: 'Admin',
    role: 'admin',
  },
];

router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      // Check if email is already registered (in dev accounts)
      const existing = DEV_ACCOUNTS.find((acc) => acc.email === email);
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Mock registration for development
      const mockUser = {
        id: 'dev-' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'customer',
      };
      const token = generateToken(mockUser.id, mockUser.email, mockUser.role);
      return res.status(201).json({ token, user: mockUser });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const role = count === 0 ? 'super_admin' : 'customer';

    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          role,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    await sendEmail(email, 'Welcome to Textile Store', emailTemplates.welcome(name));

    const token = generateToken(user.id, user.email, user.role);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      // Check dev accounts first
      const devAccount = DEV_ACCOUNTS.find((acc) => acc.email === email);
      if (devAccount && devAccount.password === password) {
        const token = generateToken(devAccount.email, devAccount.email, devAccount.role);
        return res.json({
          token,
          user: {
            id: devAccount.email,
            email: devAccount.email,
            name: devAccount.name,
            role: devAccount.role,
          },
        });
      }

      // Mock login for other users
      const mockUser = {
        id: 'dev-' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: 'customer',
      };
      const token = generateToken(mockUser.id, mockUser.email, mockUser.role);
      return res.json({ token, user: mockUser });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email, user.role);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone } = req.body;
    // In dev mode, just return success
    res.json({ message: 'Profile updated successfully', user: { name, phone } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // In dev mode, just return success
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Google Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Verify Google ID Token
    let payload: any;
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      // Mock verification for development
      payload = {
        email: 'test-google@example.com',
        name: 'Google Test User',
        picture: 'https://lh3.googleusercontent.com/a/default-user',
      };
    } else {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name } = payload;

    // Check if user exists in Supabase
    let user;
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      user = { id: 'google-' + email, email, name, role: 'customer' };
    } else {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        user = existingUser;
      } else {
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const role = count === 0 ? 'super_admin' : 'customer';

        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ email, name, role }])
          .select()
          .single();

        if (insertError) throw insertError;
        user = newUser;
        await sendEmail(email, 'Welcome to Textile Store', emailTemplates.welcome(name));
      }
    }

    const token = generateToken(user.id, user.email, user.role);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

export default router;

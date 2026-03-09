# Admin Account Setup

## Super Admin Account
- **Email**: kit28.24bad188@gmail.com
- **Password**: yuva2503

## Admin Account
- **Email**: kit28.24bad133@gmail.com
- **Password**: sam2076

## How to Use

### 1. Login as Super Admin
1. Go to http://localhost:3000/login
2. Enter email: `kit28.24bad188@gmail.com`
3. Enter password: `yuva2503`
4. Click Login
5. You'll be redirected to the admin dashboard

### 2. Login as Admin
1. Go to http://localhost:3000/login
2. Enter email: `kit28.24bad133@gmail.com`
3. Enter password: `sam2076`
4. Click Login
5. You'll have access to admin features

## Admin Features Available

### Super Admin Can:
- ✅ View admin dashboard
- ✅ Manage products (add, edit, delete)
- ✅ View all orders
- ✅ View all customers
- ✅ Check inventory
- ✅ Create new admin accounts
- ✅ Access all platform features

### Admin Can:
- ✅ View admin dashboard
- ✅ Manage products (add, edit, delete)
- ✅ View all orders
- ✅ View all customers
- ✅ Check inventory
- ✅ Cannot create admin accounts

## Testing the Admin Panel

### Step 1: Login
1. Open http://localhost:3000/login
2. Use super admin credentials above
3. Click Login

### Step 2: Access Admin Dashboard
1. After login, click "Admin" in the header
2. You'll see the admin dashboard with stats

### Step 3: Manage Products
1. Go to Admin → Product Management
2. Click "Add Product"
3. Fill in product details:
   - Name: "Test Fabric"
   - Description: "Test description"
   - Price: 299.99
   - Fabric Type: Cotton
   - Stock: 50
4. Click "Add Product"

### Step 4: View Orders
1. Go to Admin → Order Management
2. See all customer orders

### Step 5: View Customers
1. Go to Admin → Customer Management
2. See all registered customers

### Step 6: Check Inventory
1. Go to Admin → Inventory
2. See stock levels and low stock alerts

## Development Mode Notes

Currently using **mock data** for development:
- All data is in-memory (not persisted)
- Refresh page will reset data
- Perfect for testing UI and workflows

## Switch to Real Database

To use real Supabase database:

1. **Get Supabase Credentials**
   - Go to supabase.com
   - Create project
   - Get Project URL and API Key

2. **Update backend/.env**
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_KEY=your_api_key
   ```

3. **Import Database Schema**
   - Go to Supabase SQL Editor
   - Create new query
   - Copy content from DATABASE_SCHEMA.sql
   - Execute

4. **Create Admin Accounts in Database**
   ```sql
   INSERT INTO users (email, password, name, role) VALUES
   ('kit28.24bad188@gmail.com', '$2a$10$...', 'Super Admin', 'super_admin'),
   ('kit28.24bad133@gmail.com', '$2a$10$...', 'Admin', 'admin');
   ```

5. **Restart Backend**
   - Backend will auto-detect real credentials
   - Switch from mock data to real database

## Troubleshooting

### Can't login?
- Make sure you're using exact email and password
- Check browser console for errors
- Verify backend is running on port 5000

### Admin features not showing?
- Make sure you're logged in as admin/super_admin
- Check user role in browser console
- Refresh page

### Products not saving?
- Currently using mock data (in-memory)
- Data resets on page refresh
- Set up real Supabase to persist data

## Next Steps

1. ✅ Test admin login
2. ✅ Explore admin dashboard
3. ✅ Try adding products
4. ✅ Test order management
5. ✅ Set up real Supabase database
6. ✅ Deploy to production

---

**Admin accounts are ready to use! 🎉**

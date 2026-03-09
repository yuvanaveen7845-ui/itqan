# Quick Login Guide

## 🚀 Access the Platform

**Frontend URL**: http://localhost:3000

---

## 👤 Login Credentials

### Super Admin Account
```
Email: kit28.24bad188@gmail.com
Password: yuva2503
Role: super_admin
```

### Admin Account
```
Email: kit28.24bad133@gmail.com
Password: sam2076
Role: admin
```

### Customer Account (Any)
```
Email: any@example.com
Password: any_password
Role: customer
```

---

## 📋 Step-by-Step Login

### 1. Go to Login Page
- Open http://localhost:3000/login

### 2. Enter Credentials
- **Super Admin**: kit28.24bad188@gmail.com / yuva2503
- **Admin**: kit28.24bad133@gmail.com / sam2076
- **Customer**: any email / any password

### 3. Click Login
- You'll be authenticated and redirected

### 4. Access Features
- **Super Admin**: Full access to everything
- **Admin**: Can manage products, orders, customers, inventory
- **Customer**: Can browse, shop, checkout

---

## 🎯 What You Can Do

### As Super Admin
✅ View admin dashboard with analytics  
✅ Manage all products (add, edit, delete)  
✅ View all orders and update status  
✅ View all customers  
✅ Check inventory and stock levels  
✅ Create new admin accounts  
✅ Access all platform features  

### As Admin
✅ View admin dashboard  
✅ Manage products  
✅ View orders  
✅ View customers  
✅ Check inventory  
❌ Cannot create admin accounts  

### As Customer
✅ Browse products  
✅ Search and filter  
✅ Add to cart  
✅ Checkout  
✅ Track orders  
✅ View profile  

---

## 🔗 Important URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Products | http://localhost:3000/products |
| Cart | http://localhost:3000/cart |
| Profile | http://localhost:3000/profile |
| Admin Dashboard | http://localhost:3000/admin |
| Admin Products | http://localhost:3000/admin/products |
| Admin Orders | http://localhost:3000/admin/orders |
| Admin Customers | http://localhost:3000/admin/customers |
| Admin Inventory | http://localhost:3000/admin/inventory |

---

## 🧪 Testing Workflow

### 1. Test as Customer
```
1. Go to http://localhost:3000/register
2. Create account with any email/password
3. Browse products
4. Add to cart
5. Checkout
6. View profile
```

### 2. Test as Admin
```
1. Go to http://localhost:3000/login
2. Login with: kit28.24bad133@gmail.com / sam2076
3. Click "Admin" in header
4. Explore dashboard
5. Add new product
6. View orders
7. Check inventory
```

### 3. Test as Super Admin
```
1. Go to http://localhost:3000/login
2. Login with: kit28.24bad188@gmail.com / yuva2503
3. Click "Admin" in header
4. All admin features available
5. Can create new admin accounts
```

---

## 💡 Tips

- **Logout**: Click your name in header → Logout
- **Switch User**: Logout and login with different credentials
- **Mock Data**: Currently using in-memory mock data
- **Refresh**: Page refresh resets mock data
- **Real Database**: Update `.env` with Supabase credentials to use real database

---

## 🐛 Troubleshooting

### Login not working?
- Check email and password are exact
- Make sure backend is running (port 5000)
- Check browser console for errors

### Admin features not showing?
- Make sure you're logged in as admin/super_admin
- Check user role in browser console
- Refresh page

### Products not saving?
- Currently using mock data (in-memory)
- Data resets on page refresh
- Set up real Supabase to persist data

---

## 📞 Support

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **API Docs**: See API_DOCUMENTATION.md
- **Setup Guide**: See SETUP_GUIDE.md

---

**Ready to test! 🎉**

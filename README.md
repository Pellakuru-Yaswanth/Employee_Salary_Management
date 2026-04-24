# Employee Salary Management System (MERN)

A comprehensive Payroll and Human Resource Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Setup Instructions

Follow these steps to run the application locally on your machine:

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Pellakuru-Yaswanth/Employee_Salary_Management.git
cd Employee_Salary_Management
```

### 2. Backend Setup
1. Open a terminal in the `Backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` folder with the following content:
   ```env
   APP_PORT = 5000
   SESS_SECRET = your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *Note: The system uses SQLite (`./db/database.sqlite`), so no external database installation is required.*

### 3. Frontend Setup
1. Open a new terminal in the `Frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

### 4. Credentials
- **Admin**: `admin` / `admin123`
- **Employee**: `yaswanth` / `pegawai123` (Sample)

---

## 🛠️ Project Details

### HRMS Choice
I chose this MERN-based Salary Management system because it offers a clean, modular architecture and supports critical enterprise features like UUID-based data integrity, automated payroll calculation, and integrated overtime tracking.

### AI Tools Used
- **Antigravity (Google DeepMind)**: Used extensively as the primary AI coding assistant for full-stack development, including backend model/controller updates (Sequelize), frontend state management (Redux), UI polish (Tailwind CSS), and automated browser testing.

### Special Ticket Handling
- **TICKET LF-101 (Date Format)**: While the ticket requested DD/MM/YYYY for payslips, I implemented this format globally across the entire application (Employee lists, Attendance logs, Dashboard) using `moment.js` to ensure a consistent regional UX for Indian users.
- **TICKET LF-104 (Export CSV)**: Instead of a backend-heavy export, I implemented a dynamic frontend utility that merges Employee data with live Position/Salary data from Redux. This ensures that the exported CSV always reflects real-time salary configurations without extra API overhead.

---

## 🌏 Language Note
> [!IMPORTANT]
> The application currently uses **Indonesian terminology** (e.g., *Jabatan* for Position, *Gaji* for Salary). 
> **To use the app in English:** 
> 1. Right-click anywhere on the page or click the **3 dots** (Google Chrome menu) in the top right.
> 2. Select **Translate...** or **Google Translate**.
> 3. Choose **English** to see the properly translated output across all modules.

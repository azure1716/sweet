
#Sweet Shop Management System**A full-stack Single Page Application (SPA) designed to manage the inventory, sales, and administration of a digital sweet shop. This project was built using Test-Driven Development (TDD) principles, modern web technologies, and AI-assisted workflows.**

##Live Demo(Coming Soon)

---

##Tech Stack**Backend**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT)
* **Testing:** Jest & Supertest

**Frontend**

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios
* **Notifications:** React Hot Toast

---

##Features**User Features:**

* **Authentication:** Secure User Registration and Login.
* **Browse Inventory:** View a dashboard of all available sweets.
* **Purchase:** Buy sweets (real-time stock deduction). Purchase button is disabled if stock is 0.
* **Visual Feedback:** Toast notifications for success and error states.

**Admin Features:**

* **Protected Routes:** Only authenticated Admins can access specific endpoints.
* **Inventory Management:** Restock sweets to increase quantity.
* **CRUD Operations:** Add, Update, and Delete sweets (API supported).

---

##Setup & InstallationFollow these steps to run the project locally.

###Prerequisites* Node.js (v16 or higher)
* MongoDB (Local installed or MongoDB Atlas URI)
* Git

###1. Clone the RepositoryOpen your terminal and run:
`git clone https://github.com/yourusername/sweet-shop.git`
`cd sweet-shop`

###2. Backend SetupNavigate to the root directory (where server.js is located).

1. **Install Dependencies:**
`npm install`
2. **Environment Variables:**
Create a file named `.env` in the root folder and add the following lines:
`MONGO_URI=mongodb://127.0.0.1:27017/sweetshop`
`JWT_SECRET=your_super_secret_key_here`
`PORT=5000`
3. **Seed the Database (Optional):**
Populate the database with initial test data:
`node src/seed.js`
4. **Start the Server:**
`node src/server.js`
*(Server will run on http://localhost:5000)*

###3. Frontend SetupOpen a new terminal and navigate to the client folder.

1. **Navigate to Client:**
`cd client`
2. **Install Dependencies:**
`npm install`
3. **Start the Development Server:**
`npm run dev`
*(App will run on http://localhost:5173)*

---

##Testing (TDD)This project followed a strict **Red-Green-Refactor** TDD cycle. Tests were written before the implementation logic.

To run the backend test suite, run this command in the root folder:
`npm test`

**Test Coverage:**

* **Auth:** Verifies registration, login, and token generation.
* **Sweets:** Verifies CRUD operations and public access limits.
* **Inventory:** Verifies stock logic (purchasing reduces stock, restocking increases it).

---

##My AI UsageAs part of the modern development lifecycle, I utilized AI tools to enhance productivity and debugging. Below is a transparent record of my AI usage.

**AI Tools Used:**

* Gemini (Google): Primary AI Pair Programmer.

**How I Used AI:**

1. **Debugging & Error Resolution:**
* I used Gemini to diagnose complex folder structure issues (e.g., when files were misplaced in `src/utils` causing crashes).
* It helped resolve Vite configuration errors and "White Screen of Death" issues on the frontend.
* It assisted in fixing Git remote origin conflicts.


2. **Boilerplate Generation:**
* I asked Gemini to generate the initial structure for the `AuthContext` and the `seed.js` script to populate the database quickly.


3. **Concept Clarification:**
* I used AI to understand how to properly link a local folder to a new GitHub repository when the `.git` folder was corrupted.



**Reflection on AI Impact:**
AI significantly accelerated my workflow, particularly in debugging configuration issues that would have taken hours to solve manually (like the Tailwind executable error). However, I learned that relying solely on AI copy-paste can lead to directory mismatches. The most effective workflow was using AI to identify the problem, but manually verifying the file moves and logic myself.

---

##API Endpoints Reference* **POST** `/api/auth/register` - Register a new user (Public)
* **POST** `/api/auth/login` - Login and get Token (Public)
* **GET** `/api/sweets` - Get all sweets (Protected)
* **POST** `/api/sweets` - Add a sweet (Admin)
* **POST** `/api/sweets/:id/purchase` - Buy a sweet/reduce qty (Protected)
* **POST** `/api/sweets/:id/restock` - Restock sweet/increase qty (Admin)

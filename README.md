# 🚀 CodePath — Code, Compete & Grow!

**CodePath** is a full-stack competitive programming platform to practice problems, track contests, and get intelligent AI-powered feedback.  
From a secure Docker-based C++ online judge to a real-time contest calendar with reminders, CodePath helps you become a better coder — one submission at a time.

🌐 **Live:** [www.codepathtech.online](https://www.codepathtech.online)  
📽️ **Demo Video:** _[https://www.loom.com/share/e4e4c240d21d420480697b0481956925]_

---

## 🎯 Features

### 🧠 Online Judge System
- 💻 Monaco-based Code Editor with C++ syntax highlighting
- ⚡ Instant Compile & Run with support for custom input
- 🔒 Secure execution using a Dockerized C++ compiler microservice
- 📁 Supports hidden/public test cases with robust I/O matching

### 📅 Smart Contest Calendar
- 📡 Aggregates contests from platforms like Codeforces, AtCoder, etc.
- 🔍 Filter contests by platform or duration
- 🔔 One-click reminders to never miss a contest

### 🤖 AI Code Review (Beta)
- 🧾 Post-submission analysis of logic and complexity
- 🧠 Insightful breakdown of time complexity
- 💡 Suggestions to improve your code thinking and design

### 📊 User Dashboard
- 📈 Submission graph (last 30 days)
- 🧩 Tag-wise pie chart of solved problems

### 🔐 Admin Panel (JWT Secured)
- ✍️ Add/Edit/Delete problems from an intuitive UI
- 🔑 Access protected via JWT authentication

### 🧱 Modular Microservices Architecture
- 🧩 Separate services for compiler, judge, and core APIs
- 🐳 Docker ensures secure, sandboxed execution
- 🧰 Designed for scalability, modularity, and maintainability

---

## 🎥 Demo

Explore the platform in action! Click below to watch how CodePath empowers competitive programmers to code, compete, and learn.

📽️ **Demo Video**: _[https://www.loom.com/share/e4e4c240d21d420480697b0481956925]_  
🌐 **Live Site**: [www.codepathtech.online](https://www.codepathtech.online)

### 🔍 What You’ll See:
- ✍️ Writing and submitting code in the Monaco editor
- 🐳 Code executing securely inside Docker containers
- 📅 Navigating the Contest Calendar and setting reminders
- 🤖 Getting post-submission AI feedback
- 📊 Visualizing your progress in the dashboard
- 🛠️ Managing problems through the Admin Panel

---

## 🛠️ Deployment

CodePath is deployed using a **modular microservices architecture** to ensure scalability, performance, and system isolation.

### 🖥️ Frontend
- **Framework**: React + Vite + Tailwind CSS  
- **Hosting**: [Vercel](https://vercel.com)  
- **Deployed Features**:
  - Monaco C++ Editor
  - Contest Calendar UI
  - AI Review Integration
  - User Dashboard

### 🔧 Backend (API Server)
- **Stack**: Node.js + Express  
- **Hosting**: [Render](https://render.com)  
- **Responsibilities**:
  - JWT-secured authentication
  - Problem CRUD APIs
  - AI review orchestration
  - Submission storage and retrieval

### 🐳 Compiler Microservice
- **Language**: C++  
- **Containerized**: Docker (secure, sandboxed)  
- **Hosting**: AWS EC2   
- **Image Registry**: AWS ECR  
- **Responsibilities**:
  - Securely compiles & runs C++ code
  - Handles inputs/outputs
  - Prevents abuse via isolation

### 🗄️ Database
- **Platform**: MongoDB Atlas  
- **Stores**:
  - Users and sessions
  - Problems and test cases
  - Submission records
  - Contest tracking and reminders

### 🌐 Domain & SSL
- **Provider**: Hostinger  
- **Security Setup**:
  - SSL Certificate enabled
  - Nginx reverse proxy on EC2
  - HTTPS enforced across services

---

## 🙏 Acknowledgements

- 💡 **Mentors & Teachers** — For guidance, feedback, and support
- 🤝 **Friends & Testers** — For helping test and refine features
- 🧰 **Open-source Tools** — Monaco Editor, Docker, Node.js, Tailwind, Vite & more
- 🎥 **Demo Inspiration** — Thanks to dev communities and showcase projects
- 🌐 **Communities** — GitHub, Stack Overflow, Reddit — for solving bugs at 3 AM!

---

## 📬 Contact

Have feedback or want to collaborate?

- Open an issue or PR on GitHub  
- Email: saurabh7642@gmail.com

---

> 🚧 Want to contribute? A contribution guide will be added soon. Feel free to fork and build!


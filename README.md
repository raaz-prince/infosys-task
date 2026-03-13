# 📝 Task Manager Dashboard (Angular + Spring Boot)

A modern task management dashboard built using **Angular (Standalone Components)** and integrated with a Spring Boot backend API.

This application allows users to create, update, delete, filter, and track tasks with real-time UI updates and clean architecture.

---

## 🚀 Features

### ✅ Task Management
- Add new tasks
- Edit existing tasks
- Delete tasks
- Update task status
- View task details in modal

### ✅ Dashboard & Filtering
- Filter tasks by:
  - All
  - To Do
  - In Progress
  - Completed
- Dynamic task counters
- Responsive grid layout

### ✅ UI/UX
- Modal-based View & Edit
- Tailwind CSS styling
- Toast notifications using ngx-toastr
- Clean event-driven component architecture
- Enum-based type-safe filtering

---

## 🏗️ Tech Stack

### Frontend
- Angular (Standalone Components)
- TypeScript
- Tailwind CSS
- ngx-toastr

### Backend
- Spring Boot
- REST APIs
- JSON-based request/response models

---

## 📂 Project Structure

```
src/
 ├── models/
 │    ├── task-response.model.ts
 │    ├── task-request.model.ts
 │    ├── update-task-request.ts
 │    └── task-status.ts
 │
 ├── service/
 │    └── task-service.ts
 │
 ├── components/
 │    ├── dashboard/
 │    ├── task-card/
 │    ├── task-modal/
 │    └── add-task/
```

---

## 🔄 Application Flow

### Component Communication

```
TaskCard → Dashboard → TaskModal
TaskModal → Dashboard → TaskService → Backend API
```

---

## 🧠 Key Architectural Decisions

### 1️⃣ Enum-Based Status

```ts
export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
```

Using enums avoids string comparison bugs and improves type safety.

---

### 2️⃣ Safe Edit Pattern

Instead of mutating `@Input()` directly:

```ts
editableTask = { ...this.task };
```

This prevents unintended parent state mutation and keeps cancel functionality reliable.

---

### 3️⃣ Immutable State Updates

```ts
this.tasks = this.tasks.map(task =>
  task.id === updated.id ? updated : task
);
```

Ensures Angular change detection works correctly.

---

## 🛠️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Application

```bash
ng serve
```

Open in browser:

```
http://localhost:4200
```

---

## 🔌 Required Backend Endpoints

The frontend expects:

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/{id}`
- `PATCH /tasks/{id}/status`
- `DELETE /tasks/{id}`

---

## 📈 Future Improvements

- Pagination
- Search functionality
- Drag & Drop status update
- Authentication & role-based access
- Angular Signals version
- Unit testing (Jasmine/Karma)

---

## 👨‍💻 Author

**Prince Kumar**  
B.Tech – Computer Science  
Angular & Spring Boot Developer

---

⭐ If you found this project useful, feel free to star the repository.
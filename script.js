// -----------------------------
//  LOGIN / REGISTER HANDLING
// -----------------------------

// 🔹 Register
function register() {
  const user = document.getElementById('regUser').value.trim();
  const pass = document.getElementById('regPass').value.trim();
  const confirm = document.getElementById('confirmPass').value.trim();

  if (!user || !pass || !confirm) {
    alert("Please fill out all fields.");
    return;
  }

  if (pass !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  if (localStorage.getItem(user)) {
    alert("Username already exists. Try another one.");
    return;
  }

  localStorage.setItem(user, pass);
  alert("Registration successful! Redirecting to login...");
  window.location.href = "login.html";
}

// 🔹 Login
function login() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  if (!user || !pass) {
    alert("Please fill out all fields.");
    return;
  }

  const storedPass = localStorage.getItem(user);
  if (storedPass === pass) {
    localStorage.setItem("currentUser", user);
    alert("Login successful!");
    window.location.href = "home.html";
  } else {
    alert("Invalid username or password.");
  }
}

// 🔹 Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// 🔹 Show/Hide Password
function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

// 🔹 Auto load username on home page
document.addEventListener("DOMContentLoaded", () => {
  const usernameEl = document.getElementById("username");
  const currentUser = localStorage.getItem("currentUser");

  if (usernameEl && currentUser) {
    usernameEl.textContent = currentUser;
  } else if (usernameEl && !currentUser) {
    window.location.href = "login.html";
  }
});
// Disable back button
 history.pushState(null, "", location.href);
    window.onpopstate = function () {
        window.location.href = "login.html";
    };

    
    // ===============================
// FILE MANAGER LOGIC
// ===============================

// Save selected files into localStorage
function saveFiles() {
  const fileInput = document.getElementById("fileInput");
  const files = fileInput?.files;
  if (!files || files.length === 0); 
      alert("Please select at least one file!");
    return;
  }
{
  const storedFiles = JSON.parse(localStorage.getItem("savedFiles") || "[]");

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      storedFiles.push({
        name: file.name,
        content: event.target.result,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("savedFiles", JSON.stringify(storedFiles));
      displayFileGrid();
    };
    reader.readAsDataURL(file);
  });

  fileInput.value = "";
}

// Display stored files in a grid
function displayFileGrid() {
  const fileGrid = document.getElementById("fileGrid");
  if (!fileGrid) return;

  const files = JSON.parse(localStorage.getItem("savedFiles") || "[]");
  fileGrid.innerHTML = "";

  if (files.length === 0) {
    fileGrid.innerHTML = "<p>No files stored yet.</p>";
    return;
  }

  files.forEach((file, index) => {
    const div = document.createElement("div");
    div.className = "file-card";
    div.innerHTML = `
      <div class="file-icon">📄</div>
      <div class="file-name">${file.name}</div>
      <div class="file-date">${file.date}</div>
      <div class="file-actions">
        <button class="small-btn" onclick="downloadFile(${index})">Download</button>
        <button class="small-btn delete" onclick="deleteFile(${index})">Delete</button>
      </div>
    `;
    fileGrid.appendChild(div);
  });
}

// Download stored file
function downloadFile(index) {
  const files = JSON.parse(localStorage.getItem("savedFiles") || "[]");
  const file = files[index];
  const a = document.createElement("a");
  a.href = file.content;
  a.download = file.name;
  a.click();
}

// Delete stored file
function deleteFile(index) {
  const files = JSON.parse(localStorage.getItem("savedFiles") || "[]");
  files.splice(index, 1);
  localStorage.setItem("savedFiles", JSON.stringify(files));
  displayFileGrid();
}

// Logout
function logout() {
  window.location.replace("login.html");
}

// Auto-load file list on page load
document.addEventListener("DOMContentLoaded", displayFileGrid);
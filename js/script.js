const userManager = {
  localStorageKey: "users",

  init: function () {
    this.loadUsers();
    this.bindEvents();
  },

  handleAddUser: function (event) {
    event.preventDefault();

    const firstname = document.getElementById("firstName").value.trim();
    const lastname = document.getElementById("lastName").value.trim();
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const gender = document.getElementById("gender").value;
    const dateCreated = new Date().toLocaleString();

    let users = this.getUsers();

    if (this.currentEditId) {
      users = users.map((user) =>
        user.id === this.currentEditId
          ? { ...user, firstname, lastname, password, email, gender }
          : user
      );
      alert("User updated successfully!");
      this.currentEditId = null;

      const btn = document.querySelector("#userForm button[type='submit']");
      if (btn) btn.textContent = "Add User";
    } else {
      const newUser = {
        id: Date.now(),
        firstname,
        lastname,
        password,
        email,
        gender,
        dateCreated,
      };
      users.push(newUser);
      alert("User added successfully!");
    }

    this.saveUsers(users);
    this.loadUsers();
    document.getElementById("userForm").reset();
  },

  saveUsers: function (users) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  },

  getUsers: function () {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  },

  loadUsers: function () {
    const users = this.getUsers();
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    if (users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;">No users found.</td>
        </tr>`;
      return;
    }

    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
        <td>${user.email}</td>
        <td>${user.gender}</td>
        <td>${user.dateCreated}</td>
        <td class="action-cell">
          <button class="edit-btn" data-id="${user.id}">Edit</button>
          <button class="delete-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const userId = parseInt(e.target.dataset.id);
        this.handleDeleteUser(userId);
      });
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const userId = parseInt(e.target.dataset.id);
        this.handleEditUser(userId);
      });
    });
  },

  handleDeleteUser: function (userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    let users = this.getUsers();
    users = users.filter((user) => user.id !== userId);
    this.saveUsers(users);
    this.loadUsers();
    alert("User deleted successfully!");
  },

  handleEditUser: function (userId) {
    const users = this.getUsers();
    const userToEdit = users.find((user) => user.id === userId);
    if (!userToEdit) return;

    document.getElementById("firstName").value = userToEdit.firstname;
    document.getElementById("lastName").value = userToEdit.lastname;
    document.getElementById("password").value = userToEdit.password;
    document.getElementById("userEmail").value = userToEdit.email;
    document.getElementById("gender").value = userToEdit.gender;

    this.currentEditId = userId;
    const btn = document.querySelector("#userForm button[type='submit']");
    if (btn) btn.textContent = "Update User";
  },

  bindEvents: function () {
    const form = document.getElementById("userForm");
    if (form) {
      form.addEventListener("submit", this.handleAddUser.bind(this));
    } else {
      console.error("Form with id userForm not found");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  userManager.init();
});

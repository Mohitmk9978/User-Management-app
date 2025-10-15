// Change this if your backend is on different host/port
const API_URL = 'http://localhost:5000/api/users';

const form = document.getElementById('user-form');
const idInput = document.getElementById('user-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const bioInput = document.getElementById('bio');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const userList = document.getElementById('user-list');
const countEl = document.getElementById('count');

async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error('Failed to fetch users', err);
    alert('Failed to fetch users from server');
  }
}

function renderUsers(users) {
  userList.innerHTML = '';
  countEl.textContent = users.length;
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'user-item';

    const left = document.createElement('div');
    left.innerHTML = `<strong>${escapeHtml(user.name)}</strong>
      <div class="meta">${escapeHtml(user.email)} ${user.age ? ' • ' + user.age : ''}</div>
      ${user.bio ? `<div style="margin-top:6px">${escapeHtml(user.bio)}</div>` : ''}`;

    const right = document.createElement('div');
    right.className = 'btns';
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => populateForm(user);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-del';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteUser(user._id);

    right.appendChild(editBtn);
    right.appendChild(delBtn);

    div.appendChild(left);
    div.appendChild(right);
    userList.appendChild(div);
  });
}

function populateForm(user) {
  idInput.value = user._id;
  nameInput.value = user.name || '';
  emailInput.value = user.email || '';
  ageInput.value = user.age || '';
  bioInput.value = user.bio || '';
  submitBtn.textContent = 'Update User';
  cancelBtn.style.display = 'inline-block';
}

function resetForm() {
  idInput.value = '';
  nameInput.value = '';
  emailInput.value = '';
  ageInput.value = '';
  bioInput.value = '';
  submitBtn.textContent = 'Add User';
  cancelBtn.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    age: ageInput.value ? Number(ageInput.value) : undefined,
    bio: bioInput.value.trim()
  };

  if (!data.name || !data.email) {
    alert('Name and email are required');
    return;
  }

  try {
    if (idInput.value) {
      // update
      const res = await fetch(`${API_URL}/${idInput.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }
      resetForm();
      fetchUsers();
    } else {
      // create
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Create failed');
      }
      resetForm();
      fetchUsers();
    }
  } catch (err) {
    console.error(err);
    alert(err.message || 'Request failed');
  }
});

cancelBtn.addEventListener('click', () => resetForm());

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Delete failed');
    }
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Delete failed');
  }
}

// XSS safe text
function escapeHtml(text) {
  if (!text && text !== 0) return '';
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// initial load
fetchUsers();

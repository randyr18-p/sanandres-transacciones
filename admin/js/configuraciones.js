

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const settingsForm = document.getElementById('settings-form');

function toggleSidebar() {
  sidebar.classList.toggle('hidden');
}

sidebarToggle.addEventListener('click', toggleSidebar);

// Handle responsive sidebar
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    sidebar.classList.remove('hidden');
  } else {
    sidebar.classList.add('hidden');
  }
});

// Mock user data
const mockUser = {
  username: 'johndoe',
  email: 'johndoe@example.com'
};

// Populate form with mock data
document.getElementById('username').value = mockUser.username;
document.getElementById('email').value = mockUser.email;

// Handle form submission
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(settingsForm);
  const updatedUser = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password')
  };
  
  // Here you would typically send this data to your backend
  console.log('Updated user settings:', updatedUser);
  
  // Show a success message
  alert('Settings updated successfully!');
});
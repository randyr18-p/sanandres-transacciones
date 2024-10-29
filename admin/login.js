 // URL de tu API con el prefijo /api
 const API_URL = 'http://127.0.0.1:8000/api';  // Prefijo /api

 // Función para iniciar sesión
 document.getElementById('loginForm').addEventListener('submit', async function (event) {
     event.preventDefault();  // Previene el envío del formulario

     const username = document.getElementById('username').value;
     const password = document.getElementById('password').value;

     try {
         const response = await fetch(`${API_URL}/auth/login`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ username, password })
         });

         if (!response.ok) {
             throw new Error('Nombre de usuario o contraseña incorrectos');
         }

         const data = await response.json();
         localStorage.setItem('access_token', data.access_token);  // Guarda el token en localStorage
         alert('Inicio de sesión exitoso');
         window.location.href = 'admin.html';
     } catch (error) {
         alert(error.message);
     }
 });

 // Función para obtener los datos del usuario autenticado
 async function getAuthenticatedUser() {
     const token = localStorage.getItem('access_token');

     if (!token) {
         alert('Por favor, inicia sesión primero');
         return;
     }

     try {
         const response = await fetch(`${API_URL}/auth/me`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${token}`
             }
         });

         if (!response.ok) {
             throw new Error('No se pudo obtener los datos del usuario');
         }

         const userData = await response.json();
         document.getElementById('userData').innerText = JSON.stringify(userData, null, 2);
     } catch (error) {
         alert(error.message);
     }
 }
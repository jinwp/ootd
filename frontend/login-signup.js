document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');
  
    // Handle Login
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
  
          if (response.ok) {
            // const data = await response.json();
            // localStorage.setItem('token', data.access_token);
            const { access_token, user_id } = await response.json();
            localStorage.setItem('jwtToken', access_token);
            localStorage.setItem('userId', user_id);
            window.location.href = 'main.html'; // Redirect to main page
          } else {
            errorMessage.textContent = 'Invalid email or password';
          }
        } catch (error) {
          console.error('Error logging in:', error);
          errorMessage.textContent = 'An error occurred. Please try again.';
        }
      });
    }
  
    // Handle Signup
    if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const height = parseInt(document.getElementById('height').value, 10);
        const weight = parseInt(document.getElementById('weight').value, 10);
  
        try {
          const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password, height, weight }),
          });
  
          if (response.ok) {
            alert('Signup successful! Please log in.');
            window.location.href = 'login.html'; // Redirect to login page
          } else {
            errorMessage.textContent = 'Signup failed. Please try again.';
          }
        } catch (error) {
          console.error('Error signing up:', error);
          errorMessage.textContent = 'An error occurred. Please try again.';
        }
      });
    }
  });
  
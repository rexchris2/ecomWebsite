//When logged in hide certain buttons same with being logged out

document.addEventListener('DOMContentLoaded', () => {
  fetch('/session')
      .then(response => response.json())
      .then(data => {
          if (data.loggedIn) {
              // Hide login and signup buttons
              document.querySelector('#login-but').style.display = 'none';
              document.querySelector('#signup-but').style.display = 'none';

          } else {
              // Hide account/logout buttons
             document.querySelector('#fav-but').style.display = 'none';
             document.querySelector('#acc-but').style.display = 'none';
             document.querySelector('#cart-but').style.display = 'none';
          }
      })
      .catch(err => console.error('Error fetching session data:', err));
});
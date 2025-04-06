//When logged in hide certain buttons same with being logged out

document.addEventListener('DOMContentLoaded', () => {
  fetch('/session')
      .then(response => response.json())
      .then(data => {
          if (data.loggedIn) {
              // Hide login and signup buttons when signed in
              document.querySelector('#login-but').style.display = 'none';
              document.querySelector('#signup-but').style.display = 'none';


          } else {
              // Hide account/logout buttons when not signed in
             document.querySelector('#fav-but').style.display = 'none';
             document.querySelector('#acc-but').style.display = 'none';
             document.querySelector('#cart-but').style.display = 'none';
             document.querySelector('#logout-but').style.display = 'none';
             

             //hide fav buttons when not signed in
             document.querySelector('#fav-add1').style.display = 'none';
             document.querySelector('#fav-add2').style.display = 'none';
             document.querySelector('#fav-add3').style.display = 'none';
             document.querySelector('#fav-add4').style.display = 'none';
             document.querySelector('#fav-add5').style.display = 'none';
             document.querySelector('#fav-add6').style.display = 'none';
             document.querySelector('#fav-add7').style.display = 'none';
             document.querySelector('#fav-add8').style.display = 'none';
             document.querySelector('#fav-add9').style.display = 'none';

             //hide add cart buttons when not signed in
            document.querySelector('#add-but1').style.display ='none';
            document.querySelector('#add-but2').style.display ='none';
            document.querySelector('#add-but3').style.display ='none';
            document.querySelector('#add-but4').style.display ='none';
            document.querySelector('#add-but5').style.display ='none';
            document.querySelector('#add-but6').style.display ='none';
            document.querySelector('#add-but7').style.display ='none';
            document.querySelector('#add-but8').style.display ='none';
            document.querySelector('#add-but9').style.display ='none';
            }
      })
      .catch(err => console.error('Error fetching session data:', err));
});
//Log out
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('#logout-but');
  
    logoutButton.addEventListener('click', () => {
      fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            // Redirect to login or home page after logout
            window.location.href = '/login.html';
            console.log('Logout Successful')
            alert('Logged out!');
          } else {
            console.error('Failed to log out.');
          }
        })
        .catch(err => console.error('Error during logout:', err));
    });
  
    // Show logout button if user is logged in
    fetch('/session')
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          document.querySelector('#logout-but').style.display = 'block';
        }
      });
  });
  
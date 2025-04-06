window.onload = async function() {
  try {
      const userResponse = await fetch('/account');
      const addressResponse = await fetch('/accountAddress');
      // const userUpdate = await fetch('/update');

    //   if (!response.ok) {
    //       throw new Error('Failed to fetch user data');
    //   }

      const user = await userResponse.json();  
      const userAddress = await addressResponse.json();
      

      // Display user information on the page
      document.getElementById('first-name').textContent = `Welcome, ${user.firstname}`;
      document.getElementById('first-last').textContent = ` ${user.firstname} ${user.lastname}`;
      document.getElementById('user-email').textContent = `${user.email}`;
      //Address
      document.getElementById('user-street').textContent = `${userAddress.street}`;
      document.getElementById('user-city').textContent = `${userAddress.city}`;
      document.getElementById('user-state').textContent = `${userAddress.state}`;
      document.getElementById('user-zip').textContent = `${userAddress.zip}`;

      

    
    
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to load user data');
  }
};



document.addEventListener('DOMContentLoaded', () => {
  fetch('/session')
      .then(response => response.json())
      .then(data => {
          if (data.loggedIn) {
              // Hide login and signup buttons
              document.querySelector('#login-but').style.display = 'none';
              document.querySelector('#signup-but').style.display = 'none';

          } 
      })
      .catch(err => console.error('Error fetching session data:', err));
});


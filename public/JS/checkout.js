document.addEventListener('DOMContentLoaded', () => {
    fetch('/session')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                const userResponse = fetch('/account');
                const addressResponse = fetch('/accountAddress');


                const user = userResponse.json();  
                const userAddress = addressResponse.json();
                
                // Hide login and signup buttons
                document.querySelector('#login-but').style.display = 'none';
                document.querySelector('#signup-but').style.display = 'none';

                document.getElementById('user-street').textContent = `W, ${userAddress.street}`;
                document.getElementById('user-city').textContent = `${userAddress.city}`;
                document.getElementById('user-state').textContent = `${userAddress.state}`;
                document.getElementById('user-zip').textContent = `${userAddress.zip}`;


            }
        })
        .catch(err => console.error('Error fetching session data:', err));
});


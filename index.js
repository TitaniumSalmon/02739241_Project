const BASE_URL = 'http://localhost:8000'; // Ensure this matches your server's base URL

        // Dynamically render authentication buttons
        document.addEventListener('DOMContentLoaded', () => {
            const authButtonsContainer = document.getElementById('auth-buttons');
            const adminPanelLink = document.getElementById('admin-panel-link');
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');

            if (userId) {
                if (userId == 1) {
                    adminPanelLink.style.display = 'block';
                }

                authButtonsContainer.innerHTML = `
                    <li style="float:right"><button id="logout-button" class="bg-red-500 text-white px-4 py-3 rounded">Log Out</button></li>
                    <li style="float:right"><span class="username-display text-white">Welcome, ${username}</span></li>
                `;

                // Add logout functionality
                document.getElementById('logout-button').addEventListener('click', () => {
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    window.location.reload();
                });
            } else {
                authButtonsContainer.innerHTML = `
                    <li style="float:right"><a class="login-button" href="login.html">Log In</a></li>
                    <li style="float:right"><a href="register.html">Sign Up</a></li>
                `;
            }
        });



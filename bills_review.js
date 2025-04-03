const BASE_URL = 'http://localhost:8000';

async function fetchAndDisplayBills() {
    try {
        const response = await axios.get(`${BASE_URL}/monthly_bills`);
        const bills = response.data;

        const labels = bills.map(bill => bill.billing_date);
        const rentAmounts = bills.map(bill => bill.rent_amount);
        const electricityCosts = bills.map(bill => bill.electricity_cost);
        const waterCosts = bills.map(bill => bill.water_cost);

        const ctx = document.getElementById('billsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Rent Amount',
                        data: rentAmounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Electricity Cost',
                        data: electricityCosts,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Water Cost',
                        data: waterCosts,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Monthly Bills Breakdown'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Billing Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Amount (Baht)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching bills:', error);
        alert('Failed to load bills. Please try again.');
    }
}

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

document.addEventListener('DOMContentLoaded', fetchAndDisplayBills);

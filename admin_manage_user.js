document.addEventListener('DOMContentLoaded', () => {
    const userTable = document.getElementById('userTable').querySelector('tbody');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const addUserButton = document.getElementById('addUserButton');
    const cancelButton = document.getElementById('cancelButton');
    const modalTitle = document.getElementById('modalTitle');
    const BASE_URL = 'http://localhost:8000';

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users`);
            const users = response.data;
            userTable.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.user_id}</td>
                    <td>${user.username}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser(${user.user_id})">Edit</button>
                        <button onclick="deleteUser(${user.user_id})">Delete</button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    window.editUser = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/users/${userId}`);
            const user = response.data;
            modalTitle.textContent = 'Edit User';
            userForm.user_id.value = user.user_id;
            userForm.username.value = user.username;
            userForm.password.value = ''; // Leave password blank for security
            userForm.firstname.value = user.firstname;
            userForm.lastname.value = user.lastname;
            userForm.email.value = user.email;
            userForm.phone.value = user.phone;
            userForm.role.value = user.role;
            userModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    window.deleteUser = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${BASE_URL}/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const saveUser = async (event) => {
        event.preventDefault();
        const formData = new FormData(userForm);
        // Convert formData to plain object
        const userObj = Object.fromEntries(formData);
        const userId = userObj.user_id;
        try {
            if (userId) {
                await axios.put(`${BASE_URL}/users/${userId}`, userObj, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                await axios.post(`${BASE_URL}/users`, userObj, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            userModal.style.display = 'none';
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    addUserButton.addEventListener('click', () => {
        modalTitle.textContent = 'Add User';
        userForm.reset();
        userModal.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        userModal.style.display = 'none';
    });

    userForm.addEventListener('submit', saveUser);

    fetchUsers();

    const reservationTable = document.getElementById('reservationTable').querySelector('tbody');
    const reservationModal = document.getElementById('reservationModal');
    const reservationForm = document.getElementById('reservationForm');
    const addReservationButton = document.getElementById('addReservationButton');
    const cancelReservationButton = document.getElementById('cancelReservationButton');
    const reservationModalTitle = document.getElementById('reservationModalTitle');

    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/reservations`);
            const reservations = response.data;
            reservationTable.innerHTML = '';
            reservations.forEach(reservation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reservation.reservation_id}</td>
                    <td>${reservation.user_id}</td>
                    <td>${reservation.room_id}</td>
                    <td>${reservation.reservation_date}</td>
                    <td>${reservation.status}</td>
                    <td>${reservation.payment_status}</td>
                    <td>
                        <button onclick="editReservation(${reservation.reservation_id})">Edit</button>
                        <button onclick="deleteReservation(${reservation.reservation_id})">Delete</button>
                    </td>
                `;
                reservationTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    window.editReservation = async (reservationId) => {
        try {
            const response = await axios.get(`${BASE_URL}/reservations/${reservationId}`);
            const reservation = response.data;
            reservationModalTitle.textContent = 'Edit Reservation';
            reservationForm.reservation_id.value = reservation.reservation_id;
            reservationForm.user_id.value = reservation.user_id;
            reservationForm.room_id.value = reservation.room_id;
            reservationForm.reservation_date.value = reservation.reservation_date;
            reservationForm.status.value = reservation.status;
            reservationForm.payment_status.value = reservation.payment_status;
            reservationModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching reservation:', error);
        }
    };

    window.deleteReservation = async (reservationId) => {
        if (confirm('Are you sure you want to delete this reservation?')) {
            try {
                await axios.delete(`${BASE_URL}/reservations/${reservationId}`);
                fetchReservations();
            } catch (error) {
                console.error('Error deleting reservation:', error);
            }
        }
    };

    const saveReservation = async (event) => {
        event.preventDefault();
        const formData = new FormData(reservationForm);
        const reservationObj = Object.fromEntries(formData);
        const reservationId = reservationObj.reservation_id;
        try {
            if (reservationId) {
                await axios.put(`${BASE_URL}/reservations/${reservationId}`, reservationObj, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                await axios.post(`${BASE_URL}/reservations`, reservationObj, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            reservationModal.style.display = 'none';
            fetchReservations();
        } catch (error) {
            console.error('Error saving reservation:', error);
        }
    };

    addReservationButton.addEventListener('click', () => {
        reservationModalTitle.textContent = 'Add Reservation';
        reservationForm.reset();
        reservationModal.style.display = 'block';
    });

    cancelReservationButton.addEventListener('click', () => {
        reservationModal.style.display = 'none';
    });

    reservationForm.addEventListener('submit', saveReservation);

    fetchReservations();
});

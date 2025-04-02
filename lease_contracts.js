const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    try {
        // Fetch the current user session
        const user_id = localStorage.getItem('userId');

        if (!user_id) {
            console.error('No user session found.');
            document.body.innerHTML = '<h1>Page Not Available</h1>';
            return;
        }

        // Fetch all room reservations
        const roomReservations = await axios.get(`${BASE_URL}/reservations`);
        console.log('Room Reservations:', roomReservations.data);
        // Filter reservations by user_id
        const userReservations = roomReservations.data.filter(reservation => reservation.user_id.toString() === user_id);

        if (userReservations.length === 0) {
            console.log('No reservations found for this user.');
            document.body.innerHTML = '<h1>Page Not Available</h1>';
            return;
        }

        // Extract room_ids for the user
        const roomIds = userReservations.map(reservation => reservation.room_id);
        console.log('Room IDs for the user:', roomIds);

        if (roomIds.length === 0) {
            document.body.innerHTML = '<h1>Page Not Available</h1>';
            return;
        }

        // Populate the table with valid room IDs
        const tableBody = document.querySelector('#room-table tbody');
        roomIds.forEach(roomId => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${roomId}</td>
                <td><input type="radio" name="room_id" value="${roomId}" required></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.body.innerHTML = '<h1>Error Loading Page</h1>';
    }
};

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const data = {
            start_date: formData.get('start_date'),
            end_date: formData.get('end_date'),
            deposit_amount: formData.get('deposit_amount'),
            room_id: formData.get('room_id'),
        };

        const response = await axios.post(`${BASE_URL}/lease_contracts`, data);

        if (response.status === 200) {
            alert('Lease contract submitted successfully!');
        } else {
            alert('Failed to submit lease contract.');
        }
    } catch (error) {
        console.error('Error submitting lease contract:', error);
        alert('An error occurred. Please try again.');
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room_id');
    const roomTypeId = params.get('room_type_id');

    if (!roomId || !roomTypeId) {
        document.body.innerHTML = '<p class="text-red-500">Invalid room or room type ID.</p>';
        return;
    }

    try {
        const roomResponse = await axios.get(`${BASE_URL}/rooms`);
        const roomTypeResponse = await axios.get(`${BASE_URL}/room_type`);

        const room = roomResponse.data.find(r => r.room_id == roomId);
        const roomType = roomTypeResponse.data.find(rt => rt.room_type_id == roomTypeId);

        if (!room || !roomType) {
            document.body.innerHTML = '<p class="text-red-500">Room or Room Type not found.</p>';
            return;
        }

        const roomDetails = `
            <h2 class="text-xl font-bold">Room Details</h2>
            <p><strong>Room Number:</strong> ${room.room_number}</p>
            <p><strong>Status:</strong> ${room.status}</p>
            <p><strong>Monthly Rent:</strong> $${room.monthly_rent}</p>
            <h2 class="text-xl font-bold mt-4">Room Type Details</h2>
            <p><strong>Type Name:</strong> ${roomType.type_name}</p>
            <p><strong>Description:</strong> ${roomType.description}</p>
            <p><strong>Default Rent:</strong> $${roomType.default_rent}</p>
            ${room.status.toLowerCase() === 'available' ? '<button id="reserve-btn" class="bg-blue-500 text-white px-4 py-2 mt-4 rounded">Reserve</button>' : ''}
        `;

        document.getElementById('rooms').innerHTML = roomDetails;

        if (room.status.toLowerCase() === 'available') {
            document.getElementById('reserve-btn').addEventListener('click', () => {
                alert('Reservation functionality will be implemented soon.');
            });
        }
    } catch (error) {
        console.error('Error fetching room or room type data:', error);
        document.body.innerHTML = '<p class="text-red-500">Error loading room details. Please try again later.</p>';
    }
});

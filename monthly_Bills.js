const BASE_URL = 'http://localhost:8000';

async function submitData() {
    const roomNo = document.getElementById('roomNo').value;
    const billingDate = document.getElementById('billingDate').value;
    const rentAmount = document.getElementById('rentAmount').value;
    const electricityUsage = document.getElementById('electricityUsage').value;
    const electricityCost = document.getElementById('electricityCost').value;
    const waterUsage = document.getElementById('waterUsage').value;
    const waterCost = document.getElementById('waterCost').value;
    const totalAmount = document.getElementById('totalAmount').value;

    if (!roomNo || !billingDate || !rentAmount || !electricityUsage || !electricityCost || !waterUsage || !waterCost || !totalAmount) {
        alert("All fields are required!");
        return;
    }
    
    const roomsResponse = await axios.get(`${BASE_URL}/rooms`);
    const rooms = roomsResponse.data;
    console.log(rooms);

    // Find the lease contract associated with the selected room number
    let room = rooms.find(r => r.room_number == roomNo);
    if (!room) {
        alert('Room not found.');
        return;
    }
    console.log('room', room);
    const room_id = room.room_id; // Get the room_id from the room object
    console.log('room_id', room_id);

    const billData = {
        room_id: room_id,
        billing_date: billingDate,
        rent_amount: parseFloat(rentAmount),
        electricity_usage: parseInt(electricityUsage),
        electricity_cost: parseFloat(electricityCost),
        water_usage: parseInt(waterUsage),
        water_cost: parseFloat(waterCost),
        total_amount: parseFloat(totalAmount)
    };

    try {
        const response = await axios.post(`${BASE_URL}/monthly_bills`, billData);
        alert(response.data.message);
    } catch (error) {
        console.error(error);
        alert("Failed to submit data. Please try again.");
    }
}

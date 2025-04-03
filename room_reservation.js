const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; //default mode
let selectid = '';
let user_id = '';
let room_id = '';
let id = '';
console.log('hello world');

async function submitData() {
    const urlParams = new URLSearchParams(window.location.search);
    id = urlParams.get('room_id');
    room_id = urlParams.get('room_type_id');
    try {
        // Retrieve values from the form inputs
        const reservationDate = document.getElementById('move-in_date').value;
        const amountPaid = document.getElementById('deposit-am').value;
        console.log('amountPaid', amountPaid);
        console.log(document.getElementById('deposit-am'))
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    
        console.log(user_id)
        // Construct the reservation data object
        const reservationData = {
            room_id: id,       
            user_id: localStorage.getItem('userId'), 
            reservation_date: reservationDate, 
            amount: parseFloat(amountPaid),               
            payment_method: paymentMethod
        };
    
        // Send the data to the server
        const response = await axios.post(`${BASE_URL}/reservations-with-payment`, reservationData);
    
        console.log('Reservation and payment successful:', response.data);
        alert('Reservation and payment completed successfully!');
        
        // Redirect to index.html
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during reservation and payment:', error);
        alert('An error occurred while processing the reservation and payment.');
    }
}
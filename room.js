const loadData = async () => {
    console.log('user page loaded');
    
    const responseRoom = await axios.get(`${BASE_URL}/rooms`);
    const responseRoom_Type = await axios.get(`${BASE_URL}/room_type`);

    console.log(responseRoom.data);
    console.log(responseRoom_Type.data);

    const roomDOM = document.getElementById('rooms');

    // Create a map of room_type_id -> room type details
    const roomTypeMap = {};
    responseRoom_Type.data.forEach(rt => {
        roomTypeMap[rt.room_type_id] = rt;  // Assuming room_type has an 'id' field
    });

    console.log(roomTypeMap);

    let htmlData = `<table class="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead class="bg-gray-200 sticky top-0">
            <tr>
                <th class="border border-gray-300 px-4 py-2">Room Number</th>
                <th class="border border-gray-300 px-4 py-2">Room Type</th>
                <th class="border border-gray-300 px-4 py-2">Room Price</th>
                <th class="border border-gray-300 px-4 py-2">Room Status</th>
                <th class="border border-gray-300 px-4 py-2" colspan="2">View</th>
            </tr>
        </thead>
        <tbody>`;

    responseRoom.data.forEach(room => {
        let roomType = roomTypeMap[room.room_type_id];  // Find corresponding room type
        console.log(roomType);
        htmlData += `<tr class="hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2">${room.room_number}</td>
            <td class="border border-gray-300 px-4 py-2">${roomType ? roomType["type_name"] : 'Unknown'}</td>  <!-- Handle missing room type -->
            <td class="border border-gray-300 px-4 py-2">${roomType ? roomType["default_rent"] : 'Unknown'}</td>
            <td class="border border-gray-300 px-4 py-2">${room.status}</td>
            <td class="border border-gray-300 px-4 py-2" colspan="2">
                <a href='view.html?room_id=${room.room_id}&room_type_id=${room.room_type_id}'><button class="bg-green-500 text-white px-4 py-2 rounded">View</button></a>
            </td>
        </tr>`;
    });

    htmlData += `</tbody></table>`;
    roomDOM.innerHTML = htmlData;
};

const filterRooms = () => {
    const searchQuery = document.getElementById('searchBox').value.toLowerCase();
    const rows = document.querySelectorAll('#rooms table tbody tr');
    rows.forEach(row => {
        const roomNumber = row.children[0].textContent.toLowerCase();
        const roomType = row.children[1].textContent.toLowerCase();
        if (roomNumber.includes(searchQuery) || roomType.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', filterRooms);
});
const BASE_URL = 'http://localhost:8000';

const validateData = (Data) => {
    let errors = [];

    if (!Data.roomNo) {
        errors.push('กรุณากรอกเลขห้องพัก');
    }
    if (!Data.description) {
        errors.push('กรุณากรอกรายละเอียดการซ่อมบำรุง');
    }
    return errors;
};

const submitData = async () => {
    let roomNoDOM = document.querySelector('input[name=roomNo]');
    let descriptionDOM = document.querySelector('input[name=description]');

    try {
        let Data = {
            username: roomNoDOM.value,
            password: descriptionDOM.value,
        };

        const errors = validateData(Data);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }

        console.log("Submitting data", Data);
        
        const response = await axios.post(`${BASE_URL}/login`, Data);
        const session = await axios.get(`${BASE_URL}/setSession`);
        console.log('Login successful:', response.data);
        console.log('Session set:', session.data);
        
        // Handle successful login (e.g., store token, redirect user)
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
    } catch (error) {
        let errorMessage = 'เกิดข้อผิดพลาด';
        if (error.response) {
            errorMessage = error.response.data.message || errorMessage;
            console.error('Server error:', error.response.data);
        } else {
            console.error('Client error:', error);
        }
        alert(errorMessage);
    }
};

// Attach event listener to a login button
document.querySelector('#loginButton').addEventListener('click', submitData);

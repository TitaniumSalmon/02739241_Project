const BASE_URL = 'http://localhost:8000';

const validateData = (userData) => {
    let errors = [];

    if (!userData.username) {
        errors.push('กรุณากรอกชื่อผู้ใช้');
    }
    if (!userData.password) {
        errors.push('กรุณากรอกรหัสผ่าน');
    }
    return errors;
};

const submitData = async () => {
    let usernameDOM = document.querySelector('input[name=username]');
    let passwordDOM = document.querySelector('input[name=password]');

    try {
        let userData = {
            username: usernameDOM.value,
            password: passwordDOM.value,
        };

        const errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }

        console.log("Submitting data", userData);
        
        const response = await axios.post(`${BASE_URL}/login`, userData);
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

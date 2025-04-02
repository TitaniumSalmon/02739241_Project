const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; //default mode
let selectid = '';
window.onload = async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);
    if (id) {
        mode = 'EDIT';
        selectid = id;

        //1. เราจะดึงข้อมูลของ user ที่ต้องการแก้ไข
        try{
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            console.log('response', response.data);
            const user = response.data;

            //2. เราจะนำข้อมูลของ user ที่ดึงมา ใส่ใน input ที่เรามี
            let usernameDOM = document.querySelector('input[name=username]');
            let passwordDOM = document.querySelector('input[name=password]');
            let firstNameDOM = document.querySelector('input[name=firstname]');
            let lastNameDOM = document.querySelector('input[name=lastname]');
            let emailDOM = document.querySelector('input[name=email]');
            let phoneDOM = document.querySelector('input[name=phone]');

            usernameDOM.value = user.username;
            passwordDOM.value = user.password;
            firstNameDOM.value = user.firstName;
            lastNameDOM.value = user.lastName;
            emailDOM.value = user.email;
            phoneDOM.value = user.phone;

        } catch (error) {
            console.log('error', error);
        }
    }
}

const validateData = (userData) => {
    let errors = [];

    if (!userData.username) {
        errors.push('กรุณากรอกชื่อผู้ใช้');
    }
    if (!userData.password) {
        errors.push('กรุณากรอกรหัสผ่าน');
    }
    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.email) {
        errors.push('กรุณากรอกอีเมล');
    }
    if (!userData.phone) {
        errors.push('กรุณากรอกเบอร์โทรศัพท์');
    }
    return errors;
};

const submitData = async () => {
    console.log('hello world');
    let usernameDOM = document.querySelector('input[name=username]');
    let passwordDOM = document.querySelector('input[name=password]');
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let emailDOM = document.querySelector('input[name=email]');
    let phoneDOM = document.querySelector('input[name=phone]');
    let messageDOM = document.getElementById('message');

    try {

        let userData = {
            username: usernameDOM.value,
            password: passwordDOM.value,
            firstName: firstNameDOM.value,  
            lastName: lastNameDOM.value,
            email: emailDOM.value,
            phone: phoneDOM.value,
        };

        const errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }

        console.log("submitData", userData);
        
        let message = 'บันทึกข้อมูลเรียบร้อย';
        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users/${selectid}`, userData);
            console.log('response', response.data);
        }else{
            const response = await axios.put(`${BASE_URL}/users/${selectid}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }
        
        messageDOM.innerText = message;
        messageDOM.className = 'message success';
    } catch (error) {
        let htmlData = '<div>';
        htmlData += `<div> ${error.message} </div>`;
        htmlData += '<ul>';
        console.log(error.message);
        if (error.response) {
            console.log(error.response);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        htmlData += '</ul>';
        htmlData += '</div>';
        
        messageDOM.innerText = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        messageDOM.className = 'message danger';
    }
};
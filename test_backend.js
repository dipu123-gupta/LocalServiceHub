import axios from 'axios';

const testVerification = async () => {
    try {
        console.log('Testing connection to backend on port 5000...');
        const res = await axios.get('http://localhost:5000/');
        console.log('GET / Response:', res.data);
    } catch (err) {
        console.error('Error connecting to backend:', err.message);
    }
};

testVerification();

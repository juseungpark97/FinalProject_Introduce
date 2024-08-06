import React, { useState } from 'react';
import axios from 'axios';
import styles from '../pages/Passwordlogin.module.css';

const PwLoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'email') {
            setEmail(value);
        } else if (id === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8088/api/users/login', {
                email,
                password
            });
            localStorage.setItem('authToken', response.data.token);
            console.log('Login successful:', response.data);
            window.location.href = '/home';
        } catch (error) {
            setError('Login failed. Please check your email and password.');
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
        
                <label htmlFor="password" className={styles.visuallyHidden}>비밀번호</label>
                <input
                    type="password"
                    id="password"
                    className={styles.inputField}
                    placeholder="비밀번호"
                    value={password}
                    onChange={handleChange}
                    aria-label="비밀번호"
                    required
                />
                <button type="submit" className={styles.loginButton}>로그인</button>
                {error && <p className={styles.error}>{error}</p>}
            
        </form>
    );
};

export default PwLoginForm;
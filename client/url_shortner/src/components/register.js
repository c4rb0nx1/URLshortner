import React, { useState } from 'react'
import { register } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './registercss.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      await register(name, email, password)
      setSuccess(true)
      navigate('/shorten')
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='niranchan'
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: jack@gmail.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='8 characters min: Ex: niran@123'
            required
          />

        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register;
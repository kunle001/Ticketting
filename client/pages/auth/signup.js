import { useState } from 'react';
import axios from 'axios'

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const onSubmit = async event => {
    event.preventDefault();

    const response = await axios.post('localhost:3000/api/user/signup', { email, password })

  }
  return <form onSubmit={onSubmit}>
    <h1>Signup</h1>
    <div className="form-group">
      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} className="form-group"></input>
    </div>
    <div className="form-group">
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-group"></input>
    </div>
    <button className="btn btn-primary">Sign In</button>
  </form>
}
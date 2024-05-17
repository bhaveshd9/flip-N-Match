import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {signup,error,loading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email,password,username)
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>SIGN UP</h3>
            <label>Username:</label>
            <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
            />
            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <button disabled={loading}>SIGN UP</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup;

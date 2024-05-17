import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"

const Navbar = () => {
    const {logout} = useLogout()
    const {user} = useAuthContext()
    const handleclick = () => {
        logout()
    }
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>FLIP 'N' MATCH</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.username}</span>
                            <button onClick={handleclick}>Log out</button>
                        </div>    
                    )}
                    {!user && (
                        <div>
                            <Link to='/login'>
                                Log In
                            </Link>
                            <Link to='/signup'>
                                Sign Up
                            </Link>
                        </div>    
                    )}
                    
                </nav>
            </div>
        </header>
    )
}

export default Navbar
import { useCallback, useState } from "react"
import { useNavigate } from "react-router"
import useSessionStorage from "../hooks/useSessionStorage"
import variable from '../utils/variable'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [, setSessionStorage] = useSessionStorage(variable.SESSIONSTORAGE_KEY)

    const handleUsername = useCallback((e) => {
        setUsername(e.target.value)
    }, [setUsername])

    const handlePassword = useCallback((e) => {
        setPassword(e.target.value)
    }, [setPassword])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        setLoading(true)
        
        fetch("https://ig-bot-backend.herokuapp.com/login", {
             method: "POST",
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 username,
                 password
             })
        })
            .then(res => res.json())
            .then(res => {
                setSessionStorage(username)
                navigate("unfollows")
            })
            .catch(er => setError(er.message))
            .finally(() => setLoading(false))

    }, [username, password, setSessionStorage, navigate])

    return (
        <main className="w-screen h-screen flex items-center justify-center bg-[#1C0C5B]">
            <form className="p-[20px] flex flex-col bg-[#3D2C8D] w-[500px] max-w-screen rounded-xl" autoComplete="off" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className={`${loading && 'animate-pulse'} py-[20px] px-[10px] w-full border-0 outline-none bg-[#1C0C5B] rounded-xl text-[#ffffff]`}
                    placeholder="username instagram" 
                    value={username}
                    onChange={handleUsername}
                />
                <input 
                    type="password" 
                    className={`${loading && 'animate-pulse'} py-[20px] px-[10px] w-full border-0 outline-none bg-[#1C0C5B] rounded-xl mt-[10px] text-[#ffffff]`}
                    placeholder="password instagram" 
                    value={password}
                    onChange={handlePassword}
                />
                <button 
                    type='submit' 
                    className={`${loading && 'animate-pulse'} outline-none max-w-fit mt-[20px] bg-[#1C0C5B] text-[#ffffff] rounded-xl py-[15px] px-[50px] ml-auto flex items-center`}
                    disabled={loading}
                >
                        {
                            loading 
                             ? 'Loading ....'
                             : 'Login'
                        }
                </button>
                {
                    error
                        && <p className="text-[#ffffff] text-bold mt-[10px]">{error}</p>
                }
            </form>
        </main>
    )
}

export default Login
import { useCallback, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useSessionStorage from "../hooks/useSessionStorage"
import variable from '../utils/variable'
import { io } from 'socket.io-client'

function Unfollows() {
    const [sessionStorage] = useSessionStorage(variable.SESSIONSTORAGE_KEY)
    const [numUsers, setNumUsers] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState([])
    const [logs, setLogs] = useState([])
    const navigate = useNavigate()

    const handleNumUsers = useCallback((e) => {
        if(e.target.value > 100 || e.target.value < 0) return
        setNumUsers(e.target.value)
    }, [setNumUsers])

    const clearErrors = useCallback(() => {
        setError([])
    }, [setError])

    const clearLogs = useCallback(() => {
        setLogs([])
    }, [setLogs])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        if(!sessionStorage || numUsers <= 0 || isNaN(numUsers)) return setError(prev => [...prev, "panjang angka tidak boleh kurang dari 0 atau lebih dari 100"])
        setLoading(true)

        fetch("https://ig-bot-backend.herokuapp.com/unfollows", {
             method: "POST",
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 username: sessionStorage,
                 num: numUsers
             })
        })
            .catch(er => setError(prev => [...prev, er.message]))
            .finally(() => setLoading(false))
    }, [sessionStorage, numUsers, setError, setLoading])

    useEffect(() => {
        if(!sessionStorage) navigate("/")
    }, [sessionStorage])

    useEffect(() => {

        const socket = io(`https://ig-bot-backend.herokuapp.com/unfollows`)

        const listener = (data) => {
            setLogs(prev => [...prev, data])
        }

        socket.on(`unfollows/${sessionStorage}`, listener)

        return () => {
            socket.off(`unfollows/${sessionStorage}`, listener)
        }
    }, [setLogs, sessionStorage])

    return (
        <main className="w-screen h-full min-h-screen flex items-center justify-center bg-[#1C0C5B]">
            <form className="p-[20px] flex flex-col bg-[#3D2C8D] w-[500px] max-w-screen rounded-xl" autoComplete="off" onSubmit={handleSubmit}>
                <h1 className="text-white text-2xl font-bold">Unfollows</h1>
                <div className="p-[10px] bg-[#1C0C5B] rounded-xl flex justify-between mt-[20px]">
                    <Link to="/follows" className="text-white w-full bg-[#3d2c8d] p-[15px] rounded-lg text-center mr-[10px]">Follows</Link>
                    <Link to="/unfollows" className="text-white w-full bg-[#3d2c8d] p-[15px] rounded-lg text-center ml-[10px]">Unfollows</Link>
                </div>
                <input 
                    type="num" 
                    className={`${loading && 'animate-pulse'} py-[20px] px-[10px] w-full border-0 outline-none bg-[#1C0C5B] rounded-xl text-[#ffffff] mt-[20px]`}
                    placeholder="many username instagram that want to unfollow" 
                    value={numUsers}
                    onChange={handleNumUsers}
                />
                <button 
                    type='submit' 
                    className={`${loading && 'animate-pulse'} outline-none max-w-fit mt-[20px] bg-[#1C0C5B] text-[#ffffff] rounded-xl py-[15px] px-[50px] ml-auto flex items-center`}
                    disabled={loading}
                >
                        {
                            loading 
                             ? 'Loading ....'
                             : 'Unfollows'
                        }
                </button>
                <div className="p-[30px] bg-[#1C0C5B] mt-[40px] rounded-xl">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-white">Errors</h1>
                        <button type="button" className="text-white  bg-[#3d2c8d] py-[10px] px-[25px] rounded-lg text-center" onClick={clearErrors}>Clear</button>
                    </div>
                    {
                        error.map((itm, i) => <p key={i} className="mt-[10px] text-white">{itm}</p>)
                    }
                </div>
                <div className="p-[30px] bg-[#1C0C5B] mt-[40px] rounded-xl">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-white">Logs</h1>
                        <button type="button" className="text-white  bg-[#3d2c8d] py-[10px] px-[25px] rounded-lg text-center" onClick={clearLogs}>Clear</button>
                    </div>
                    {
                        logs.map((itm, i) => <p key={i} className="mt-[10px] text-white">{itm}</p>)
                    }
                </div>
            </form>
        </main>
    )
}

export default Unfollows
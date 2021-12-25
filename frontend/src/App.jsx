import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from './Page/Login'
import Unfollows from './Page/Unfollows'
import Follows from './Page/Follows'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unfollows" element={<Unfollows />} />
        <Route path="/follows" element={<Follows />} />
        <Route path="*" element={<h1>not found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { useCallback, useState } from "react"

const useSessionStorage = (key, initialValue) => {
    const [dataSessionStorage, setDataSessionStorage] = useState(() => {
        const sessionStorageData = sessionStorage.getItem(key)
        return sessionStorageData ? JSON.parse(sessionStorageData) : initialValue
    })

    const setValueToSessionStorage = useCallback((value) => {
        const valueToStore = value instanceof Function ? value(dataSessionStorage) : value
        setDataSessionStorage(valueToStore)
        sessionStorage.setItem(key, JSON.stringify(valueToStore))
    }, [dataSessionStorage, key])

    return [dataSessionStorage, setValueToSessionStorage]
}

export default useSessionStorage
import { useState, useCallback } from "react"
import { debounce } from "../utils";

export const useSearch = () => {
    const [searchInput, setSearchInput] = useState("")

    const updateSearchInput = useCallback((text) => {
        console.log(`text is ${text}`)
        setSearchInput(text)
    }, [])

    return { searchInput, updateSearchInput }
}
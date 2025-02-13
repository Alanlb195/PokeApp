import { useEffect, useState } from 'react'

export const useDebounceValue = (input: string = '', time: number = 500) => {
    
    const [debouncedValue, setdebouncedValue] = useState(input)

    useEffect(() => {

        const timeout = setTimeout(() => {
            setdebouncedValue(input);
        }, time);

        return () => {
            clearTimeout(timeout);
        }
    }, [input])


    return {
        debouncedValue
    }
}

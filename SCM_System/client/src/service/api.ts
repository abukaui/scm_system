const API = "http://localhost:3000/api";

export interface studentData {
    name?: string;
    email: string;
    password?: string;
    department?: string;
    studentID?: string;
}

export const registerStudent = async (data: studentData) => {
    try {
        const response = await fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        if (!response.ok) {
            console.error(`Registration failed: ${result.message || response.statusText}`)
            throw new Error(result.message || 'Registration failed')
        }
        console.log('Registration successful:', result)
        return result

    } catch (error) {
        console.error('Error during registration:', error)
        throw error
    }
}

export interface LoginResponse {
    token?: string;
    message?: string;
    student?: studentData;
}

export const loginStudent = async (data: studentData): Promise<LoginResponse | undefined> => {
    try {
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = (await response.json()) as LoginResponse
        console.log('Login result:', result)
        console.log(result.student)

        return result

    } catch (error) {
        console.error('Error during login:', error)
        return undefined
    }
}

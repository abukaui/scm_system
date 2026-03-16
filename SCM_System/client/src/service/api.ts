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

export interface ComplaintData {
    title: string;
    description: string;
    catagory: string; // Matching backend spelling
}

export interface ComplaintResponse {
    id: number;
    studentid: string;
    title: string;
    description: string;
    catagory: string;
    status: string;
    created_at: string;
}

export const createComplaint = async (data: ComplaintData, token: string) => {
    try {
        const response = await fetch(`${API}/compliant`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to create complaint');
        }
        return result;
    } catch (error) {
        console.error('Error creating complaint:', error);
        throw error;
    }
}

export const getComplaints = async (token: string): Promise<{compliant: ComplaintResponse[]}> => {
    try {
        const response = await fetch(`${API}/compliant`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch complaints');
        }
        return result;
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw error;
    }
}

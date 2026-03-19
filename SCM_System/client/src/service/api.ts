const API = "http://localhost:3000/api";

export interface UserData {
    id?: number;
    name?: string;
    email: string;
    password?: string;
    department?: string;
    studentID?: string;
    role?: string;
}

export const registerStudent = async (data: UserData) => {
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
    user?: UserData;
}

export const loginUser = async (data: UserData): Promise<LoginResponse | undefined> => {
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
        console.log(result.user)

        return result

    } catch (error) {
        console.error('Error during login:', error)
        return undefined
    }
}

export interface ComplaintData {
    title: string;
    description: string;
    category: string;
}

export interface ComplaintResponse {
    id: number;
    studentid: string;
    title: string;
    description: string;
    category: string;
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

export const getComplaints = async (token: string): Promise<{ compliant: ComplaintResponse[] }> => {
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

// Admin API
export const adminGetAllComplaints = async (token: string) => {
    try {
        const response = await fetch(`${API}/admin/complaints`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch admin complaints');
        return result;
    } catch (error) {
        console.error('Error fetching admin complaints:', error);
        throw error;
    }
};

export const adminGetAllStudents = async (token: string) => {
    try {
        const response = await fetch(`${API}/admin/students`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to fetch admin students');
        return result;
    } catch (error) {
        console.error('Error fetching admin students:', error);
        throw error;
    }
};

export const adminUpdateComplaintStatus = async (id: number, status: string, token: string) => {
    try {
        const response = await fetch(`${API}/admin/complaints/${id}/status`, {
            method: 'PATCH',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to update status');
        return result;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

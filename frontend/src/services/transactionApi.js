import API_BASE_URL from './api';

// Get user's transaction history
export const getUserTransactions = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        throw error;
    }
};

// Get transaction details by ID
export const getTransactionDetails = async (transactionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transaction details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        throw error;
    }
};

// Get transaction statistics
export const getTransactionStats = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/stats/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transaction statistics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction statistics:', error);
        throw error;
    }
};

// Create new transaction record
export const createTransaction = async (transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            throw new Error('Failed to create transaction');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

// Filter transactions by criteria
export const filterTransactions = async (userId, filters) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
        if (filters.amount) queryParams.append('amount', filters.amount);
        if (filters.package) queryParams.append('package', filters.package);

        const response = await fetch(`${API_BASE_URL}/transactions/user/${userId}/filter?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to filter transactions');
        }

        return await response.json();
    } catch (error) {
        console.error('Error filtering transactions:', error);
        throw error;
    }
};

// Export transaction history
export const exportTransactionHistory = async (userId, format = 'pdf') => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/export/${userId}?format=${format}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to export transaction history');
        }

        return await response.blob();
    } catch (error) {
        console.error('Error exporting transaction history:', error);
        throw error;
    }
};

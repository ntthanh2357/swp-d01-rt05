import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const TestConsultation = () => {
  const { user } = useContext(UserContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConsultation = async () => {
    if (!user || !user.accessToken) {
      alert("Vui lòng đăng nhập trước!");
      return;
    }

    setLoading(true);
    try {
      const testData = {
        fullName: "Nguyễn Văn A",
        email: "test@example.com",
        phone: "0123456789",
        country: "Úc",
        studyTime: "2025",
        city: "Melbourne, Australia",
        educationLevel: "Đại học",
        adviceType: "Online",
        scholarshipGoal: "Học bổng toàn phần",
        major: "Computer Science",
        note: "Test consultation",
        token: user.accessToken
      };

      const response = await fetch('/api/consultation/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ status: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!user || !user.userId) {
      alert("Vui lòng đăng nhập trước!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/consultation/status/${user.userId}`);
      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ status: 'error', data: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Test Consultation API</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>User Info:</strong></p>
        <p>Logged in: {user?.isLoggedIn ? 'Yes' : 'No'}</p>
        <p>User ID: {user?.userId}</p>
        <p>Role: {user?.role}</p>
        <p>Token: {user?.accessToken ? 'Present' : 'Missing'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConsultation} 
          disabled={loading || !user?.isLoggedIn}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {loading ? 'Testing...' : 'Test Register Consultation'}
        </button>
        
        <button 
          onClick={checkStatus} 
          disabled={loading || !user?.isLoggedIn}
          style={{ padding: '10px 20px' }}
        >
          {loading ? 'Checking...' : 'Check Consultation Status'}
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '15px', 
          border: '1px solid #ccc', 
          borderRadius: '5px',
          backgroundColor: result.status === 200 ? '#d4edda' : '#f8d7da'
        }}>
          <h4>Result:</h4>
          <p><strong>Status:</strong> {result.status}</p>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestConsultation; 
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

interface Enrollment {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  password?: string; // Stored but not displayed
}

export default function App() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: 'beginner',
    password: '',
    confirmPassword: ''
  });
  const [backendStatus, setBackendStatus] = useState<string>('Checking backend connection...');

  // Check backend and load enrollments
  useEffect(() => {
    // Check status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Failed to connect to backend: ' + err.message));

    // Fetch enrollments
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/enrollments');
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      } else {
        console.error('Failed to fetch enrollments');
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    if (!validateEmail(formData.email)) {
      setError('Invalid email: Must start with a letter and follow standard format.');
      return;
    }

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      experience: formData.experience,
      ...(formData.password ? { password: formData.password } : {})
    };

    try {
      if (editingId) {
        // Update
        const response = await fetch(`/api/enrollments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update enrollment');
        
        await fetchEnrollments();
        setEditingId(null);
      } else {
        // Create
        const response = await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to create enrollment');

        await fetchEnrollments();
      }

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        experience: 'beginner',
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (enrollment: Enrollment) => {
    setFormData({
      fullName: enrollment.fullName,
      email: enrollment.email,
      phone: enrollment.phone,
      experience: enrollment.experience,
      password: '', // Avoid displaying password hashes
      confirmPassword: ''
    });
    setEditingId(enrollment._id);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    
    try {
      const response = await fetch(`/api/enrollments/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchEnrollments();
      } else {
        console.error('Failed to delete enrollment');
      }
    } catch (err) {
      console.error('Error deleting enrollment:', err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setError(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      experience: 'beginner',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div>
      <h1>Full Stack Web Development Course Enrollment</h1>
      <p style={{ padding: '10px', backgroundColor: '#eef', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Backend Status:</strong> {backendStatus}
      </p>
      <p>Fill out the form below to manage enrollments.</p>
      
      {error && <p style={{ color: 'red' }}><strong>Error: {error}</strong></p>}

      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Enrollment' : 'New Enrollment'}</h2>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="fullName">Full Name:</label></td>
              <td>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="email">Email Address:</label></td>
              <td>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="phone">Phone Number:</label></td>
              <td>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="password">{editingId ? 'Change Password (optional):' : 'Create Password:'}</label></td>
              <td>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingId}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="confirmPassword">{editingId ? 'Confirm New Password:' : 'Re-enter Password:'}</label></td>
              <td>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!editingId && formData.password.length > 0}
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="experience">Coding Experience:</label></td>
              <td>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div>
          <button type="submit">{editingId ? 'Update Enrollment' : 'Enroll Now'}</button>
          {editingId && <button type="button" onClick={handleCancel}>Cancel</button>}
        </div>
      </form>

      <hr />
      <h2>Current Enrollments</h2>
      {enrollments.length === 0 ? (
        <p>No enrollments yet.</p>
      ) : (
        <table border={1}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e._id}>
                <td>{e.fullName}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{e.experience}</td>
                <td>
                  <button onClick={() => handleEdit(e)}>Edit</button>
                  <button onClick={() => handleDelete(e._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <h2>Course Details</h2>
      <ul>
        <li>HTML & CSS Basics</li>
        <li>JavaScript Fundamentals</li>
        <li>React & Modern Frontend</li>
        <li>Node.js & Express Backend</li>
        <li>Database Management (SQL & NoSQL)</li>
      </ul>
    </div>
  );
}

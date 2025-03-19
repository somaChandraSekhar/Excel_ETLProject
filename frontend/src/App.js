import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [newEntry, setNewEntry] = useState({ column1: '', column2: '', column3: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/data/');
    setData(response.data);
  };

  // const handleFileUpload = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   await axios.post('http://127.0.0.1:8000/api/upload/', formData);
  //   fetchData();
  // };
  const handleFileUpload = async (e) => {
    e.preventDefault();

    // Get the file from the input element
    const file = e.target.elements.file?.files[0]; // Assumes input has name="file"
    if (!file) {
        console.error('No file selected');
        return;
    }

    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', file); // 'file' matches backend expectation

    try {
        // Send the POST request to the backend
        const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Optional, Axios usually sets this
            },
        });
        console.log('Upload successful:', response.data);
        fetchData(); // Call fetchData only on success
    } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/data/${id}/`);
    fetchData();
  };

  const handleEdit = async (id, updatedData) => {
    await axios.put(`http://127.0.0.1:8000/api/data/${id}/`, updatedData);
    fetchData();
  };

  const handleAdd = async () => {
    await axios.post('http://127.0.0.1:8000/api/data/', newEntry);
    setNewEntry({ column1: '', column2: '', column3: '' });
    fetchData();
  };

  return (
    <div className="App">
      <h1>Excel Data Manager</h1>
      
      {/* File Upload */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload Excel</button>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Column1</th>
            <th>Column2</th>
            <th>Column3</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.column1}</td>
              <td>{item.column2}</td>
              <td>{item.column3}</td>
              <td>
                <button onClick={() => handleEdit(item.id, { ...item, column1: prompt('New Column1', item.column1) })}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Entry */}
      <div>
        <input value={newEntry.column1} onChange={(e) => setNewEntry({ ...newEntry, column1: e.target.value })} placeholder="Column1" />
        <input value={newEntry.column2} onChange={(e) => setNewEntry({ ...newEntry, column2: e.target.value })} placeholder="Column2" />
        <input value={newEntry.column3} onChange={(e) => setNewEntry({ ...newEntry, column3: e.target.value })} placeholder="Column3" type="number" />
        <button onClick={handleAdd}>Add Element</button>
      </div>

      {/* Charts */}
      <div>
        <PieChart width={400} height={400}>
          <Pie data={data} dataKey="column3" nameKey="column1" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
          <Tooltip />
        </PieChart>

        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="column1" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="column3" fill="#82ca9d" />
        </BarChart>

        <ScatterChart width={400} height={400}>
          <CartesianGrid />
          <XAxis dataKey="column3" name="Column3" />
          <YAxis dataKey="id" name="ID" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Data" data={data} fill="#8884d8" />
        </ScatterChart>
      </div>
    </div>
  );
}



// Function to handle file upload
async function uploadFile() {
  // Get the file input element
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  // Check if a file was selected
  if (!file) {
      console.error('No file selected');
      document.getElementById('status').textContent = 'Please select a file!';
      return;
  }

  // Create a FormData object and append the file
  const formData = new FormData();
  formData.append('file', file); // Key 'file' must match backend expectation

  try {
      // Send the file to the backend API using fetch
      const response = await fetch('http://localhost:8000/upload_excel/', {
          method: 'POST',
          body: formData,
          // No need to set 'Content-Type' manually; fetch handles it with FormData
      });

      // Parse the JSON response from the server
      const result = await response.json();

      // Check if the upload was successful
      if (response.ok) {
          console.log('Upload successful:', result);
          document.getElementById('status').textContent = 'File uploaded successfully!';
      } else {
          console.error('Upload failed:', result);
          document.getElementById('status').textContent = `Error: ${result.error}`;
      }
  } catch (error) {
      console.error('Error during upload:', error);
      document.getElementById('status').textContent = 'Upload failed due to a network error.';
  }
}

// Add event listener to the upload button
document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById('uploadButton');
  if (uploadButton) {
      uploadButton.addEventListener('click', uploadFile);
  }
});

export default App;
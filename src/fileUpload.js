import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [targetColumn, setTargetColumn] = useState('');
    const [visualizations, setVisualizations] = useState([]);
    const [loading, setLoading] = useState(false); // New state variable for loading

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleTargetColumnChange = (event) => {
        setTargetColumn(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('targetColumn', targetColumn); // Add target column to the form data

            try {
                setLoading(true); // Set loading state to true

                const response = await fetch('http://localhost:8080/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setVisualizations(data['Visualizations']);
                } else {
                    console.log('File upload failed.');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // Set loading state back to false
            }
        } else {
            console.log('Please select a file.');
        }
    };

    return (
        <div>
            <h1>Please Upload CSV File</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept=".csv" />
                <input type="text" value={targetColumn} onChange={handleTargetColumnChange} placeholder="Target Column" />
                <button type="submit">Upload</button>
            </form>

            <h2>Visualizations</h2>
            {loading ? (
                <div>Loading...</div> // Display loader when loading is true
            ) : (
                visualizations.map((imagePath, index) => (
                    <img key={index} src={imagePath} alt={`Confusion Matrix ${index + 1}`} />
                ))
            )}
        </div>
    );
};

export default FileUpload;

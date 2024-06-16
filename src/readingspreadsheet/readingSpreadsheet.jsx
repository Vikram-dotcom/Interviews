import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx'; // Import xlsx library

const SpreadsheetUpload = () => {
const [file, setFile] = useState(null);

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleUpload = async () => {
  if (!file) {
    alert('Please select a file.');
    return;
  }

  try {
    // Read the uploaded file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      await parseAndStoreData(data);
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error('Error uploading spreadsheet:', error);
    alert('There was an error uploading the spreadsheet. Please try again.');
  }
};

const parseAndStoreData = async (data) => {
  try {
    // Parse data from the spreadsheet (xlsx format)
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // Assuming only one sheet
    const sheet = workbook.Sheets[sheetName];
    const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Save each row to Firestore
    parsedData.forEach(async (row, index) => {
      // Skip header row (assuming first row is header)
      if (index === 0) return;

      try {
        const docRef = await addDoc(collection(db, 'candidates'), {
          
          profileID: row[0],
          candidate_name: row[1],
          candidate_marks: row[2],
          candidate_phone: row[3], 
          candidate_slot : row[4], 
          candidate_status : row[5], 
          candidate_comments : row[6], 
          candidate_drivelink : row[7], 
          candidate_education : row[8], 
          candidate_nextscheduledate : row[9], 
          candidate_notes : row[10], 
          candidate_passedoutyear : row[11], 
          candidate_photo : row[12], 
          candidate_profiledate : row[13], 
          candidate_revisedmarks : row[14], 
          

        });
        console.log('Document written with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    });

    alert('Data uploaded successfully!');
  } catch (error) {
    console.error('Error parsing spreadsheet:', error);
    alert('There was an error parsing the spreadsheet. Please check the format and try again.');
  }
};

return (
  <div className='readingspreadsheet'>
    <input className="readingspreadsheet1" type="file" onChange={handleFileChange} accept=".xlsx" />
    <button onClick={handleUpload}>Upload</button>
  </div>
);
};

export default SpreadsheetUpload;

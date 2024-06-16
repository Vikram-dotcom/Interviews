import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './candidateDetails.css';
import { Link } from 'react-router-dom';

const CandidateForm = () => {

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
    
        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }
    
        return `${year}-${month}-${day}`;
      };
  const [formData, setFormData] = useState({
    profileID: '',
    candidate_profiledate: getCurrentDate(),
    candidate_name: '',
    candidate_passedoutyear: '',
    candidate_marks: '',
    candidate_revisedmarks: '',
    candidate_status: '',
    candidate_comments: '',
    candidate_notes: '',
    candidate_phone: '',
    candidate_education: '',
    candidate_drivelink: '',
    candidate_slot:'',
    candidate_nextscheduledate: '',
    candidate_photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'candidate_marks':
      case 'candidate_revisedmarks':
        
        if (/^(0|[1-9]|1[0-9]|20)$/.test(value) || value === '') {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
        break;
      case 'candidate_name':
       
        if (/^[A-Za-z. ]{1,50}$/.test(value) || value === '') {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
        break;
      case 'candidate_phone':
        
        if (/^[6-9]\d{9}$/.test(value) || value === '') {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
        break;
      case 'candidate_passedoutyear':
       
        const currentYear = new Date().getFullYear();
        const inputYear = parseInt(value);
        if (value.length === 4 && inputYear >= 2000 && inputYear <= currentYear + 1) {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
        break;
      default:
       
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        break;
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      candidate_photo: e.target.files[0],
    }));
  };

  const deletephoto = (e) => {
    setFormData((prev) => ({
      ...prev,
      candidate_photo: null,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Uploading photo to Firebase Storage
      let photoURL = '';
      if (formData.candidate_photo) {
        const photoRef = ref(storage, `photos/${formData.candidate_name}`);
        await uploadBytes(photoRef, formData.candidate_photo);
        photoURL = await getDownloadURL(photoRef);
      }

      // Saving form data to Firestore
      await setDoc(doc(db, 'candidates', formData.profileID), {
        ...formData,
        candidate_photo: photoURL,
      });

      alert('Candidate data submitted successfully!');
      setFormData({
        profileID: '',
        candidate_profiledate: '',
        candidate_name: '',
        candidate_passedoutyear: '',
        candidate_marks: '',
        candidate_revisedmarks: '',
        candidate_status: '',
        candidate_comments: '',
        candidate_notes: '',
        candidate_phone: '',
        candidate_education: '',
        candidate_drivelink:'',
        candidate_nextscheduledate: '',
        candidate_slot: '',
        candidate_photo: null,
      });
    } catch (error) {
      console.error('Error submitting candidate data:', error);
      alert('There was an error submitting the candidate data. Please try again.');
    }
  };

  return (
    <div className='outerformdiv'>
        
        <div className='leftdiv'>
            <Link to="/list">
        <img style={{width:'40px',height:'40px'}} alt="listicon" src="https://www.freeiconspng.com/uploads/list-icons-free-icons-in-devine--icon-search-engine--5.png" />
            </Link>
            <div className='leftdivheading' >
        <h1>New</h1>
        <h1>Candidate</h1>
        <h1>Record</h1>

        </div>
        </div>
    <div className='rightdiv'>
    <form onSubmit={handleSubmit} className="form-container">
         <div style={{backgroundColor:'white',textAlign:'center',height:'65px'}}>
          <input style={{width:'170px'}} type="date" id="candidate_profiledate" name="candidate_profiledate" value={formData.candidate_profiledate} onChange={handleChange} required />
        </div>

        <div className="form">
        <div className="form-details">
            <div className='idmarksdiv'>
            <div>
          <label style={{color:'#827e7e'}} htmlFor="profileID">Profile ID:</label>
          <input type="text" id="profileID" name="profileID" autoFocus value={formData.profileID} onChange={handleChange} required />
          </div>
          <div>
          <label style={{color:'#827e7e'}} htmlFor="candidate_marks">Marks:</label>
          <input type="text" id="candidate_marks" name="candidate_marks" value={formData.candidate_marks} onChange={handleChange} required />
          </div>
          <div>
          
          <label style={{color:'#827e7e'}} htmlFor="candidate_revisedmarks">Revised Marks:</label>
          <input type="text" id="candidate_revisedmarks" name="candidate_revisedmarks" value={formData.candidate_revisedmarks} onChange={handleChange} />
        
          </div>
          </div>
        </div>
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_name">Name:</label>
          <input type="text" id="candidate_name" name="candidate_name" value={formData.candidate_name} onChange={handleChange} required />
        </div>
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_phone">Phone:</label>
          <input type="tel" id="candidate_phone" name="candidate_phone" value={formData.candidate_phone} onChange={handleChange} required />
        </div>
        
       
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_passedoutyear">Passed Out Year:</label>
          <input type="text" id="candidate_passedoutyear" name="candidate_passedoutyear" value={formData.candidate_passedoutyear} onChange={handleChange} required />
        </div>
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_education">Education:</label>
          <input type="text" id="candidate_education" name="candidate_education" value={formData.candidate_education} onChange={handleChange}  />
        </div>
        
        <div className="form-details">
        
            
          <label style={{color:'#827e7e'}} htmlFor="candidate_status">Status:</label>
          <select id="candidate_status" name="candidate_status" value={formData.candidate_status} onChange={handleChange} >
            <option style={{color:'#827e7e'}} value="">Select Status</option>
            <option value="ER">ER</option>
            <option value="Next Round">Next Round</option>
          </select>
          
          </div>
          <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_slot">Slot:</label>
          <select id="candidate_slot" name="candidate_slot" value={formData.candidate_slot} onChange={handleChange} required>
            <option style={{color:'#827e7e'}} value="">Select Slot</option>
            <option value="Blue">10:00am - 10:30am</option>
            <option value="Green">12:00pm - 12:30pm</option>
            <option value="Orange">02:00pm - 02:30pm</option>
          </select>
          </div>
        
       
        
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_nextscheduledate">Next Schedule Date:</label>
          <input style={{color:'#827e7e'}} type="date" id="candidate_nextscheduledate" name="candidate_nextscheduledate" value={formData.candidate_nextscheduledate} onChange={handleChange} />
        </div>
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_drivelink">Drive Link:</label>
          <input type="text" id="candidate_drivelink" name="candidate_drivelink" value={formData.candidate_drivelink} onChange={handleChange} />
        </div>

        <div className="form-details">
            <div>
          <label style={{color:'#827e7e',display:'inline-block'}} htmlFor="candidate_photo">Photo:</label>
          
          {formData.candidate_photo && (
            <span>
              <img className='photouploadtick' src='https://www.shutterstock.com/image-vector/checkmark-icon-vector-on-white-600nw-1265668276.jpg' alt = "uploadedPhotoIndicator" style={{ maxWidth: '100px', maxHeight: '100px' }} />
            </span>
          )}
          </div>
          <input style={{color:'#827e7e'}} type="file" id="candidate_photo" name="candidate_photo" onChange={handleFileChange} />
          {formData.candidate_photo && (
          <span><img  className='photouploaddelete' onClick={deletephoto} src="https://icons.veryicon.com/png/o/miscellaneous/max-cook/wrong-7.png" alt="deletePhotoIndicator" /></span>
          )}
        </div>
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_comments">Comments (max 400 characters):</label>
          <textarea type="text" id="candidate_comments" name="candidate_comments"  maxLength={400} value={formData.candidate_comments} onChange={handleChange} />
        </div>
        <div className="form-details">
          <label style={{color:'#827e7e'}} htmlFor="candidate_notes">Notes (max 400 characters):</label>
          <textarea type="text" id="candidate_notes" name="candidate_notes"  maxLength={400} value={formData.candidate_notes} onChange={handleChange} />
        </div>
    
      </div>
      <div className="form-details1">
        <div className='submitbutton'>
      <button type="submit">Submit</button>
      </div>
      </div>
    </form>
    </div>
    </div>
  );
};

export default CandidateForm;

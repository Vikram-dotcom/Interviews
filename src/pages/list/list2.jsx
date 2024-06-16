import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import "./list2.css"; 
import { Link } from 'react-router-dom';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [filterStatus, setFilterStatus] = useState(''); 
    const [filterMarks, setFilterMarks] = useState(''); 
    const [filterName, setnameFilter] = useState(''); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataSnapshot = await getDocs(collection(db, 'candidates'));
                const data = dataSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => a.profileID - b.profileID);
                setCandidates(data);
                setFilteredCandidates(data); 
            } catch (error) {
                console.error('Error fetching candidates: ', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filterData = () => {
            let filteredData = [...candidates]; 

            if (filterStatus !== '') {
                filteredData = filteredData.filter(candidate => candidate.candidate_status === filterStatus);
            }

            if (filterMarks !== '') {
                filteredData = filteredData.filter(candidate => candidate.candidate_marks >= parseInt(filterMarks));
            }
            
            if (filterName !== '') {
                filteredData = filteredData.filter(candidate => candidate.candidate_name.toLowerCase().includes(filterName.toLowerCase()));
            }
           
            setFilteredCandidates(filteredData);
        };

        filterData();
    }, [filterStatus, filterMarks, filterName, candidates]);

    const handleStatusChange = async (event, candidateId) => {
        const newStatus = event.target.value; 
        try {
           
            await updateDoc(doc(db, 'candidates', candidateId), {
                candidate_status: newStatus
            });

            
            const updatedCandidates = candidates.map(candidate => {
                console.log(candidate.id, candidateId)
                if (candidate.id === candidateId) {
                    return { ...candidate, candidate_status: newStatus };
                }
                return candidate;
            });

            setCandidates(updatedCandidates);
            setFilteredCandidates(updatedCandidates); 
        } catch (error) {
            console.error('Error updating status: ', error);
        }
    };

    const handleMarksChange = event => {
        setFilterMarks(event.target.value); 
    };

    const handlenameChange = event => {
        setnameFilter(event.target.value); 
    };

    return (
        <div className="candidate-listcontainer">
            <div>
                <Link to="/">
                    <img style={{ display: 'inline-block', width: '51px' }} src="https://static.vecteezy.com/system/resources/thumbnails/014/391/893/small_2x/home-icon-isolated-on-transparent-background-black-symbol-for-your-design-free-png.png" />
                </Link>
                <h1 style={{ display: 'inline-block', color: ' rgb(130, 126, 126);' }}>Candidates List</h1>
            </div>
            <div style={{ marginLeft: '0' }} className="filter-section">
                <label htmlFor="statusFilter">Status:</label>
                <select id="statusFilter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All</option>
                    <option value="ER">ER</option>
                    <option value="Next Round">Next Round</option>
                </select>
            </div>

            <div className="filter-section">
                <label htmlFor="filterName">Name:</label>
                <input
                    type="text"
                    id="filterName"
                    value={filterName}
                    onChange={handlenameChange}
                    placeholder="Enter name"
                />
            </div>

            <div className="filter-section">
                <label htmlFor="marksFilter">Marks >=:</label>
                <input
                    type="text"
                    id="marksFilter"
                    value={filterMarks}
                    onChange={handleMarksChange}
                    placeholder="Enter marks"
                />
            </div>

            <div style={{ float: 'right', display: 'inline-block', marginTop: '71px' }}>
                {filteredCandidates.length} records
            </div>

            <table style={{ borderRadius: '7px' }} className="candidate-table">
                <thead style={{ borderRadius: '7px' }}>
                    <tr>
                        <th style={{ width: '7%', borderRight: '1px solid #cbcaca' }}>Profile#</th>
                        <th style={{ width: '13%', borderRight: '1px solid #cbcaca' }}>Date</th>
                        <th style={{ width: '13%', borderRight: '1px solid #cbcaca' }}>Name</th>
                        <th style={{ width: '5%', borderRight: '1px solid #cbcaca' }}>Marks</th>
                        <th style={{ width: '8%', borderRight: '1px solid #cbcaca' }}>Education</th>
                        <th style={{ width: '5%', borderRight: '1px solid #cbcaca', textAlign: 'center' }}>Status</th>
                        <th style={{ width: '8%', borderRight: '1px solid #cbcaca', textAlign: 'center' }}>Phone</th>
                        <th style={{ width: '15%', borderRight: '1px solid #cbcaca', textAlign: 'center' }}>Comments</th>
                        <th style={{ width: '15%', borderRight: '1px solid #cbcaca', textAlign: 'center' }}>Notes</th>
                        <th style={{ width: '15%', borderRight: '1px solid #cbcaca', textAlign: 'center' }}>Next Schedule</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map(candidate => (
                            <tr key={candidate.id} style={{ backgroundColor: 'white' }}>
                                <td style={{ textAlign: 'center' }}>{candidate.profileID}</td>
                                <td style={{ textAlign: 'left' }}>{candidate.candidate_profiledate}</td>
                                <td>{candidate.candidate_name}</td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_marks}</td>
                                <td>{candidate.candidate_education}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <select className="listselect" style={{ borderRadius: '7px' }}
                                        value={candidate.candidate_status}
                                        onChange={e => handleStatusChange(e, candidate.id)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="ER">ER</option>
                                        <option value="Next Round">Next Round</option>
                                    </select>
                                </td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_phone}</td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_comments}</td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_notes}</td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_nextscheduledate}</td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">No candidates found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CandidateList;

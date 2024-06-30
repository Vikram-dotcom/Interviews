import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import "./nextschedule.css"; 
import { Link } from 'react-router-dom';

const NextScheduleList = () => {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [filterStatus, setFilterStatus] = useState(''); 
    const [filterMarks, setFilterMarks] = useState(''); 
    const [filterDate,setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [FilterScheduleDate,setFilterScheduleDate] = useState('');
    const [filterName, setnameFilter] = useState(''); 

    useEffect(() => {
        console.log(filterDate);
        const fetchData = async (scheduledate) => {
            try {
                const q = query(collection(db, 'candidates'), where('candidate_nextscheduledate', '==', scheduledate));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log(data)
                //data.sort((a, b) => a.profileID - b.profileID);
                const Nextround = ['Excel', 'Programming', 'SQL'];

                const groupedCandidates = data.reduce((acc, candidate) => {
                  if (!acc[candidate.candidate_NextRound]) {
                      acc[candidate.candidate_NextRound] = [];
                  }
                  acc[candidate.candidate_NextRound].push(candidate);
                  console.log(candidate.candidate_nextscheduledate)
                  return acc;
              }, {});
          console.log('groupedCandidates',groupedCandidates)
              const sortedCandidates = Nextround.flatMap(round => groupedCandidates[round] || []);
              console.log('sortedCandidates',sortedCandidates)
                setCandidates(sortedCandidates);
                setFilteredCandidates(sortedCandidates); 
            } catch (error) {
                console.error('Error fetching candidates: ', error);
            }
        };

        fetchData(filterDate);
    }, [filterDate]);

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

            if(filterDate !== ''){
                filteredData = filteredData.filter(candidate => {
                    console.log(candidate.candidate_profiledate,filterDate);
                    return (candidate.candidate_profiledate == filterDate)}
                )
            }
            if(FilterScheduleDate !== ''){
                filteredData = filteredData.filter(candidate => {
                    console.log(candidate.candidate_profiledate,FilterScheduleDate);
                    return (candidate.candidate_profiledate == FilterScheduleDate)}
                )
            }
            
            setFilteredCandidates(filteredData);
        };

        filterData();
    }, [filterStatus, filterMarks, filterName, FilterScheduleDate,candidates]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
      };

   

    
    const handleStatusChange = async (event, candidateId, fieldtoset) => {
        const newvalue = event.target.value; 
        console.log(fieldtoset);
        console.log(newvalue);
        try {
           
            if (fieldtoset == 'candidate_status'){
            await updateDoc(doc(db, 'candidates', candidateId), {
                candidate_status: newvalue,
                candidate_nextscheduledate: '',
                candidate_NextRound :''
            });
            const updatedCandidates = candidates.map(candidate => {
                console.log(candidate.id, candidateId)
                if (candidate.id === candidateId) {
                    
                    return { ...candidate, fieldtoset: newvalue,candidate_nextscheduledate: '',candidate_NextRound :''  };
                }
                return candidate;
            });
            setCandidates(updatedCandidates);
            setFilteredCandidates(updatedCandidates); 
            }

            if (fieldtoset == 'candidate_nextscheduledate'){
                await updateDoc(doc(db, 'candidates', candidateId), {
                    candidate_nextscheduledate: newvalue
                });
                const updatedCandidates = candidates.map(candidate => {
                    console.log(candidate.id, candidateId)
                    if (candidate.id === candidateId) {
                        console.log('line96',fieldtoset)
                        return { ...candidate, fieldtoset: newvalue };
                    }
                    return candidate;
                });
                setCandidates(updatedCandidates);
                setFilteredCandidates(updatedCandidates); 
                }

                if (fieldtoset == 'candidate_NextRound'){
                    await updateDoc(doc(db, 'candidates', candidateId), {
                        candidate_NextRound: newvalue
                    });
                    const updatedCandidates = candidates.map(candidate => {
                        console.log(candidate.id, candidateId)
                        if (candidate.id === candidateId) {
                            console.log('line96',fieldtoset)
                            return { ...candidate, fieldtoset: newvalue };
                        }
                        return candidate;
                    });
                    setCandidates(updatedCandidates);
                    setFilteredCandidates(updatedCandidates); 
                    }
        } catch (error) {
            console.error('Error updating status: ', error);
        }
    };


    const handleMarksChange = event => {
        setFilterMarks(event.target.value); 
    };

    const handleDateChange = event =>{
        setFilterDate(event.target.value);
    }
    const handleScheduleDateChange = event =>{
        setFilterScheduleDate(event.target.value);
    }
    
    const handlenameChange = event => {
        setnameFilter(event.target.value); 
    };

    return (
        <div className="candidate-listcontainer">
            <div>
                <Link to="/">
                    <img style={{ display: 'inline-block', width: '51px' }} src="https://static.vecteezy.com/system/resources/thumbnails/014/391/893/small_2x/home-icon-isolated-on-transparent-background-black-symbol-for-your-design-free-png.png" />
                </Link>
                <Link to="/upload">
                <h1 style={{ display: 'inline-block',color:'black' }}>Scheduled Candidates</h1>
                </Link>
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

            <div className='filter-section'>
                <label htmlFor='dateFilter'>Scheduled Date</label>
                <input
                    type="date"
                    id="dateFilter"
                    value={filterDate}
                    onChange={handleDateChange}
                    
                />
            </div>

            {/* <div className='filter-section'>
                <label htmlFor='scheduleDateFilter'>Scheduled Date</label>
                <input
                    type="date"
                    id="scheduleDateFilter"
                    value={filterDate}
                    onChange={handleScheduleDateChange}
                    
                />
            </div> */}

            <div style={{ float: 'right', display: 'inline-block', marginTop: '71px' }}>
                {filteredCandidates.length} records
            </div>

            <table style={{ borderRadius: '7px' }} className="candidate-table">
                <thead style={{ borderRadius: '7px' }}>
                    <tr>
                        <th style={{ width: '7%', borderRight: '1px solid #cbcaca' }}>Profile#</th>
                       
                        <th style={{ width: '13%', borderRight: '1px solid #cbcaca' }}>Name</th>
                        {/* <th style={{ width: '5%', borderRight: '1px solid #cbcaca' }}>Marks</th>
                        <th style={{ width: '8%', borderRight: '1px solid #cbcaca' }}>Education</th> */}
                        
                        <th style={{ width: '12%', borderRight: '1px solid #cbcaca', textAlign: 'center' }}>Round</th>
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
                            <tr key={candidate.id} style={{ backgroundColor: 'white', boxShadow: `inset -0.5px -1px 0px ${candidate.candidate_slot}`}}>
                                <td style={{ textAlign: 'center'}}>{candidate.profileID}</td>
                                
                                <td style={{ userSelect:'text' }}>{candidate.candidate_name}</td>
                                {/* <td style={{ textAlign: 'center' }}>{candidate.candidate_marks}</td>
                                <td>{candidate.candidate_education}</td> */}
                                <td style={{ userSelect:'text' }}>{candidate.candidate_NextRound}</td>

                                <td style={{ textAlign: 'center' }}>
                                    <select className="listselect" style={{ borderRadius: '7px' }}
                                        value={candidate.candidate_status}
                                        onChange={e => handleStatusChange(e, candidate.id, 'candidate_status')}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="ER">ER</option>
                                        <option value="Next Round">Next Round</option>
                                    </select>
                                </td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_phone}</td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_comments}</td>
                                <td style={{ textAlign: 'center' }}>{candidate.candidate_notes}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{position:'relative'}}>
                                        <input type='date' id='nextScheduleDate' onChange={e => handleStatusChange(e, candidate.id, 'candidate_nextscheduledate')} 
                                        value = {candidate.candidate_nextscheduledate}
                                        disabled = {candidate.candidate_status !== '' && candidate.candidate_status !== 'Next Round'}
                                        />
                                    </div>
                                </td>
                                {/* <td style={{ textAlign: 'center' }}>
                                    <select className="listselect" style={{ borderRadius: '7px' }}
                                        value={candidate.candidate_NextRound}
                                        onChange={e => handleStatusChange(e, candidate.id, 'candidate_NextRound')}
                                        disabled = {candidate.candidate_status !== '' && candidate.candidate_status !== 'Next Round'}
                                        style = {{borderColor: candidate.candidate_status === 'Next Round' && 
                                            (!candidate.candidate_nextscheduledate || !candidate.candidate_NextRound) 
                                            ? 'red' 
                                            : ''}}>
                                        <option value="">Select Round</option>
                                        <option value="Excel">Excel</option>
                                        <option value="Programming">Programming</option>
                                        <option value="SQL">SQL</option>
                                    </select>
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan="10">No candidates found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NextScheduleList;

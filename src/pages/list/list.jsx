import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSnapshot = await getDocs(collection(db, "candidates"));
        const data = dataSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates: ', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Candidates List</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Profile#</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Marks</th>
            <th style={tableHeaderStyle}>Education</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Phone</th>
            <th style={tableHeaderStyle}>Notes</th>
            <th style={tableHeaderStyle}>Photo</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td style={tableCellStyle}>{candidate.id}</td>
                <td style={tableCellStyle}>{candidate.candidate_name}</td>
                <td style={tableCellStyle}>{candidate.candidate_marks}</td>
                <td style={tableCellStyle}>{candidate.candidate_education}</td>
                <td style={tableCellStyle}>{candidate.candidate_status}</td>
                <td style={tableCellStyle}>{candidate.candidate_phone}</td>
                <td style={tableCellStyle}>{candidate.candidate_notes}</td>
                <td style={tableCellStyle}>
                  {candidate.candidate_photo && (
                    <img src={candidate.candidate_photo} alt="Candidate Photo" style={{ maxWidth: "100px" }} />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No candidates found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  borderBottom: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tableCellStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

export default CandidateList;
 
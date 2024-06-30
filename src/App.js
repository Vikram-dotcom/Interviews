
import React from 'react';
import CandidateForm from './components/candidateDetails';
import CandidateList from './pages/list/list2';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpreadsheetUpload from './readingspreadsheet/readingSpreadsheet';
import NextScheduleList from './pages/nextschedule/nextschedule';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route
                  index
                  element={               
                      <CandidateForm />               
                  }
                />
                  <Route
                    path="/List"
                    element={                  
                        <CandidateList />                 
                    }
                  />            
                  <Route
                    path="/Upload"
                    element={                  
                        <SpreadsheetUpload />                 
                    }
                  /> 
                   <Route
                    path="/NextSchedule"
                    element={                  
                        <NextScheduleList />                 
                    }
                  /> 

            </Route>
        </Routes>     
      </BrowserRouter>
    </>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../Axios/axiosInstance';
import {Helmet} from "react-helmet";

const Carriers = () => {
  const [activeTab, setActiveTab] = useState('non-tech');
  const [expanded, setExpanded] = useState(null);
  const [jobListings, setJobListings] = useState([]);

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Fetch data from backend (using GET method with environment variable for API URL)
  useEffect(() => {
  
        window.scrollTo(0, 0); // Scroll to the top
    const response = axiosInstance.get(`/carrier/publicCarrier/`)
    try {
          if (response.status === 200) {
      setJobListings(response.data.data.carrier)
    }
    } catch (error) {
      console.log(error.message);
      
    }


  
  }, []);

  // Filter job listings based on the active tab
  const filteredJobs = jobListings.filter(
    (job) =>
      (activeTab === 'non-tech' && job.categories === 'Non-Tech Positions') ||
      (activeTab === 'tech' && job.categories === 'Tech Positions')
  );

  return (
      <>
        <Helmet>
          <title>Biotech Maali - Carriers </title>
        </Helmet>
    <div className="min-h-screen flex flex-col items-center justify-between p-4">
      <div className="w-full border-b">
        {/* Header Title */}
        <div className="text-center py-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">
            Shape the Future with Biotech Maali
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('non-tech')}
            className={`px-8 py-3 relative ${
              activeTab === 'non-tech' ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            Non -Tech Positions
            {activeTab === 'non-tech' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-8 py-3 relative ${
              activeTab === 'tech' ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            Technology Positions
            {activeTab === 'tech' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow w-full mt-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Sorry, no positions available</h3>
            <p className="text-gray-500">Stay tuned for new openings!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleExpand(job.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">{job.position_name}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expanded === job.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {expanded === job.id && (
                  <div className="mt-2 text-gray-500">
                    <p><strong>Job Summary:</strong> {job.job_summary}</p>
                    <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
                    <p><strong>Desired Skills:</strong> {job.desired_skills}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

        </>
  );
};

export default Carriers;

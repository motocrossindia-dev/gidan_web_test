'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../Axios/axiosInstance';
import { Helmet } from "react-helmet-async"

const Carriers = () => {
  const [activeTab, setActiveTab] = useState('non-tech');
  const [expanded, setExpanded] = useState(null);
  const [jobListings, setJobListings] = useState([]);

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Fetch data from backend (using GET method with environment variable for API URL)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        window.scrollTo(0, 0);
        const response = await axiosInstance.get(`/carrier/publicCarrier/`);
        if (response.status === 200) {
          setJobListings(response.data.data.carrier);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchJobs();
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
        <title>Gidan - Carriers </title>

        <meta
          name="description"
          content="Explore career opportunities at Gidan and grow with us. Join our team and be part of a smarter, greener gardening journey."
        />

        <link
          rel="canonical"
          href="https://www.gidan.store/careers"
        />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-between p-4">
        <div className="w-full border-b">
          {/* Header Title */}
          <div className="text-center py-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">
              Shape the Future with Gidan
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('non-tech')}
              className={`px-8 py-3 relative ${activeTab === 'non-tech' ? 'text-gray-800' : 'text-gray-500'
                }`}
            >
              Non -Tech Positions
              {activeTab === 'non-tech' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-8 py-3 relative ${activeTab === 'tech' ? 'text-gray-800' : 'text-gray-500'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-xl p-6 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 bg-white"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{job.position_name}</h2>
                      <p className="text-sm text-gray-500">{job.categories}</p>
                    </div>
                    {job.google_form && (
                      <a
                        href={job.google_form}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                      >
                        Apply Now
                      </a>
                    )}
                  </div>

                  {/* Expand/Collapse */}
                  <button
                    onClick={() => handleExpand(job.id)}
                    className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                  >
                    {expanded === job.id ? "Hide Details ▲" : "View Details ▼"}
                  </button>

                  {/* Details (with animation) */}
                  {/* Details (with animation) */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded === job.id ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="space-y-4 text-gray-700 text-sm">
                      {/* Row with Job Summary + Responsibilities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <span className="font-medium">Job Summary: </span>
                          <p>{job.job_summary}</p>
                        </div>
                        <div>
                          <span className="font-medium">Responsibilities: </span>
                          <p className="whitespace-pre-line">{job.responsibilities}</p>
                        </div>
                      </div>

                      {/* Desired Skills below full width */}
                      <div>
                        <span className="font-medium">Desired Skills: </span>
                        <p>{job.desired_skills}</p>
                      </div>
                    </div>
                  </div>

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

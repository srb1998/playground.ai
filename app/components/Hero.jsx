"use client"

import { useState } from 'react';
// import DocViewer,{DocViewerRenderers} from 'react-doc-viewer';
import axios from 'axios';
import Loader from './Loader';

const Hero = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileRendered, setFileRendered] = useState(false)


  const handleFileSubmit = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setFileRendered(true);
  };

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
    withCredentials: true,
  };

  const handleUpload = async(e) => {
    e.preventDefault()
    setLoading(true);
    setFileRendered(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5328/summarize', formData, config);

      if (response.status === 200) {
        setSummary(response.data.summary);
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col max-w-4xl p-4 bg-white rounded shadow">
      <div className="mb-5 flex justify-center">
        <h1 className="text-4xl font-bold text-blue-500">Text Summarizer</h1>
      </div>
      {/* Upload Form */}
      <form className="m-5 flex justify-center">
        <input
          className="text-black font-mono mb-4"
          type="file"
          onChange={handleFileSubmit}
        />
        <button
          className="font-semibold font-mono text-black border-2 border-black p-2 rounded-md bg-sky-500 hover:bg-sky-700"
          onClick={handleUpload}
        >
          Summarize
        </button>
      </form>
      <div className="min-h-screen bg-gray-100">
        {/* {fileRendered && (
          <>
            <h2 className="text-xl font-bold mb-2 flex justify-center">
              Document Viewer
            </h2>
            <DocViewer
              documents={[
                { uri: URL.createObjectURL(file), fileType: file.type },
              ]}
              pluginRenderers={DocViewerRenderers}
            />
          </>
        )} */}

        {/* Loading Animation */}
        {loading && (
          <div className="m-10 flex flex-col items-center justify-center space-y-2">
            <p className="text-2xl text-black font-medium m-10">
              Summarizing...
            </p>
            <div className="flex m-10 space-x-2 justify-center items-center">
              <Loader />
            </div>
          </div>
        )}

        {/* Summary after loading */}
        {summary && !loading && (
          <div className="mt-5 text-black font-mono">
            <div className="flex justify-center items-center bg-blue-500 text-white py-3 px-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Summary</h2>
            </div>
            <div className="p-5 bg-white shadow-lg rounded-b-lg">
              <p className="font-mono font-semibold text-gray-800">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero

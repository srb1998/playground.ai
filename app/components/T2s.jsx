"use client"

import { useState } from "react"
import Loader from "./Loader"
// import Form from "./Form"
import axios from "axios"

const T2s = () => {
    const [loading, setLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState(null)
    const [text, setText] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post("http://127.0.0.1:5328/text-speech", { text }, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch(error){
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 p-4 mt-5">
        <div className="p-2 bg-blue-400 text-lg rounded">
          <h1 className="font-bold text-gray-900 ">Text to Speech</h1>
        </div>
        {/* <Form handleSubmit={handleSubmit} /> */}
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={100}
            required
            placeholder="Enter prompt here..."
            className="w-full p-2 h-20 border border-gray-300 rounded resize-none"
          />
          <div style={{ textAlign: "right" }}>{text.length}/100</div>
          <button
            type="submit"
            className="w-full py-2 px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="w-full md:w-2/3 p-4 bg-gray-200 h-screen">
        <div className="h-full flex justify-center items-center">
          {loading ? (
            <Loader />
          ) : (
            <>
              {audioUrl && (
                <audio controls>
                  <source id="audioSource" src={audioUrl} type="audio/wav" />
                </audio>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default T2s
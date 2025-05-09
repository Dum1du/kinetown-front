import { React, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { SpiningLoadingSmall } from "./SpiningLoading";

const downloadEndPoint = import.meta.env.VITE_DOWNLOAD_ENDPOINT;
const type03 = import.meta.env.VITE_TYPE_03;

function DownloadBtn({
  type,
  language,
  link,
  subtitleName,
  isActive,
  onSelect,
  reload,
}) {
  const [pressed, setPressed] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    onSelect(pressed);

    let time1, time2, time3;
    if (pressed) {
      time1 = setTimeout(() => {
        setStatusText(
          "This is my first time doing this, so bear with me—just need about a minute!"
        );
      }, 5000);

      time2 = setTimeout(() => {
        setStatusText("Almost done... Hang tight!");
      }, 40000);

      time3 = setTimeout(() => {
        setStatusText("Finelizing... Almost there!");
      }, 70000);
    } else {
      setStatusText(""); // Reset status text when not pressed
    }

    return () => {
      clearTimeout(time1);
      clearTimeout(time2);
      clearTimeout(time3);
    };
  }, [pressed]);

  const handleDownload = async (link) => {
    // console.log("Download Link:", link); // Debugging log
    // console.log("Selected Language:", language); //
    setPressed(true); // Set pressed state to true
    try {
      const response = await axios.post(
        downloadEndPoint, //production
        // "http://localhost:5002/download-translate",
        {
          downloadLink: link,
          targetLanguage: language,
          subtitleName: subtitleName,
        },
        { responseType: "blob" }
      );

      // Create a download link for the translated file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${subtitleName}_${language}.srt`;
      a.click();
      a.remove();

      setPressed(false); // Reset pressed state after download
      if (reload && subtitleName) {
        reload(subtitleName); // Call reload function if provided
      }
    } catch (err) {
      // console.error("Download Error:", err);
      alert("Server is busy, Try again in few minutes.");
      setPressed(false); // Reset pressed state on error
    }
  };

  {
    return (
      <div style={{ display: isActive ? "block" : "none" }}>
        <button
          key={type}
          onClick={() => {
            handleDownload(link);
          }}
          disabled={pressed}
          className="mt-2 px-4 py-2 bg-[#3A7CA5] text-white rounded-lg hover:bg-[#3a7ca5ab] disabled:bg-gray-600 
        disabled:cursor-not-allowed disabled:py-2.5 disabled:px-13 disabled:opacity-75"
        >
          {pressed ? (
            <SpiningLoadingSmall />
          ) : type === type03 ? (
            `Download (${language})`
          ) : (
            `Download ${type} (${language})`
          )}
        </button>
        {pressed && (
          <div className="mt-2 text-gray-200 text-sm animate-pulse">
            {statusText}
          </div>
        )}
      </div>
    );
  }
}

export default DownloadBtn;

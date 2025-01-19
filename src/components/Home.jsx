import { Copy, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000"; // Replace with your backend URL

const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [pastes, setPastes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");

  // Fetch all pastes
  const fetchPastes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pastes`);
      const data = await response.json();
      setPastes(data);
    } catch (error) {
      console.error("Error fetching pastes:", error);
    }
  };

  // Create or update paste
  const createOrUpdatePaste = async () => {
    const paste = {
      title,
      content: value,
      createdAt: new Date().toISOString(),
    };

    try {
      if (pasteId) {
        // Update paste
        await fetch(`${API_BASE_URL}/pastes/${pasteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paste),
        });
        toast.success("Paste updated successfully!");
      } else {
        // Create new paste
        await fetch(`${API_BASE_URL}/pastes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paste),
        });
        toast.success("Paste created successfully!");
      }

      // Reset form and reload pastes
      setTitle("");
      setValue("");
      setSearchParams({});
      fetchPastes();
    } catch (error) {
      console.error("Error saving paste:", error);
      toast.error("Failed to save paste.");
    }
  };

  // Fetch a specific paste when pasteId changes
  useEffect(() => {
    const fetchPasteById = async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/pastes/${id}`);
        const data = await response.json();
        setTitle(data.title);
        setValue(data.content);
      } catch (error) {
        console.error("Error fetching paste:", error);
      }
    };

    if (pasteId) {
      fetchPasteById(pasteId);
    }
  }, [pasteId]);

  // Fetch all pastes on initial load
  useEffect(() => {
    fetchPastes();
  }, []);

  const resetPaste = () => {
    setTitle("");
    setValue("");
    setSearchParams({});
  };

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${
              pasteId ? "w-[80%]" : "w-[85%]"
            } text-black border border-input rounded-md p-2`}
          />
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={createOrUpdatePaste}
          >
            {pasteId ? "Update Paste" : "Create My Paste"}
          </button>
          {pasteId && (
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={resetPaste}
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>

        <div
          className={`w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] backdrop-blur-2xl`}
        >
          <div
            className={`w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)]`}
          >
            <div className="w-full flex gap-x-[6px] items-center select-none group">
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(255,95,87)]" />
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(254,188,46)]" />
              <div className="w-[13px] h-[13px] rounded-full bg-[rgb(45,200,66)]" />
            </div>
            <button
              className={`flex justify-center items-center transition-all duration-300 ease-in-out group`}
              onClick={() => {
                navigator.clipboard.writeText(value);
                toast.success("Copied to Clipboard", {
                  position: "top-right",
                });
              }}
            >
              <Copy className="group-hover:text-sucess-500" size={20} />
            </button>
          </div>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write Your Content Here...."
            className="w-full p-3 focus-visible:ring-0"
            style={{ caretColor: "#000" }}
            rows={20}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

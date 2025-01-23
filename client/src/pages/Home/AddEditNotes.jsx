import React, { useState } from "react"; 
import { MdClose } from "react-icons/md"; 
import axiosInstance from "../../utils/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddEditNoteModal.css";

const AddEditNotes = ({ noteData, type, getAllTasks, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [status, setStatus] = useState(noteData?.status || "ToDo");
  const [dueDate, setDueDate] = useState(noteData?.dueDate ? new Date(noteData.dueDate) : null);
  const [error, setError] = useState(null);

  // api calling to create new task
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/api/tasks",
        { title, content, status, dueDate },
        { withCredentials: true }
      );
      console.log("Response from backend (addNewNote):", response.data); // Confirm backend response
      if (response.status === 201) {
        showToastMessage("Task Added Successfully", "add");
        getAllTasks(); // Refresh the tasks after adding
        onClose();
      }
    } catch (error) {
      console.error("Error in addNewNote:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  
// update task api for to update task
  const editNote = async () => {
    if (!noteData || !noteData.id) {
      setError("Task ID is missing. Cannot update the task.");
      return;
    }
    const taskId = noteData.id;
    try {
      const response = await axiosInstance.put(
        `/api/tasks/${taskId}`,
        { title, content, status, dueDate },
        { withCredentials: true }
      );
      if (response.status === 200) {
        showToastMessage("Task Updated Successfully", "edit");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  
// handle error for input box
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-500 outline-none bg-slate-50 p-2 rounded"
          placeholder="content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">STATUS</label>
        <select
          className="text-sm text-slate-500 outline-none bg-slate-50 p-2 rounded"
          value={status}
          onChange={({ target }) => setStatus(target.value)}
        >
          <option value="ToDo">To Do</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">DUE DATE</label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="yyyy-MM-dd"
          className="text-sm text-slate-500 outline-none bg-slate-50 p-2 rounded"
          placeholderText="Select a due date"
        />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;

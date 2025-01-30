import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Taskcard from "../../components/cards/Taskcard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/Toastmessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addtask from "../../assets/addtask.png";
import noDataImg from "../../assets/noDataImg.png";
import io from "socket.io-client";
import debounce from "lodash.debounce";

// Socket URL moved to environment variable
const SOCKET_URL = "http://localhost:5000";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setshowToastmsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [alltasks, setAlltasks] = useState([]);
  const navigate = useNavigate();

  // Show toast message
  const showToastMessage = (message, type) => {
    setshowToastmsg({
      isShown: true,
      message: message,
      type: type || "add",
    });
  };

  // Close toast message
  const handleCloseToast = () => {
    setshowToastmsg({
      isShown: false,
      message: "",
    });
  };

  // Fetch logged-in user's data
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/users/get-user", {
        withCredentials: true,
      });
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Error fetching user info:", error);
      }
    }
  };

  // Fetch all tasks
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/api/tasks", { withCredentials: true });
      setAlltasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showToastMessage("An error occurred while fetching tasks.", "error");
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, { withCredentials: true });
      showToastMessage("Task Deleted Successfully", "delete");
      setAlltasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      showToastMessage("An error occurred while deleting the task.", "error");
    }
  };

  // Search tasks with debouncing
  const onSearchTask = async (query) => {
    try {
      const response = await axiosInstance.get("/api/tasks/search-tasks", {
        params: { query },
        withCredentials: true,
      });
      setIsSearch(true);
      setAlltasks(response.data.tasks);
    } catch (error) {
      console.error("Error searching tasks:", error);
      showToastMessage("An error occurred while searching tasks.", "error");
    }
  };

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.trim() === "") {
      handleClearSearch();
    } else {
      onSearchTask(query);
    }
  }, 300);

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  // Clear search results
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllTasks();
  };

  // Socket connection setup
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Real-time updates for task creation
    socket.on("taskCreated", (data) => {
      showToastMessage(data.message, "add");
      setAlltasks((prevTasks) => [...prevTasks, data.task]);
    });

    // Real-time updates for task updates
    socket.on("taskUpdated", (data) => {
      showToastMessage(data.message, "edit");
      setAlltasks((prevTasks) =>
        prevTasks.map((task) => (task.id === data.task.id ? data.task : task))
      );
    });

    // Real-time updates for task deletion
    socket.on("taskDeleted", (data) => {
      showToastMessage(data.message, "delete");
      setAlltasks((prevTasks) => prevTasks.filter((task) => task.id !== data.taskId));
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.disconnect();
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    console.log("Fetching initial data...");
    getAllTasks();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchTask={handleSearchInputChange}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto p-5 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        </div>
        {alltasks.length === 0 ? (
          <EmptyCard
            imgSrc={isSearch ? noDataImg : addtask}
            message={
              isSearch
                ? "Oops! No tasks found matching your search."
                : "Start creating your first task! Click the 'Add' Button to get started!"
            }
          />
        ) : (
          alltasks.map((task) => (
            <Taskcard
              key={task.id}
              title={task.title}
              content={task.content}
              status={task.status}
              dueDate={task.dueDate}
              date={task.date}
              onEdit={() => setOpenAddEditModal({ isShown: true, type: "edit", data: task })}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 fixed right-4 bottom-10 transition-transform transform hover:scale-110 z-50"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          },
          content: {
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            margin: "auto",
            borderRadius: "10px",
            overflowY: "auto",
          },
        }}
        contentLabel=""
        className="modal-content w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllTasks={getAllTasks}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
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

// Socket URL moved to environment variable
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "https://todoapp-4t5z.onrender.com";

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
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setshowToastmsg({
      isShown: true,
      message: message,
      type: type || "add",
    });
  };

  const handleCloseToast = () => {
    setshowToastmsg({
      isShown: false,
      message: "",
    });
  };

  // api calling for to get loged user data
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

  // api calling for delete task
  const deleteTask = async (taskId) => {
    
    console.log('Deleting task with ID:', taskId); 
    try {
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`, {
        withCredentials: true,
      });
      if (response.data && !response.data.error) {
        showToastMessage("Task Deleted Successfully", "delete");
        getAllTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showToastMessage("An error occurred while deleting the task.", "error");
    }
  };

  // api calling for to get all task
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/api/tasks", { withCredentials: true });
      console.log("Full response from backend (getAllTasks):", response.data); // Log full response
  
      // Adjust based on the actual response structure
      if (response.data && Array.isArray(response.data)) {
        setAlltasks(response.data); // If the tasks are in the response directly as an array
      } else if (response.data.tasks) {
        setAlltasks(response.data.tasks); // If the tasks are in a `tasks` key
      } else {
        setAlltasks([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching tasks (getAllTasks):", error.response || error.message);
      showToastMessage("An error occurred while fetching tasks.", "error");
    }
  };
  
  
// api calling for to search task.
  const onSearchTask = async (query) => {
    try {
      const response = await axiosInstance.get("/api/tasks/search-tasks", 
        { params: { query }},{ withCredentials: true },);
      if (response.data && response.data.tasks) {
        setIsSearch(true);
        setAlltasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
      showToastMessage("An error occurred while searching tasks.", error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllTasks();
  };


  // Socket connection setup with toast notification
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("taskCreated", (data) => {
      showToastMessage(data.message, "add");
      getAllTasks();
    });

    socket.on("taskUpdated", (data) => {
      showToastMessage(data.message, "edit");
      getAllTasks();
    });

    socket.on("taskDeleted", (data) => {
      showToastMessage(data.message, "delete");
      getAllTasks();
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
    getAllTasks();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchTask={onSearchTask}
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
            // passing data
            <Taskcard
              key={task.id}
              title={task.title}        // Pass title directly
              content={task.content}    // Pass content directly
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

import React, { useState, useEffect } from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const Taskcard = ({
  title,
  content,
  status,
  onEdit,
  onDelete,
  dueDate,
  date,
}) => {
  // Debugging: Log the props to see if title and content are passed correctly
  useEffect(() => {
    console.log('Title:', title);
    console.log('Content:', content);
  }, [title, content]);

  // Define status colors based on task status
  const statusColors = {
    ToDo: "bg-yellow-300 text-yellow-800",
    InProgress: "bg-blue-300 text-blue-800",
    Completed: "bg-green-300 text-green-800",
  };

  return (
    <div className="border rounded p-4 mb-2 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="  items-center justify-between">
        <div>
          <h6 className="text-lg font-semibold text-gray-800">
            {/* Show title or fallback to 'Untitled' if empty */}
            {title ? title : 'Untitled'}
          </h6>
          <div className="flex gap-2">
            <span className="text-xs text-gray-500">
              Created On: {moment(date).format("Do MMM YYYY")}
            </span>
            {dueDate && (
              <span className="text-xs text-gray-500">
                Due Date: {moment(dueDate).format("Do MMM YYYY")}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Show content or fallback to 'No content available' if empty */}
      <p className="text-sm text-gray-700 mt-2 leading-tight">
        {content && content.trim() ? content.slice(0, 60) : 'No content available'}
      </p>
      
      <div className="flex mt-2 gap-3 items-center">
        <div>
          <p className="text-sm font-medium" mr-2>
            Status:
          </p>
        </div>
        <div>
          {/* Apply status color based on the task status */}
          <span
            className={`inline-block px-2 py-1 rounded ${statusColors[status]} text-xs font-medium`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {/* Edit button */}
        <MdCreate
          className="icon-btn hover:text-green-600 cursor-pointer text-lg"
          onClick={onEdit}
        />
        
        {/* Delete button */}
        <div>
          <MdDelete
            className="icon-btn hover:text-red-500 cursor-pointer text-lg"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Taskcard;

import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, MenuItem, Menu } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const Notification = ({
  user,
  isOpen,
  closeSidebar,
  setUnreadNotifications,
}) => {
  const socket = io("http://localhost:8000");

  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(() => {
    const storedReadNotifications =
      JSON.parse(localStorage.getItem("readNotifications")) || [];
    return storedReadNotifications;
  });
  const navigate = useNavigate();
  const [deleteMenuAnchorEl, setDeleteMenuAnchorEl] = useState(null);
  const [deleteMenuNotificationId, setDeleteMenuNotificationId] =
    useState(null);

  useEffect(() => {
    const handleNewProtocol = ({ supplierName, protocolTitle }) => {
    

      if (user.role === "admin" || user.role === "employee") {
        setUnreadNotifications((prevCount) => prevCount + 1);
      }
    };

    socket.on("newProtocol", handleNewProtocol);

    return () => {
      socket.off("newProtocol", handleNewProtocol);
    };
  }, [socket, user, setUnreadNotifications]);



  useEffect(() => {
    const handleEvaluationCheck = () => {
      console.log("New evaluation check received");

      if (user.role === "admin" || user.role === "employee") {
        console.log("User role is admin or employee");
        setUnreadNotifications((prevCount) => prevCount + 1);
      } else {
        console.log("User role is not admin or employee");
      }
    };

    socket.on("Evaluation check", handleEvaluationCheck);

    return () => {
      socket.off("Evaluation check", handleEvaluationCheck);
    };
  }, [socket, user, setUnreadNotifications]);



  useEffect(() => {
    const handleNewProtocolStatus = (notificationMessage) => {
      

      if (user.role === "supplier") {
        setUnreadNotifications((prevCount) => prevCount + 1);
      }
    };

    socket.on("newProtocolStatus", handleNewProtocolStatus);

    return () => {
      socket.off("newProtocolStatus", handleNewProtocolStatus);
    };
  }, [socket, user, setUnreadNotifications]);

  useEffect(() => {
    const handleNewEvaluation = () => {
      //console.log("New evaluation received ");

      if (user.role === "supplier") {
        setUnreadNotifications((prevCount) => prevCount + 1);
      }
    };

    socket.on("newEvaluation", handleNewEvaluation);

    return () => {
      socket.off("newEvaluation", handleNewEvaluation);
    };
  }, [socket, user, setUnreadNotifications]);

  useEffect(() => {
    const handleNewCertificate = (notificationData) => {
      //console.log("New certificate received");
      const userRole = notificationData.userRole;
      const supplierId = notificationData.supplierId;
    

      if (userRole === "admin" || userRole === "employee") {
        if (supplierId === user.id) {

          setUnreadNotifications((prevCount) => prevCount + 1);
        }
      } else if (userRole === "supplier" && userRole !== user.role) {
        setUnreadNotifications((prevCount) => prevCount + 1);
      }
    };

    socket.on("newCertificate", handleNewCertificate);

    return () => {
      socket.off("newCertificate", handleNewCertificate);
    };
  }, [socket, user, setUnreadNotifications]);

  useEffect(() => {

  }, [notifications]);

  useEffect(() => {
    if (user && user.id && isOpen) {
      fetchNotifications(user.id);
    }
  }, [user, isOpen]);

  useEffect(() => {
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(readNotifications)
    );
  }, [readNotifications]);

  const fetchNotifications = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data && response.data.notifications) {
        const fetchedNotifications = response.data.notifications.reverse();
        const initializedReadNotifications = fetchedNotifications.map(notification => notification.read);
        setReadNotifications(initializedReadNotifications);
        setNotifications(fetchedNotifications);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  

  const handleNotificationClick = async (notificationId, notificationType, index) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/notifications/${notificationId}`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
     
      const updatedReadNotifications = [...readNotifications];
      updatedReadNotifications[index] = true;
      setReadNotifications(updatedReadNotifications);
  
      switch (notificationType) {
        case "evaluation":
          navigate("/admin/evaluations");
          break;
        case "certificate":
          navigate("/admin/certificates");
          break;
        case "protocol":
          navigate("/Protocol");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };
  
  
  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
    
      await axios.delete(
        `http://localhost:8000/api/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
    setDeleteMenuAnchorEl(null);
    setDeleteMenuNotificationId(null);
  };


  



  return (
    <>
      {isOpen && (
        <div
          className="notification-overlay"
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
        />
      )}
      <div
        className={`notification-sidebar ${isOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          top: "60px",
          right: "80px",
          zIndex: 999,
          backgroundColor: "white",
          color: "black",
          borderRadius: "10px",
          display: isOpen ? "block" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4
          style={{
            color: "black",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          Notifications
        </h4>
        <div
          className="notification-list"
          style={{
            maxHeight: "600px",
            width: "490px",
            overflowY: "auto",
            borderRadius: "10px",
          }}
        >
          <ListGroup>
            {notifications.map((notification, index) => (
             <ListGroupItem
             key={notification._id}
             onClick={() =>
               handleNotificationClick(
                 notification._id,
                 notification.type,
                 index
               )
             }
             style={{
               backgroundColor: readNotifications[index] ? "white" : "#808080",
               cursor: "pointer",
               borderRadius: "30px",
               marginBottom: "10px",
               color: "black",
               transition: "background-color 0.3s",
               fontWeight: readNotifications[index] ? "normal" : "bold",
             }}
             className="notification-item"
             onMouseEnter={(e) => {
               e.target.style.backgroundColor = "#D3D3D3";
             }}
             onMouseLeave={(e) => {
               e.target.style.backgroundColor = readNotifications[index] ? "white" : "#808080";
             }}
           >
             {notification.message}
             <br />
             <span style={{ fontSize: "0.8em", color: "#555" }}>
               {formatDistanceToNow(new Date(notification.timestamp), {
                 addSuffix: true,
               }).replace("about ", "")}
             </span>
             <IconButton
               onClick={(event) => {
                 event.stopPropagation();
                 setDeleteMenuAnchorEl(event.currentTarget);
                 setDeleteMenuNotificationId(notification._id); 
               }}
               sx={{ position: "absolute", right: 0, top: 0 }} 
             >
               <MoreVertIcon />
             </IconButton>
             <Menu
               anchorEl={deleteMenuAnchorEl}
               open={Boolean(
                 deleteMenuAnchorEl &&
                   deleteMenuNotificationId === notification._id
               )}
               onClose={() => {
                 setDeleteMenuAnchorEl(null);
                 setDeleteMenuNotificationId(null);
               }}
             >
               <MenuItem
                 onClick={() => handleDeleteNotification(notification._id)}
               >
                 <DeleteIcon sx={{ mr: 0.5 }} fontSize="small" /> Delete Notification
               </MenuItem>
             </Menu>
           </ListGroupItem>
           
            ))}
          </ListGroup>
        </div>
      </div>
    </>
  );
};
export default Notification;

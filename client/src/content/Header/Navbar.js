import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Collapse,
  Navbar,
  Nav,
  NavItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  Badge,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import Notification from "../../components/Notifications/Notification";
import LogoutIcon from "@mui/icons-material/Logout";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userData, setUserData] = useState({ userName: "", image: "" });
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user || !user.id) {
          console.error("User ID is missing or undefined");
          return;
        }

        if (!token) {
          console.error("Token is missing");
          return;
        }

        console.log("Fetching user data...");
        const response = await axios.get(
          `http://localhost:8000/profile/fetchUserName/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data. Please try again later.");
      }
    };

    if (user && user.id && token) {
      fetchUserData();
    }
  }, [user, token]);

  const toggle = () => setIsOpen(!isOpen);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBellClick = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="header bg-gradient-white py-1">
      <Notification
        user={user}
        isOpen={showSidebar}
        closeSidebar={() => setShowSidebar(false)}
      />
<Navbar
  className="navbar-top navbar-dark"
  expand="md"
  id="navbar-main"
  style={{
    backgroundColor: "white",
    justifyContent: "space-between", // Adjust alignment
    paddingLeft: 290, // Add padding to the right
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    height: 62, // Adjust the height of the Navbar
  }}
>

        <Container>
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Form className="mt-0 p-0 bg-light rounded shadow-sm">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText
                        style={{ color: "grey", fontSize: "0.8rem" }}
                      >
                        <i className="fas fa-search" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Search"
                      type="text"
                      style={{ color: "grey", fontSize: "0.8rem" }}
                    />
                  </InputGroup>
                </Form>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>
                  <i
                    className="fas fa-bell fa-lg bell-icon"
                    style={{
                      marginTop: "16px",
                      cursor: "pointer",
                      color: "grey",
                    }}
                    onClick={handleBellClick}
                  />
                </DropdownToggle>
              </UncontrolledDropdown>

              <NavItem className="d-none d-md-block">
                <UncontrolledDropdown nav inNavbar>
                  <div>
                    <IconButton
                      onClick={handleClick}
                      aria-controls="user-menu"
                      aria-haspopup="true"
                      aria-expanded={anchorEl ? "true" : undefined}
                      style={{ backgroundColor: "white" }}
                    >
                      <Avatar
                        src={`http://localhost:8000/${userData.image}`}
                        alt={user.name}
                        sx={{ width: 29, height: 29, marginRight: 1 }} // Add margin to the Avatar
                      />
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        {userData.userName || "Loading..."}
                      </Typography>
                    </IconButton>

                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={handleProfileClick}>
                        <Avatar /> Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon /> Logout
                      </MenuItem>
                      <Divider />
                    </Menu>
                  </div>

                  <DropdownMenu right>
                    <DropdownItem onClick={handleProfileClick}>
                      Profile
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;

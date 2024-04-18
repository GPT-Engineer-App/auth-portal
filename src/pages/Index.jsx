import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, Text, IconButton } from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check local storage for token on initial load
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:1337/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem("authToken", data.jwt);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          description: "You've been logged in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.message[0].messages[0].message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  if (isLoggedIn) {
    return (
      <Box p={4}>
        <Text mb={4}>You are logged in!</Text>
        <IconButton aria-label="Logout" icon={<FaSignOutAlt />} onClick={handleLogout} />
      </Box>
    );
  }

  return (
    <VStack spacing={4} p={4}>
      <FormControl id="email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        Login
      </Button>
    </VStack>
  );
};

export default Index;

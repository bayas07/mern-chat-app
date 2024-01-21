import {
  Box,
  FormControl,
  FormLabel,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    setEmail("bay@yopmail.com");
    setPassword("bay@yopmail.com");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill the mandatory fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsloading(true);
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });
      setIsloading(false);
      localStorage.setItem("userInfo", JSON.stringify(response?.data));
      navigate("/chats");
    } catch (err) {
      setIsloading(false);
      toast({
        title: "Error",
        description: err.response.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      as="form"
      display="flex"
      flexDirection="column"
      rowGap={3}
      onSubmit={handleSubmit}
    >
      <FormControl id="name" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          size="sm"
          type="text"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            size="sm"
            paddingRight="4.5rem"
            type={showPassword ? "text" : "password"}
            isRequired
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement width="4.5rem" height="2rem">
            <Button
              height="1.5rem"
              size="xs"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        type="submit"
        colorScheme="blue"
        variant="solid"
        isLoading={isLoading}
      >
        Login
      </Button>
      <Button colorScheme="orange" variant="solid" onClick={handleGuestLogin}>
        Try guest credential
      </Button>
    </Box>
  );
};

export default Login;

import {
  Box,
  FormControl,
  FormLabel,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../customHooks/useAxios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    data: loginData,
    fetchData: login,
    loading,
    error: loginError,
  } = useAxios({
    url: "/api/user/login",
    method: "post",
    payload: { email, password },
    sendToken: false,
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleGuestLogin1 = () => {
    setEmail("bay123@yopmail.com");
    setPassword("bay123@yopmail.com");
  };

  const handleGuestLogin2 = () => {
    setEmail("suriya123@yopmail.com");
    setPassword("suriya123@yopmail.com");
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
      login();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (loginData) {
      localStorage.setItem("userInfo", JSON.stringify(loginData));
      navigate("/chat");
    }
    if (loginError) {
      toast({
        title: "Error",
        description: loginError.response.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, loginError]);

  return (
    <Box
      as="form"
      display="flex"
      flexDirection="column"
      rowGap={3}
      onSubmit={handleSubmit}
    >
      <FormControl id="login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          size="sm"
          type="text"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="login-password" isRequired>
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
        isLoading={loading}
      >
        Login
      </Button>
      <Button colorScheme="orange" variant="solid" onClick={handleGuestLogin1}>
        Try guest credential 1
      </Button>
      <Button colorScheme="green" variant="solid" onClick={handleGuestLogin2}>
        Try guest credential 2
      </Button>
    </Box>
  );
};

export default Login;

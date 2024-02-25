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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const picUrl = `https://api.multiavatar.com/${
    name.split(" ")[0]
  }_${Math.round(Math.random() * 999)}.svg`;
  const {
    data: signupData,
    fetchData: signup,
    error: signupError,
    loading,
  } = useAxios({
    url: "/api/user/signup",
    method: "post",
    payload: {
      name,
      email,
      password,
      picture: picUrl,
    },
    sendToken: false,
  });

  const toast = useToast();
  const navigate = useNavigate();

  // const uploadPicHandler = async (event) => {
  //   const pic = event.target.files[0];
  //   const cloudName = process.env.CLOUD_NAME;
  //   if (pic.type === "image/png" || pic.type === "image/jpeg") {
  //     setIsloading(true);
  //     const data = new FormData();
  //     data.append("file", pic);
  //     data.append("upload_preset", "chatApp");
  //     data.append("cloud_name", cloudName);
  //     try {
  //       const response = await axios.post(
  //         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  //         data
  //       );
  //       setPicture(response.data?.url);
  //       setIsloading(false);
  //     } catch (err) {
  //       setIsloading(false);
  //       toast({
  //         title: "Error uploading image",
  //         description: err.message,
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //     }
  //   } else {
  //     setIsloading(false);
  //     toast({
  //       title: "Error",
  //       description: "Unable to upload your image",
  //       status: "error",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill the mandatory fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    signup();
  };

  useEffect(() => {
    if (signupData) {
      localStorage.setItem("userInfo", JSON.stringify(signupData));
      navigate("/chat");
    }
    if (signupError) {
      toast({
        title: "Error",
        description: signupError.response.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupData, signupError]);

  return (
    <Box
      as="form"
      display="flex"
      flexDirection="column"
      rowGap={3}
      onSubmit={handleSubmit}
    >
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          size="sm"
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          size="sm"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
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
            min={5}
            onChange={(e) => setPassword(e.target.value)}
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
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            size="sm"
            paddingRight="4.5rem"
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isRequired
          />
          <InputRightElement width="4.5rem" height="2rem">
            <Button
              height="1.5rem"
              size="xs"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* <FormControl>
        <FormLabel>Upload your image</FormLabel>
        <Input
          size="md"
          type="file"
          accept="image/*"
          paddingTop={1}
          onChange={uploadPicHandler}
        />
      </FormControl> */}
      <Button
        type="submit"
        colorScheme="blue"
        variant="solid"
        isLoading={loading}
      >
        SignUp
      </Button>
    </Box>
  );
};

export default SignUp;

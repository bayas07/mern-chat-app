import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import React, { useState } from "react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatches, setPasswordMatches] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password, confirmPassword, "**");
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    if (password !== value) {
      setPasswordMatches(false);
    } else {
      setPasswordMatches(true);
      setConfirmPassword(value);
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
      <FormControl
        id="confirm-password"
        isRequired
        isInvalid={!passwordMatches}
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            size="sm"
            paddingRight="4.5rem"
            type={showConfirmPassword ? "text" : "password"}
            isRequired
            onChange={handleConfirmPasswordChange}
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
        <FormErrorMessage>Passwords don't match</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your image</FormLabel>
        <Input size="md" type="file" accept="image/*" paddingTop={1} />
      </FormControl>
      <Button type="submit" colorScheme="blue" variant="solid">
        Login
      </Button>
    </Box>
  );
};

export default SignUp;

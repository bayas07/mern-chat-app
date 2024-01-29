import React from "react";
import { ChatIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Box,
  Text,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {<Box onClick={onOpen}>{children}</Box>}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                rowGap: "20px",
              }}
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.picture}
                alt={user.name}
              />
              <Box>
                <Text fontSize="lg">
                  <ChatIcon boxSize={4} marginRight={2} />
                  <span>{user.name}</span>
                </Text>
                <Text fontSize="lg">
                  <EmailIcon boxSize={4} marginRight={2} />
                  <span>{user.email}</span>
                </Text>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

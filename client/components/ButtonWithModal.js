import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  useDisclosure,
} from "@chakra-ui/react";

const ButtonWithModal = ({
  handleSubmit,
  isLoading = false,
  loadingText = "Submitting...",
  buttonText = "Submit Entry",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
        color="#030512"
        _hover={{
          bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
          boxShadow: "0 0 25px rgba(56, 217, 169, 0.5)",
          transform: "translateY(-1px)",
        }}
        _active={{
          transform: "scale(0.98)",
        }}
        w={{ base: "full", sm: "160px" }}
        h="44px"
        type="button"
        onClick={onOpen}
        isLoading={isLoading}
        loadingText={loadingText}
        fontFamily="'Inter', sans-serif"
        fontWeight="extrabold"
        letterSpacing="0.12em"
        fontSize="sm"
        textTransform="uppercase"
        rounded="md"
        boxShadow="0 0 15px rgba(56, 217, 169, 0.3)"
      >
        {buttonText}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(3, 5, 18, 0.8)" backdropFilter="blur(8px)" />
        <ModalContent
          position="relative"
          bg="linear-gradient(180deg, rgba(11, 21, 46, 0.98) 0%, rgba(7, 16, 36, 0.98) 100%)"
          border="1px solid rgba(56, 217, 169, 0.45)"
          boxShadow="0 0 35px rgba(56, 217, 169, 0.25), 0 12px 32px rgba(0, 0, 0, 0.9)"
          borderRadius="md"
          maxW={{ base: "calc(100vw - 32px)", sm: "md" }}
          mx="auto"
          p={{ base: 2, sm: 3 }}
          overflow="hidden"
        >
          {/* 4 Corner HUD Brackets */}
          <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          <ModalHeader
            fontFamily="'Orbitron', sans-serif !important"
            color="#FFFFFF"
            fontSize={{ base: "lg", sm: "xl" }}
            letterSpacing="0.08em"
            textTransform="uppercase"
            pt={3}
          >
            CONFIRM SUBMISSION
          </ModalHeader>
          <ModalCloseButton color="#38D9A9" _hover={{ color: "#22D3EE" }} />
          <ModalBody
            fontFamily="'Inter', sans-serif"
            color="#CBD5E1"
            fontSize="sm"
            lineHeight="tall"
          >
            Are you sure you want to proceed? Entry once submitted cannot be edited or replaced.
          </ModalBody>

          <ModalFooter
            gap={3}
            pt={4}
            flexDirection={{ base: "column-reverse", sm: "row" }}
            alignItems={{ base: "stretch", sm: "center" }}
          >
            <Button
              w={{ base: "full", sm: "auto" }}
              minH="42px"
              variant="outline"
              borderColor="rgba(255, 255, 255, 0.2)"
              color="#94A3B8"
              fontFamily="'Inter', sans-serif"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="0.1em"
              textTransform="uppercase"
              _hover={{
                bg: "whiteAlpha.100",
                color: "#FFFFFF",
              }}
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              w={{ base: "full", sm: "auto" }}
              minH="42px"
              bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
              color="#030512"
              fontFamily="'Inter', sans-serif"
              fontSize="xs"
              fontWeight="extrabold"
              letterSpacing="0.12em"
              textTransform="uppercase"
              boxShadow="0 0 15px rgba(56, 217, 169, 0.3)"
              _hover={{
                bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
                boxShadow: "0 0 25px rgba(56, 217, 169, 0.5)",
              }}
              isLoading={isLoading}
              loadingText={loadingText}
              onClick={() => {
                onClose();
                handleSubmit();
              }}
            >
              Yes, Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonWithModal;
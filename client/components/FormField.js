import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";

const FormField = ({ label, name, placeholder, ...otherProps }) => {
  const { errors, touched } = useFormikContext();
  return (
    <FormControl id={name}>
      <FormLabel
        fontFamily="'Inter', sans-serif"
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="0.1em"
        textTransform="uppercase"
        color="#38D9A9"
        mb={1.5}
      >
        {label}
      </FormLabel>
      <Input
        name={name}
        placeholder={placeholder}
        w="100%"
        maxW="100%"
        boxSizing="border-box"
        h={{ base: "42px", sm: "44px" }}
        fontFamily="'Inter', sans-serif"
        fontSize={{ base: "xs", sm: "sm" }}
        px={{ base: 3, sm: 4 }}
        color="#FFFFFF"
        bg="rgba(7, 16, 36, 0.85)"
        border="1px solid rgba(56, 217, 169, 0.35)"
        borderRadius="md"
        _hover={{
          borderColor: "rgba(56, 217, 169, 0.6)",
        }}
        _focus={{
          borderColor: "#38D9A9",
          boxShadow: "0 0 12px rgba(56, 217, 169, 0.35)",
        }}
        _placeholder={{
          color: "rgba(203, 213, 225, 0.45)",
          fontSize: "xs",
        }}
        {...otherProps}
      />
      {errors[name] && touched[name] && (
        <Text color="#F87171" fontSize="xs" fontFamily="'Inter', sans-serif" mt={1}>
          {errors[name]}
        </Text>
      )}
    </FormControl>
  );
};

export default FormField;
import { FormControl, FormLabel, Select, Text } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";

const SelectField = ({ name, placeholder, label, options, ...otherProps }) => {
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
      <Select
        placeholder={placeholder}
        name={name}
        w="100%"
        h="44px"
        fontFamily="'Inter', sans-serif"
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
        {...otherProps}
      >
        {options.map((item) => (
          <option
            value={item.value}
            key={item.value}
            style={{ backgroundColor: "#071024", color: "#FFFFFF" }}
          >
            {item.label}
          </option>
        ))}
      </Select>
      {errors[name] && touched[name] && (
        <Text color="#F87171" fontSize="xs" fontFamily="'Inter', sans-serif" mt={1}>
          {errors[name]}
        </Text>
      )}
    </FormControl>
  );
};

export default SelectField;
import { Box, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React from "react";

const FileInput = ({ label, name, accept, ...otherProps }) => {
  const { errors, touched, values, setValues } = useFormikContext();

  const changeHandler = (event) => {
    setValues({
      ...values,
      [name]: event.target.files[0],
    });
  };

  return (
    <Box>
      <FormControl id={name}>
        <FormLabel
          fontFamily="'Oxanium', sans-serif"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="0.1em"
          textTransform="uppercase"
          color="#38D9A9"
          mb={2}
        >
          {label}
        </FormLabel>
        <Input
          type="file"
          name={name}
          h="52px"
          py="12px"
          px={3}
          color="#FFFFFF"
          fontFamily="'Oxanium', sans-serif"
          fontSize="sm"
          bg="rgba(7, 16, 36, 0.85)"
          border="1px dashed rgba(56, 217, 169, 0.5)"
          borderRadius="md"
          cursor="pointer"
          _hover={{
            borderColor: "#38D9A9",
            boxShadow: "0 0 15px rgba(56, 217, 169, 0.2)",
          }}
          onChange={changeHandler}
          accept={accept}
          {...otherProps}
        />
        {errors[name] && touched[name] && (
          <Text color="#F87171" fontSize="xs" fontFamily="'Oxanium', sans-serif" mt={1}>
            {errors[name]}
          </Text>
        )}
      </FormControl>
    </Box>
  );
};

export default FileInput;
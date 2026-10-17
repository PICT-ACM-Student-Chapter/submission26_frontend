import { Box, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => (
    <Box p={4} color="#38D9A9" fontFamily="'Oxanium', sans-serif">
      Loading Editor...
    </Box>
  ),
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

export default function TextEditor({ label, name, placeholder, ...otherProps }) {
  const { errors, touched, values, setValues } = useFormikContext();
  const handleChange = (value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
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
      <Box
        border="1px solid rgba(56, 217, 169, 0.35)"
        borderRadius="md"
        overflow="hidden"
        bg="rgba(7, 16, 36, 0.85)"
        sx={{
          ".ql-toolbar": {
            bg: "rgba(5, 11, 29, 0.9)",
            borderColor: "rgba(56, 217, 169, 0.25) !important",
            fontFamily: "'Oxanium', sans-serif",
            ".ql-stroke": { stroke: "#CBD5E1 !important" },
            ".ql-fill": { fill: "#CBD5E1 !important" },
            ".ql-picker": { color: "#CBD5E1 !important" },
          },
          ".ql-container": {
            borderColor: "transparent !important",
            fontFamily: "'Oxanium', sans-serif",
            minHeight: "160px",
            color: "#FFFFFF",
          },
        }}
      >
        <QuillNoSSRWrapper
          modules={modules}
          formats={formats}
          name={name}
          placeholder={placeholder}
          theme="snow"
          onChange={handleChange}
          {...otherProps}
        />
      </Box>
      {errors[name] && touched[name] && (
        <Text color="#F87171" fontSize="xs" fontFamily="'Oxanium', sans-serif" mt={1}>
          {errors[name]}
        </Text>
      )}
    </FormControl>
  );
}
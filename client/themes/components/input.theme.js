export const Input = {
  baseStyle: {
    field: {
      fontFamily: "'Inter', sans-serif",
      color: "#FFFFFF",
      borderRadius: "md",
      bg: "rgba(7, 16, 36, 0.85)",
      border: "1px solid",
      borderColor: "rgba(56, 217, 169, 0.35)",
      _placeholder: {
        color: "rgba(203, 213, 225, 0.5)",
      },
      _hover: {
        borderColor: "rgba(56, 217, 169, 0.6)",
      },
      _focus: {
        borderColor: "#38D9A9",
        boxShadow: "0 0 12px rgba(56, 217, 169, 0.35)",
      },
    },
  },
  defaultProps: {
    focusBorderColor: "#38D9A9",
  },
};
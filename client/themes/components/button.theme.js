export const Button = {
  baseStyle: {
    fontFamily: "'Oxanium', sans-serif",
    fontWeight: "bold",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    borderRadius: "md",
    transition: "all 0.3s ease",
    _focus: {
      boxShadow: "0 0 0 2px #38D9A9",
    },
  },
  variants: {
    solid: {
      bg: "linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)",
      color: "#030512",
      boxShadow: "0 0 15px rgba(56, 217, 169, 0.3)",
      _hover: {
        bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)",
        boxShadow: "0 0 25px rgba(56, 217, 169, 0.5)",
        transform: "translateY(-1px)",
        _disabled: {
          bg: "linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)",
        },
      },
      _active: {
        transform: "scale(0.98)",
      },
    },
    outline: {
      border: "1px solid",
      borderColor: "#38D9A9",
      color: "#38D9A9",
      bg: "rgba(5, 11, 29, 0.7)",
      _hover: {
        bg: "rgba(56, 217, 169, 0.15)",
        borderColor: "#22D3EE",
        color: "#FFFFFF",
        boxShadow: "0 0 20px rgba(56, 217, 169, 0.35)",
      },
    },
    ghost: {
      color: "#38D9A9",
      _hover: {
        bg: "rgba(56, 217, 169, 0.1)",
        color: "#22D3EE",
      },
    },
  },
};
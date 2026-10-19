import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
} from "@chakra-ui/react";

const Leaderboard = ({ submissions, senior }) => {
  return (
    <TableContainer
      w="100%"
      border="1px solid rgba(56, 217, 169, 0.3)"
      bg="rgba(7, 16, 36, 0.85)"
      backdropFilter="blur(16px)"
      borderRadius="md"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.7)"
      overflow="hidden"
    >
      <Table variant="simple">
        <Thead bg="rgba(56, 217, 169, 0.12)">
          <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
            <Th
              textAlign="center"
              fontFamily="'Orbitron', sans-serif !important"
              color="#38D9A9"
              fontSize="sm"
              letterSpacing="0.1em"
              textTransform="uppercase"
              py={4}
            >
              Rank
            </Th>
            <Th
              textAlign="center"
              fontFamily="'Orbitron', sans-serif !important"
              color="#38D9A9"
              fontSize="sm"
              letterSpacing="0.1em"
              textTransform="uppercase"
              py={4}
            >
              Email
            </Th>
            <Th
              textAlign="center"
              fontFamily="'Orbitron', sans-serif !important"
              color="#38D9A9"
              fontSize="sm"
              letterSpacing="0.1em"
              textTransform="uppercase"
              py={4}
            >
              First Name
            </Th>
            <Th
              textAlign="center"
              fontFamily="'Orbitron', sans-serif !important"
              color="#38D9A9"
              fontSize="sm"
              letterSpacing="0.1em"
              textTransform="uppercase"
              py={4}
            >
              Last Name
            </Th>
            <Th
              textAlign="center"
              fontFamily="'Orbitron', sans-serif !important"
              color="#38D9A9"
              fontSize="sm"
              letterSpacing="0.1em"
              textTransform="uppercase"
              py={4}
            >
              F1 Score
            </Th>
          </Tr>
        </Thead>
        <Tbody fontFamily="'Inter', sans-serif">
          {submissions?.map((submission, index) => {
            const isTop3 = index < 3;
            const rankColor =
              index === 0 ? "#F8D092" : index === 1 ? "#E2E8F0" : index === 2 ? "#F59E0B" : "#38D9A9";

            return (
              <Tr
                key={index}
                borderBottom="1px solid rgba(255, 255, 255, 0.08)"
                transition="background-color 0.2s"
                _hover={{ bg: "rgba(56, 217, 169, 0.08)" }}
              >
                <Td textAlign="center">
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    w="28px"
                    h="28px"
                    rounded="full"
                    bg={isTop3 ? `${rankColor}20` : "transparent"}
                    border={isTop3 ? `1px solid ${rankColor}` : "none"}
                    color={rankColor}
                    fontWeight="bold"
                    fontSize="sm"
                  >
                    {index + 1}
                  </Box>
                </Td>
                <Td textAlign="center" color="#CBD5E1" fontSize="sm">
                  {submission.email}
                </Td>
                <Td textAlign="center" color="#FFFFFF" fontWeight="medium" fontSize="sm">
                  {submission.first_name}
                </Td>
                <Td textAlign="center" color="#FFFFFF" fontWeight="medium" fontSize="sm">
                  {submission.last_name}
                </Td>
                <Td textAlign="center" color="#22D3EE" fontWeight="bold" fontSize="sm">
                  {submission.best_score !== undefined
                    ? submission.best_score.toPrecision(5)
                    : "N/A"}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Leaderboard;
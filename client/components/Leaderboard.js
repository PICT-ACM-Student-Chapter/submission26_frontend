import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    useColorModeValue,
} from '@chakra-ui/react';

const Leaderboard = ({ submissions, senior }) => {
    const textColor = useColorModeValue("gray.700", "gray.50");

    return (
        <TableContainer
            w={'100%'}>

            <Table variant='simple' color="hsl(188, 100%, 60%)">
                {/* <TableCaption>Admin Leaderboard</TableCaption> */}
                <Thead >
                    <Tr>
                        <Th textAlign={'center'}>Rank</Th>
                        <Th textAlign={'center'}>Email</Th>
                        <Th textAlign={'center'}>First Name</Th>
                        <Th textAlign={'center'}>Last Name</Th>
                        {/* <Th textAlign={'center'}>{senior ? "Error" :  "Accuracy"}</Th> */}
                        <Th textAlign={'center'}>F1 score</Th>

                    </Tr>
                </Thead>
                <Tbody>
                {submissions?.map((submission, index) => {
                    // Use 'min' for accuracy (FE/SE) and 'max' for error (TE/BE)
                    // const value = senior ? submission.max : submission.min;
                    const value = submission.best_score;

                    return (
                    <Tr key={index} color="hsl(188, 100%, 60%)">  
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{submission.email}</Td>
                        <Td textAlign="center">{submission.first_name}</Td>
                        <Td textAlign="center">{submission.last_name}</Td>
                        <Td textAlign="center">
                        {submission.best_score !== undefined ? submission.best_score.toPrecision(5) : "N/A"}
                        </Td>
                    </Tr>
                    );
                })}
                </Tbody>


                {/* <Tfoot>
                    <Tr>
                        <Th textAlign={'center'} >Rank</Th>
                        <Th textAlign={'center'}>Email</Th>
                        <Th textAlign={'center'}>First Name</Th>
                        <Th textAlign={'center'}>Last Name</Th>
                        <Th textAlign={'center'}>F1 score</Th>
                        <Th textAlign={'center'}>{senior ? "F1 Score" :  "Mean Square Error"}</Th>
                    </Tr>
                </Tfoot> */}
            </Table>
        </TableContainer>
    );
}

export default Leaderboard;
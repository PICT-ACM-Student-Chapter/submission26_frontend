import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import Leaderboard from '../../components/Leaderboard';
import { Box, chakra, Flex, useColorModeValue } from '@chakra-ui/react'
import { getLeaderboard } from '../../action/entries';
import ContentLoader from '../../components/ContentLoader';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import AppContext from '../../context/AppContext';
import privateUserRoute from '../../routers/privateUserRoute';

const Leader = () => {
    const textColor = useColorModeValue("gray.700", "gray.50");
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const cardBg = useColorModeValue("white.100", "secondaries.800");
    const { user } = useContext(AppContext);
    const senior = user.year === 'TE' || user.year === 'BE';
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const data = await getLeaderboard('dataquest2')
                if (data?.error) {
                    console.log(data.error);
                }
                setSubmissions(data?.submissions);
            } catch (e) {
                console.log(e)
            }
            setLoading(false);
        }
        fetchSubmissions()
    }, [setSubmissions])
    return !loading ? (
        <Layout>
            <Box
                w='100%'
                px={{
                    base: '16px',
                    md: '48px',
                    lg: '64px'
                }}
                pt="2px"
            >
                <Flex
                    justifyContent={'center'}
                    w='100%'
                    p={{ base: 5, md: 8 }}
                    flexDirection={'column'}
                    position="relative"
                    rounded="none"
                    border="1px solid rgba(56, 217, 169, 0.4)"
                    boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
                    bg="linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)"
                    backdropFilter="blur(16px)"
                    overflow="hidden"
                >
                    {/* 4 Corner HUD Brackets */}
                    <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                    <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
                    <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
                    <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

                    <NextLink href='/dataquest2'>
                        <chakra.h3
                            fontFamily="'Oxanium', sans-serif"
                            fontWeight={"bold"}
                            fontSize={{ base: "sm", sm: "md" }}
                            textTransform={"uppercase"}
                            letterSpacing="0.1em"
                            color={"#38D9A9"}
                            cursor="pointer"
                            display={'inline-flex'}
                            alignItems={'center'}
                            gap={1}
                            mb={4}
                            _hover={{ color: "#22D3EE", transform: "translateX(-3px)" }}
                            transition="all 0.2s"
                        >
                            <ChevronLeftIcon w={5} h={5} /> <span>Back to Entry Submission</span>
                        </chakra.h3>
                    </NextLink>

                    <chakra.h1
                        fontFamily="'United Colony', sans-serif !important"
                        fontSize={{
                            base: "2xl",
                            sm: "3xl",
                            md: "4xl"
                        }}
                        fontWeight={"bold"}
                        color="#FFFFFF"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        pb={'30px'}>
                        DATAQUEST 2 <chakra.span color="#38D9A9" textShadow="0 0 15px rgba(56, 217, 169, 0.5)">LEADERBOARD</chakra.span> {senior ? "( TE-BE )" : "( FE-SE )"}
                    </chakra.h1>

                    {
                        submissions?.length > 0 ? (
                            <Leaderboard submissions={submissions} senior={senior} />
                        ) : (
                            <chakra.h3
                                fontFamily="'Oxanium', sans-serif"
                                fontWeight={"bold"}
                                fontSize="lg"
                                color="#94A3B8"
                                w={'100%'}
                                textAlign={'center'}
                                letterSpacing="0.1em"
                                py={8}
                            >
                                Leaderboard will be live soon...
                            </chakra.h3>
                        )
                    }
                </Flex>
            </Box>
        </Layout>
    ) : (
        <ContentLoader />
    )
}

export default privateUserRoute(Leader);
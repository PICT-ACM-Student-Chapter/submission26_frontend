// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Switch,
//   Input,
//   Button,
//   Flex,
//   Spinner,
//   Text,
//   VStack,
//   Divider,
//   useToast,
//   Table,
//   Thead,
//   Tr,
//   Th,
//   Tbody,
//   Td,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuItemOption,
//   MenuGroup,
//   MenuOptionGroup,
//   MenuDivider,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import apiConfig from '../configs/api';
// import { useRouter } from "next/router";
// import { ChevronDownIcon} from "@chakra-ui/icons";


// const INITIAL_GET_API = `${apiConfig.url}/allevents/events`;
// const SAVED_GET_API = `${apiConfig.url}/submission/get`;
// const SAVE_POST_API = `${apiConfig.url}/submission/post`;
// const UPDATE_PATCH_API = `${apiConfig.url}/submission/update`; // Fixed typo

// const AdminPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState({});
//   const [submissionevents, setSubmissionevents] = useState([]);
//    const route=useRouter();
//   const toast = useToast();
//   const admin=JSON.parse(localStorage.getItem("admin"));
//   const fetchInitialEvents = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(INITIAL_GET_API);
//       const fetchedEvents = response.data;

//       const initializedEvents = fetchedEvents.map(event => ({
//         id: event.id,
//         name: event.name,
//         status: false,
//         route: '',  
//       }));

//       setEvents(initializedEvents);
//     } catch (error) {
//       console.error('Failed to fetch initial events:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch events. Please try again later.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSavedEvents = async () => {
    
//     if(admin){
//     try {
//       setLoading(true);
//       const response = await axios.get(SAVED_GET_API, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${admin.token}`, // Add the token in the Authorization header
//         },
//       });
//       const savedEvents = response.data;
//       const initializedEvents = savedEvents.map(event => ({
//         id: event.event_id,
//         name: event.event_name,
//         status: event.event_status,
//         route: event.event_route,  
//       }));
      
//       setSubmissionevents(initializedEvents);
//     } catch (error) {
//       console.error('Failed to fetch saved events:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch saved events. Please try again later.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };}

//   useEffect(() => {
//     const initialize = async () => {
//       await fetchInitialEvents();
//       await fetchSavedEvents();
//     };
//     initialize();
//   }, []);

//   // Handle toggling for events array
//   const handleToggleEvent = (eventId) => {
//     setEvents(prevEvents =>
//       prevEvents.map(event =>
//         event.id === eventId ? { ...event, status: !event.status } : event
//       )
//     );
//   };

//   // Handle toggling for submissionevents array
//   const handleToggleSubmissionEvent = (eventId) => {
//     setSubmissionevents(prevEvents =>
//       prevEvents.map(event =>
//         event.id === eventId ? { ...event, status: !event.status } : event
//       )
//     );
//   };

//   // Handle route change for events array
//   const handleRouteChange = (eventId, newRoute) => {
//     setEvents(prevEvents =>
//       prevEvents.map(event =>
//         event.id === eventId ? { ...event, route: newRoute } : event
//       )
//     );
//   };

//   // Handle route change for submissionevents array
//   const handleSubmissionRouteChange = (eventId, newRoute) => {
//     setSubmissionevents(prevEvents =>
//       prevEvents.map(event =>
//         event.id === eventId ? { ...event, route: newRoute } : event
//       )
//     );
//   };

//   // Add new event (using POST API)
  
//   const handleAddEvent = async (event) => {
//     const { id, name, status, route } = event;
//     if(admin){
//     if (!route.trim()) {
//       toast({
//         title: 'Invalid Input',
//         description: `Please provide a valid route for "${name}".`,
//         status: 'warning',
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

   
//     try {
//       setSaving(prev => ({ ...prev, [id]: true }));

//       await axios.post(SAVE_POST_API, { id, name, status, route },{
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${admin.token}`, // Add the token in the Authorization header
//         },
//       });

//       toast({
//         title: 'Success',
//         description: `Event "${name}" added successfully.`,
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       // Refetch saved events to update the state
//       await fetchSavedEvents();
//     } catch (error) {
//       console.error(`Failed to add event "${name}":`, error);
//       toast({
//         title: 'Error',
//         description: `Failed to add event "${name}". Please try again.`,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setSaving(prev => ({ ...prev, [id]: false }));
//     }
//   };}

//   // Update existing event (using PATCH API)
 
//   const handleUpdateEvent = async (event) => {
//     const { id, name, status,route } = event;
//     if(admin){
//     try {
//       setSaving(prev => ({ ...prev, [id]: true }));

//       await axios.patch(`${UPDATE_PATCH_API}/${id}`, { status,route },{
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${admin.token}`, // Add the token in the Authorization header
//         },
//       });

//       toast({
//         title: 'Success',
//         description: `Event "${name}" updated successfully.`,
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });

//       // Refetch saved events to update the state
//       await fetchSavedEvents();
//     } catch (error) {
//       console.error(`Failed to update event "${name}":`, error);
//       toast({
//         title: 'Error',
//         description: `Failed to update event "${name}". Please try again.`,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setSaving(prev => ({ ...prev, [id]: false }));
//     }
//   };
//   }

//   const handleLogout=async()=>
//   {
//     if (admin) {
//       const options = {
//         method: "post",
//         url: `${apiConfig.url}/admin/signout`,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${admin.token}`,
//         },
//       };
//       try {
//         const res = await axios(options);
//         console.log("logout res:",res);
//         localStorage.removeItem("admin");
//         toast({
//           title: 'Success',
//           description: `logout successful`,
//           status: 'success',
//           duration: 3000,
//           isClosable: true,
//         });
//       } catch (e) {
//         console.log(e);
//         toast({
//           title: 'Error',
//           description: `something went wrong`,
//           status: 'error',
//           duration: 5000,
//           isClosable: true,
//         });
//       }
//     }
//   }
//   if (loading) {
//     return (
//       <Flex justify="center" align="center" height="100vh" bg="gray.50">
//         <Spinner size="xl" />
//       </Flex>
//     );
//   }

//   return (
//     <Flex direction="column" justify="center" align="center" minHeight="100vh" bg="gray.50" p={6}>
//       <Box
//         w="100%"
//         maxWidth="800px"
//         p={8}
//         borderWidth="1px"
//         borderRadius="lg"
//         boxShadow="lg"
//         bg="white"
//       >
//         <Flex gap={6}>
//         <Button onClick={()=>handleLogout()}>Logout</Button>
//         <Menu>
//           <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
//             Result
//           </MenuButton>
//           <MenuList>
//             <MenuItem onClick={()=>route.push('/result')}>Result</MenuItem>
//             <MenuItem>Abstract</MenuItem>
//           </MenuList>
//         </Menu>
//         </Flex>
//         <Text fontSize="3xl" mb={6} fontWeight="bold" textAlign="center" color="teal.600">
//           Admin Panel
//         </Text>
       
//         <Divider mb={6} />
        
//         <VStack spacing={8} align="stretch">
//           <Table variant="striped" colorScheme="teal">
//             <Thead>
//               <Tr>
//                 <Th>Event Name</Th>
//                 <Th>Status</Th>
//                 <Th>Route</Th>
//                 <Th>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {events.map(event => (
//                 <Tr key={event.id}>
//                   <Td>{event.name}</Td>

//                   <Td>
//                     <Switch
//                       colorScheme="teal"
//                       isChecked={event.status}
//                       onChange={() => handleToggleEvent(event.id)}
//                     />
//                   </Td>
//                   <Td>
//                     <Input
//                       placeholder="Enter route (e.g., /web-n-app)"
//                       value={event.route}
//                       onChange={(e) => handleRouteChange(event.id, e.target.value)}
//                       bg="white"
//                       borderColor="teal.400"
//                       focusBorderColor="teal.600"
//                     />
//                   </Td>
//                   <Td>
//                     <Button
//                       colorScheme="teal"
//                       onClick={() => handleAddEvent(event)}
//                       isLoading={saving[event.id]}
//                       loadingText="Saving"
//                     >
//                       Add
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </VStack>
//       </Box>

//       <Box
//         w="100%"
//         maxWidth="800px"
//         p={8}
//         borderWidth="1px"
//         borderRadius="lg"
//         boxShadow="lg"
//         bg="white"
//       >
//         <Text fontSize="3xl" mb={6} fontWeight="bold" textAlign="center" color="teal.600">
//           Update Events
//         </Text>
//         <Divider mb={6} />

//         <VStack spacing={8} align="stretch">
//           <Table variant="striped" colorScheme="teal">
//             <Thead>
//               <Tr>
//                 <Th>Event Name</Th>
//                 <Th>Status</Th>
//                 <Th>Route</Th>
//                 <Th>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {submissionevents.map(event => (
//                 <Tr key={event.id}>
//                   <Td>{event.name}</Td>

//                   <Td>
//                     <Switch
//                       colorScheme="teal"
//                       isChecked={event.status}
//                       onChange={() => handleToggleSubmissionEvent(event.id)}
//                     />
//                   </Td>
//                   <Td>
//                     <Input
//                       placeholder="Enter route (e.g., /web-n-app)"
//                       value={event.route}
//                       onChange={(e) => handleSubmissionRouteChange(event.id, e.target.value)}
//                       bg="white"
//                       borderColor="teal.400"
//                       focusBorderColor="teal.600"
//                     />
//                   </Td>
//                   <Td>
//                     <Button
//                       colorScheme="teal"
//                       onClick={() => handleUpdateEvent(event)}
//                       isLoading={saving[event.id]}
//                       loadingText="Saving"
//                     >
//                       Update
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default AdminPage;

import React, { useState, useEffect } from 'react';
import {
  chakra,
  Box,
  Switch,
  Input,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  Divider,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Textarea,
  Badge,
  HStack,
  Checkbox,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import apiConfig from '../configs/api';
import { useRouter } from "next/router";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import privateAdminRoute from "../routers/privateAdminRoute";
import Layout from "../components/Layout";
import ContentLoader from "../components/ContentLoader";
import {
  publishResults,
  getPublishedResultsList,
  unpublishResults,
  getEventCandidates,
} from "../action/results";
import {
  getAllowedHackNovaLeaders,
  saveAllowedHackNovaLeaders,
  getAllHackNovaTeams,
} from "../action/hacknovaTeam";

const INITIAL_GET_API = `${apiConfig.url}/allevents/events`;
const SAVED_GET_API = `${apiConfig.url}/submission/get`;
const SAVE_POST_API = `${apiConfig.url}/submission/post`;
const UPDATE_PATCH_API = `${apiConfig.url}/submission/update`;

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState({});
  const [submissionevents, setSubmissionevents] = useState([]);
  const [resultEventSlug, setResultEventSlug] = useState("hacknova");
  const [resultRoundName, setResultRoundName] = useState("Round 1");
  const [resultShortlistedIds, setResultShortlistedIds] = useState("");
  const [publishingResults, setPublishingResults] = useState(false);
  const [publishedResultsList, setPublishedResultsList] = useState([]);
  const [unpublishingKey, setUnpublishingKey] = useState("");
  const [candidatesList, setCandidatesList] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(new Set());
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");
  const [showIdOption, setShowIdOption] = useState(true);
  const [showLeaderCollegeOption, setShowLeaderCollegeOption] = useState(true);

  // HackNova Submission Access Control state
  const [hacknovaTeams, setHacknovaTeams] = useState([]);
  const [loadingHacknovaTeams, setLoadingHacknovaTeams] = useState(false);
  const [allowedLeaderIds, setAllowedLeaderIds] = useState(new Set());
  const [allowedLeaderIdsInput, setAllowedLeaderIdsInput] = useState("");
  const [isHacknovaRestrictionActive, setIsHacknovaRestrictionActive] = useState(true);
  const [savingAllowedLeaders, setSavingAllowedLeaders] = useState(false);
  const [hacknovaTeamSearchQuery, setHacknovaTeamSearchQuery] = useState("");

  const route = useRouter();
  const toast = useToast();
  const admin = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admin") || "null") : null;

  const bgCard = "linear-gradient(180deg, rgba(11, 21, 46, 0.95) 0%, rgba(7, 16, 36, 0.95) 50%, rgba(4, 10, 28, 0.95) 100%)";
  const textColor = "#F8FAFC";
  const headerColor = "#38D9A9";
  const buttonColor = "primary";

  const fetchInitialEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(INITIAL_GET_API);
      const fetchedEvents = response.data;

      const initializedEvents = fetchedEvents.map(event => ({
        id: event.id,
        name: event.name,
        status: false,
        route: '',  
      }));

      setEvents(initializedEvents);
    } catch (error) {
      console.error('Failed to fetch initial events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch events. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedEvents = async () => {
    if(admin){
      try {
        setLoading(true);
        const response = await axios.get(SAVED_GET_API, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`,
          },
        });
        const savedEvents = response.data;
        const initializedEvents = savedEvents.map(event => ({
          id: event.event_id,
          name: event.event_name,
          status: event.event_status,
          route: event.event_route,  
        }));
        setSubmissionevents(initializedEvents);
      } catch (error) {
        console.error('Failed to fetch saved events:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch saved events. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPublishedResults = async () => {
    try {
      const data = await getPublishedResultsList();
      if (data && Array.isArray(data.results)) {
        setPublishedResultsList(data.results);
      }
    } catch (e) {
      console.error("Failed to fetch published results:", e);
    }
  };

  const fetchCandidates = async (slug, round) => {
    if (!slug) return;
    try {
      setLoadingCandidates(true);
      const data = await getEventCandidates(slug, round);
      if (data && data.success && Array.isArray(data.candidates)) {
        setCandidatesList(data.candidates);
        const preSelected = new Set(data.shortlisted_team_ids || []);
        setSelectedCandidateIds(preSelected);
        setResultShortlistedIds(Array.from(preSelected).sort((a, b) => a - b).join(", "));
        setShowIdOption(data.show_id !== false);
        setShowLeaderCollegeOption(data.show_leader_college !== false);
      } else {
        setCandidatesList([]);
        setSelectedCandidateIds(new Set());
        setResultShortlistedIds("");
        setShowIdOption(true);
        setShowLeaderCollegeOption(true);
      }
    } catch (e) {
      console.error("Failed to fetch candidates:", e);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchCandidates(resultEventSlug, resultRoundName);
  }, [resultEventSlug, resultRoundName]);

  const toggleCandidateShortlist = (id) => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setResultShortlistedIds(Array.from(next).sort((a, b) => a - b).join(", "));
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      filteredCandidates.forEach((c) => next.add(c.id));
      setResultShortlistedIds(Array.from(next).sort((a, b) => a - b).join(", "));
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedCandidateIds(new Set());
    setResultShortlistedIds("");
  };

  const handleManualIdsChange = (val) => {
    setResultShortlistedIds(val);
    const parsed = val
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    setSelectedCandidateIds(new Set(parsed));
  };

  const filteredCandidates = candidatesList.filter((c) => {
    const q = candidateSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = String(c.team_name || "").toLowerCase();
    const leader = String(c.leader_name || "").toLowerCase();
    const college = String(c.college || "").toLowerCase();
    const id = String(c.id || "").toLowerCase();
    return name.includes(q) || leader.includes(q) || college.includes(q) || id.includes(q);
  });

  const handlePublishResults = async () => {
    if (!resultEventSlug.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select or enter an event slug.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (!resultRoundName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a round title (e.g. Round 1).",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const numericIds = Array.from(selectedCandidateIds)
      .map((id) => parseInt(id, 10))
      .filter((n) => !isNaN(n));

    if (numericIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please tick at least one candidate/team to shortlist.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setPublishingResults(true);
      const res = await publishResults({
        event_slug: resultEventSlug.toLowerCase().trim(),
        round_name: resultRoundName.trim(),
        shortlisted_team_ids: numericIds,
        show_id: showIdOption,
        show_leader_college: showLeaderCollegeOption,
      });

      if (res && res.success) {
        toast({
          title: "Results Published!",
          description: `Successfully published ${numericIds.length} shortlisted candidates for ${resultEventSlug} - ${resultRoundName}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        await fetchPublishedResults();
        await fetchCandidates(resultEventSlug, resultRoundName);
      } else {
        toast({
          title: "Publish Failed",
          description: res?.error || "Could not publish results.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error publishing results:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while publishing results.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setPublishingResults(false);
    }
  };

  const handleUnpublishResults = async (eventSlug, roundName) => {
    try {
      setUnpublishingKey(`${eventSlug}_${roundName}`);
      const res = await unpublishResults({
        event_slug: eventSlug,
        round_name: roundName,
      });
      if (res && res.success) {
        toast({
          title: "Results Unpublished",
          description: `Unpublished results for ${eventSlug} - ${roundName}.`,
          status: "info",
          duration: 4000,
          isClosable: true,
        });
        await fetchPublishedResults();
      } else {
        toast({
          title: "Failed",
          description: res?.error || "Could not unpublish results.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.error("Error unpublishing:", e);
    } finally {
      setUnpublishingKey("");
    }
  };

  const fetchHacknovaTeamsAndAllowedLeaders = async () => {
    try {
      setLoadingHacknovaTeams(true);
      const [teamsData, allowedData] = await Promise.all([
        getAllHackNovaTeams(),
        getAllowedHackNovaLeaders(),
      ]);

      if (teamsData && Array.isArray(teamsData.teams)) {
        setHacknovaTeams(teamsData.teams);
      } else if (Array.isArray(teamsData)) {
        setHacknovaTeams(teamsData);
      }

      if (allowedData && allowedData.success) {
        const ids = (allowedData.allowed_leader_ids || []).map(Number);
        const idSet = new Set(ids);
        setAllowedLeaderIds(idSet);
        setAllowedLeaderIdsInput(Array.from(idSet).sort((a, b) => a - b).join(", "));
        setIsHacknovaRestrictionActive(allowedData.is_restricted !== false);
      }
    } catch (err) {
      console.error("Failed to load HackNova teams and allowed leaders:", err);
    } finally {
      setLoadingHacknovaTeams(false);
    }
  };

  const toggleAllowedLeaderId = (leaderId) => {
    const numId = Number(leaderId);
    setAllowedLeaderIds((prev) => {
      const next = new Set(prev);
      if (next.has(numId)) {
        next.delete(numId);
      } else {
        next.add(numId);
      }
      setAllowedLeaderIdsInput(Array.from(next).sort((a, b) => a - b).join(", "));
      return next;
    });
  };

  const handleSelectAllHacknovaLeaders = () => {
    setAllowedLeaderIds((prev) => {
      const next = new Set(prev);
      filteredHacknovaTeams.forEach((t) => {
        if (t.leader_user_id) next.add(Number(t.leader_user_id));
      });
      setAllowedLeaderIdsInput(Array.from(next).sort((a, b) => a - b).join(", "));
      return next;
    });
  };

  const handleClearAllHacknovaLeaders = () => {
    setAllowedLeaderIds(new Set());
    setAllowedLeaderIdsInput("");
  };

  const handleManualAllowedIdsChange = (val) => {
    setAllowedLeaderIdsInput(val);
    const parsed = val
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    setAllowedLeaderIds(new Set(parsed));
  };

  const handleSaveAllowedHacknovaLeaders = async () => {
    try {
      setSavingAllowedLeaders(true);
      const numericIds = Array.from(allowedLeaderIds)
        .map(Number)
        .filter((n) => !isNaN(n));

      const res = await saveAllowedHackNovaLeaders(
        numericIds,
        isHacknovaRestrictionActive
      );

      if (res && res.success) {
        toast({
          title: "Access Permissions Saved",
          description: `Saved ${numericIds.length} allowed Team Leader IDs (Enforce Restriction: ${isHacknovaRestrictionActive ? "ON" : "OFF"}).`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        await fetchHacknovaTeamsAndAllowedLeaders();
      } else {
        toast({
          title: "Error",
          description: res?.error || "Failed to save allowed leader IDs.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error saving allowed leaders:", err);
      toast({
        title: "Error",
        description: "Failed to save allowed Team Leader IDs.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSavingAllowedLeaders(false);
    }
  };

  const filteredHacknovaTeams = hacknovaTeams.filter((t) => {
    const q = hacknovaTeamSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = String(t.team_name || "").toLowerCase();
    const leaderFirst = String(t.leader_first_name || "").toLowerCase();
    const leaderLast = String(t.leader_last_name || "").toLowerCase();
    const leaderEmail = String(t.leader_email || "").toLowerCase();
    const leaderCollege = String(t.leader_college || "").toLowerCase();
    const teamId = String(t.team_id || "").toLowerCase();
    const leaderId = String(t.leader_user_id || "").toLowerCase();
    return (
      name.includes(q) ||
      leaderFirst.includes(q) ||
      leaderLast.includes(q) ||
      leaderEmail.includes(q) ||
      leaderCollege.includes(q) ||
      teamId.includes(q) ||
      leaderId.includes(q)
    );
  });

  useEffect(() => {
    const initialize = async () => {
      await fetchInitialEvents();
      await fetchSavedEvents();
      await fetchPublishedResults();
      await fetchHacknovaTeamsAndAllowedLeaders();
    };
    initialize();
  }, []);

  const handleToggleEvent = (eventId) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: !event.status } : event
      )
    );
  };

  const handleToggleSubmissionEvent = (eventId) => {
    setSubmissionevents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: !event.status } : event
      )
    );
  };

  const handleRouteChange = (eventId, newRoute) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, route: newRoute } : event
      )
    );
  };

  const handleSubmissionRouteChange = (eventId, newRoute) => {
    setSubmissionevents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, route: newRoute } : event
      )
    );
  };

  const handleAddEvent = async (event) => {
    const { id, name, status, route } = event;
    if(admin){
      if (!route.trim()) {
        toast({
          title: 'Invalid Input',
          description: `Please provide a valid route for "${name}".`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        setSaving(prev => ({ ...prev, [id]: true }));
        await axios.post(SAVE_POST_API, { id, name, status, route },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`,
          },
        });

        toast({
          title: 'Success',
          description: `Event "${name}" added successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await fetchSavedEvents();
      } catch (error) {
        console.error(`Failed to add event "${name}":`, error);
        toast({
          title: 'Error',
          description: `Failed to add event "${name}". Please try again.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSaving(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleUpdateEvent = async (event) => {
    const { id, name, status, route } = event;
    if(admin){
      try {
        setSaving(prev => ({ ...prev, [id]: true }));
        await axios.patch(`${UPDATE_PATCH_API}/${id}`, { status, route },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`,
          },
        });

        toast({
          title: 'Success',
          description: `Event "${name}" updated successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        await fetchSavedEvents();
      } catch (error) {
        console.error(`Failed to update event "${name}":`, error);
        toast({
          title: 'Error',
          description: `Failed to update event "${name}". Please try again.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSaving(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleLogout = async () => {
    if (admin) {
      setLoggingOut(true);
      try {
        await axios.post(`${apiConfig.url}/admin/signout`, {}, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        localStorage.removeItem("admin");
        toast({
          title: 'Success',
          description: `Logout successful`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        route.push('/adminlogin');
      } catch (e) {
        // Even if API call fails, clear local storage and redirect
        localStorage.removeItem("admin");
        route.push('/adminlogin');
        toast({
          title: 'Error',
          description: `Something went wrong`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoggingOut(false);
      }
    }
  }

  if (loading) {
    return <ContentLoader text="SYNCHRONIZING MISSION CONTROL EVENTS..." />;
  }

  return (
    <Layout>
      <Flex direction="column" justify="center" align="center" width="full" py={{ base: 6, md: 10 }} px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Add Events Card */}
        <Box
          w="100%"
          maxWidth="900px"
          p={{ base: 6, md: 8 }}
          position="relative"
          border="1px solid rgba(56, 217, 169, 0.4)"
          borderRadius="none"
          boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
          bg={bgCard}
          backdropFilter="blur(16px)"
          overflow="hidden"
          mb={8}
        >
          {/* 4 Corner HUD Brackets */}
          <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          <Flex gap={4} mb={6} justify="space-between" align="center" wrap="wrap">
            <Flex gap={3}>
              <Button
                size="sm"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.2)"
                color="#94A3B8"
                fontFamily="'Inter', sans-serif"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="0.1em"
                textTransform="uppercase"
                _hover={{ bg: "whiteAlpha.100", color: "#FFFFFF" }}
                onClick={handleLogout}
                isLoading={loggingOut}
                loadingText="Logging out..."
              >
                Logout
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                  bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                  color="#030512"
                  fontFamily="'Inter', sans-serif"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  _hover={{ bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)" }}
                >
                  Results &amp; Data
                </MenuButton>
                <MenuList bg="#071024" borderColor="rgba(56, 217, 169, 0.3)" fontFamily="'Inter', sans-serif">
                  <MenuItem bg="#071024" color="#FFFFFF" _hover={{ bg: "rgba(56, 217, 169, 0.15)", color: "#38D9A9" }} onClick={() => route.push('/result')}>
                    Download Results CSV
                  </MenuItem>
                  <MenuItem
                    bg="#071024"
                    color="#FFFFFF"
                    _hover={{ bg: "rgba(56, 217, 169, 0.15)", color: "#38D9A9" }}
                    onClick={() => {
                      try {
                        const adminObj = JSON.parse(localStorage.getItem("admin") || "{}");
                        const tokenQuery = adminObj?.token ? `?token=${encodeURIComponent(adminObj.token)}` : "";
                        window.open(`${apiConfig.url}/admin/portal${tokenQuery}`, "_blank");
                      } catch {
                        window.open(`${apiConfig.url}/admin/portal`, "_blank");
                      }
                    }}
                  >
                    Admin Submissions &amp; CSV Portal ↗
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          <Text
            fontFamily="'Orbitron', sans-serif !important"
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={2}
            fontWeight="bold"
            textAlign="center"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            ADMIN PANEL - <chakra.span color="#38D9A9">ADD EVENTS</chakra.span>
          </Text>
          <Divider mb={6} borderColor="rgba(56, 217, 169, 0.3)" />

          <VStack spacing={6} align="stretch" fontFamily="'Inter', sans-serif">
            <Table variant="simple" size="md">
              <Thead bg="rgba(56, 217, 169, 0.1)">
                <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Event Name</Th>
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Status</Th>
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Route</Th>
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {events.map(event => (
                  <Tr key={event.id} borderBottom="1px solid rgba(255, 255, 255, 0.08)" _hover={{ bg: "rgba(56, 217, 169, 0.08)" }}>
                    <Td color="#FFFFFF" fontWeight="medium">{event.name}</Td>
                    <Td>
                      <Switch
                        colorScheme="teal"
                        isChecked={event.status}
                        onChange={() => handleToggleEvent(event.id)}
                      />
                    </Td>
                    <Td>
                      <Input
                        placeholder="Enter route"
                        value={event.route}
                        onChange={(e) => handleRouteChange(event.id, e.target.value)}
                        bg="rgba(3, 8, 23, 0.8)"
                        color={textColor}
                        borderColor="rgba(56, 217, 169, 0.3)"
                        focusBorderColor="#38D9A9"
                        size="sm"
                        borderRadius="md"
                      />
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                        color="#030512"
                        fontFamily="'Inter', sans-serif"
                        fontSize="xs"
                        fontWeight="bold"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        rounded="md"
                        _hover={{ bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)" }}
                        onClick={() => handleAddEvent(event)}
                        isLoading={saving[event.id]}
                        loadingText="Saving"
                      >
                        Add
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </Box>

        {/* Update Events Card */}
        <Box
          w="100%"
          maxWidth="900px"
          p={{ base: 6, md: 8 }}
          position="relative"
          border="1px solid rgba(56, 217, 169, 0.4)"
          borderRadius="none"
          boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
          bg={bgCard}
          backdropFilter="blur(16px)"
          overflow="hidden"
        >
          {/* 4 Corner HUD Brackets */}
          <Box position="absolute" top="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" left="6px" w="10px" h="10px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="6px" right="6px" w="10px" h="10px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          <Text
            fontFamily="'Orbitron', sans-serif !important"
            fontSize={{ base: "2xl", md: "3xl" }}
            mb={2}
            fontWeight="bold"
            textAlign="center"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            UPDATE <chakra.span color="#38D9A9">EVENTS</chakra.span>
          </Text>
          <Divider mb={6} borderColor="rgba(56, 217, 169, 0.3)" />

          <VStack spacing={6} align="stretch" fontFamily="'Inter', sans-serif">
            <Table variant="simple" size="md">
              <Thead bg="rgba(56, 217, 169, 0.1)">
                <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Event Name</Th>
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Status</Th>
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Route</Th>
                  <Th fontFamily="'Orbitron', sans-serif !important" color={headerColor} letterSpacing="0.1em" textTransform="uppercase">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {submissionevents.map(event => (
                  <Tr key={event.id} borderBottom="1px solid rgba(255, 255, 255, 0.08)" _hover={{ bg: "rgba(56, 217, 169, 0.08)" }}>
                    <Td color="#FFFFFF" fontWeight="medium">{event.name}</Td>
                    <Td>
                      <Switch
                        colorScheme="teal"
                        isChecked={event.status}
                        onChange={() => handleToggleSubmissionEvent(event.id)}
                      />
                    </Td>
                    <Td>
                      <Input
                        placeholder="Enter route"
                        value={event.route}
                        onChange={(e) => handleSubmissionRouteChange(event.id, e.target.value)}
                        bg="rgba(3, 8, 23, 0.8)"
                        color={textColor}
                        borderColor="rgba(56, 217, 169, 0.3)"
                        focusBorderColor="#38D9A9"
                        size="sm"
                        borderRadius="md"
                      />
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                        color="#030512"
                        fontFamily="'Inter', sans-serif"
                        fontSize="xs"
                        fontWeight="bold"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        rounded="md"
                        _hover={{ bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)" }}
                        onClick={() => handleUpdateEvent(event)}
                        isLoading={saving[event.id]}
                        loadingText="Saving"
                      >
                        Update
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </Box>

        {/* HackNova Submission Access Controller Card */}
        <Box
          w="100%"
          maxWidth="900px"
          p={{ base: 4, sm: 6, md: 8 }}
          position="relative"
          border="1px solid rgba(56, 217, 169, 0.4)"
          borderRadius="none"
          boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
          bg={bgCard}
          backdropFilter="blur(16px)"
          overflow="hidden"
          mt={8}
        >
          {/* 4 Corner HUD Brackets */}
          <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          <Text
            fontFamily="'Orbitron', sans-serif !important"
            fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
            mb={2}
            fontWeight="bold"
            textAlign="center"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            HACKNOVA <chakra.span color="#38D9A9">SUBMISSION ACCESS</chakra.span>
          </Text>
          <Text
            fontFamily="'Inter', sans-serif"
            fontSize="xs"
            color="#94A3B8"
            textAlign="center"
            mb={4}
          >
            Authorize specific Team Leader IDs applicable to submit project deliverables on /hacknova
          </Text>
          <Divider mb={6} borderColor="rgba(56, 217, 169, 0.3)" />

          <VStack spacing={5} align="stretch" fontFamily="'Inter', sans-serif">
            {/* Whitelist Mode Toggle Switch */}
            <Box
              p={{ base: 3, sm: 4 }}
              rounded="md"
              bg="rgba(3, 8, 23, 0.75)"
              border="1px solid rgba(56, 217, 169, 0.35)"
              boxShadow="0 4px 14px rgba(0, 0, 0, 0.4)"
            >
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                gap={3}
              >
                <HStack spacing={3} align="center">
                  <Switch
                    id="enforce-hacknova-restriction"
                    colorScheme="teal"
                    size="md"
                    isChecked={isHacknovaRestrictionActive}
                    onChange={(e) => setIsHacknovaRestrictionActive(e.target.checked)}
                  />
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#FFFFFF">
                      Enforce Shortlist Restriction
                    </Text>
                    <Text fontSize="2xs" color="#94A3B8">
                      {isHacknovaRestrictionActive
                        ? "Only checked / listed Team Leaders are applicable to submit deliverables"
                        : "Open mode: Any registered team leader can submit deliverables"}
                    </Text>
                  </Box>
                </HStack>

                <Badge
                  px={2.5}
                  py={1}
                  rounded="full"
                  fontSize="2xs"
                  fontWeight="bold"
                  color={isHacknovaRestrictionActive ? "#38D9A9" : "#F59E0B"}
                  bg={isHacknovaRestrictionActive ? "rgba(56, 217, 169, 0.15)" : "rgba(245, 158, 11, 0.15)"}
                  border={`1px solid ${isHacknovaRestrictionActive ? "#38D9A9" : "#F59E0B"}`}
                >
                  {isHacknovaRestrictionActive ? "RESTRICTION ACTIVE" : "RESTRICTION OFF"}
                </Badge>
              </Flex>
            </Box>

            {/* Team Leader Shortlist Table */}
            <Box mt={2}>
              <Flex
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={2}
                mb={3}
              >
                <HStack spacing={2} wrap="wrap">
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="#38D9A9"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                  >
                    Registered HackNova Squads
                  </Text>
                  <Badge
                    px={2.5}
                    py={0.5}
                    rounded="full"
                    bg="rgba(56, 217, 169, 0.15)"
                    border="1px solid #38D9A9"
                    color="#38D9A9"
                    fontSize="2xs"
                    fontWeight="bold"
                  >
                    {allowedLeaderIds.size} Allowed Leaders / {hacknovaTeams.length} Total Squads
                  </Badge>
                </HStack>

                <HStack spacing={2} w={{ base: "full", sm: "auto" }} justify={{ base: "space-between", sm: "flex-end" }}>
                  <Button
                    size="xs"
                    flex={{ base: 1, sm: "initial" }}
                    variant="outline"
                    borderColor="rgba(56, 217, 169, 0.4)"
                    color="#38D9A9"
                    onClick={handleSelectAllHacknovaLeaders}
                    _hover={{ bg: "rgba(56, 217, 169, 0.15)" }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="xs"
                    flex={{ base: 1, sm: "initial" }}
                    variant="outline"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="#94A3B8"
                    onClick={handleClearAllHacknovaLeaders}
                    _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="xs"
                    flex={{ base: 1, sm: "initial" }}
                    variant="outline"
                    borderColor="rgba(34, 211, 238, 0.4)"
                    color="#22D3EE"
                    onClick={fetchHacknovaTeamsAndAllowedLeaders}
                    isLoading={loadingHacknovaTeams}
                    _hover={{ bg: "rgba(34, 211, 238, 0.15)" }}
                  >
                    Refresh
                  </Button>
                </HStack>
              </Flex>

              {/* Search bar */}
              <InputGroup size="sm" mb={3}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="#38D9A9" />
                </InputLeftElement>
                <Input
                  placeholder="Search by Squad Name, Team ID, Leader ID, Leader Name, or College..."
                  value={hacknovaTeamSearchQuery}
                  onChange={(e) => setHacknovaTeamSearchQuery(e.target.value)}
                  bg="rgba(3, 8, 23, 0.8)"
                  color={textColor}
                  borderColor="rgba(56, 217, 169, 0.3)"
                  focusBorderColor="#38D9A9"
                  rounded="md"
                />
              </InputGroup>

              {/* Mobile swipe hint */}
              <Text display={{ base: "block", md: "none" }} fontSize="2xs" color="#94A3B8" mb={2}>
                👉 Swipe horizontally to view full squad details &amp; checkboxes
              </Text>

              {/* Squads Table */}
              <Box
                border="1px solid rgba(56, 217, 169, 0.3)"
                rounded="md"
                bg="rgba(3, 8, 23, 0.7)"
                maxH="440px"
                overflowY="auto"
                overflowX="auto"
                sx={{
                  "&::-webkit-scrollbar": { width: "5px", height: "5px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(56, 217, 169, 0.4)",
                    borderRadius: "3px",
                  },
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {loadingHacknovaTeams ? (
                  <Flex justify="center" align="center" py={12} direction="column" gap={2}>
                    <Spinner size="md" color="#38D9A9" />
                    <Text fontSize="xs" color="#94A3B8">Loading HackNova squads...</Text>
                  </Flex>
                ) : filteredHacknovaTeams.length === 0 ? (
                  <Box py={8} textAlign="center">
                    <Text fontSize="xs" color="#94A3B8">
                      {hacknovaTeams.length === 0
                        ? "No registered HackNova squads found."
                        : `No squads match "${hacknovaTeamSearchQuery}".`}
                    </Text>
                  </Box>
                ) : (
                  <Table variant="simple" size="sm" minW="520px">
                    <Thead bg="#071024" position="sticky" top={0} zIndex={1}>
                      <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
                        <Th color="#38D9A9" fontSize="2xs" w="45px" textAlign="center">#</Th>
                        <Th color="#38D9A9" fontSize="2xs" w="95px">Leader ID</Th>
                        <Th color="#38D9A9" fontSize="2xs" w="80px">Team ID</Th>
                        <Th color="#38D9A9" fontSize="2xs" minW="130px">Squad / Team</Th>
                        <Th color="#38D9A9" fontSize="2xs" minW="130px">Leader / College</Th>
                        <Th color="#38D9A9" fontSize="2xs" w="140px" textAlign="center">Applicable to Submit</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredHacknovaTeams.map((team, idx) => {
                        const leaderId = Number(team.leader_user_id);
                        const isAllowed = allowedLeaderIds.has(leaderId);
                        const leaderFullName = [team.leader_first_name, team.leader_last_name].filter(Boolean).join(" ") || "Leader";
                        return (
                          <Tr
                            key={team.team_id || idx}
                            borderBottom="1px solid rgba(255, 255, 255, 0.06)"
                            bg={isAllowed ? "rgba(56, 217, 169, 0.09)" : "transparent"}
                            _hover={{ bg: "rgba(56, 217, 169, 0.16)" }}
                            cursor="pointer"
                            onClick={() => toggleAllowedLeaderId(leaderId)}
                            transition="background 0.15s ease"
                          >
                            <Td color="#94A3B8" fontSize="xs" textAlign="center">{idx + 1}</Td>
                            <Td>
                              <Badge
                                px={2}
                                py={0.5}
                                rounded="md"
                                bg="rgba(34, 211, 238, 0.15)"
                                border="1px solid rgba(34, 211, 238, 0.5)"
                                color="#22D3EE"
                                fontFamily="'Orbitron', sans-serif"
                                fontSize="2xs"
                                fontWeight="bold"
                              >
                                #{leaderId}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                px={1.5}
                                py={0.5}
                                rounded="sm"
                                bg="rgba(255, 255, 255, 0.06)"
                                border="1px solid rgba(255, 255, 255, 0.15)"
                                color="#CBD5E1"
                                fontFamily="'Orbitron', sans-serif"
                                fontSize="2xs"
                              >
                                #{team.team_id}
                              </Badge>
                            </Td>
                            <Td color="#FFFFFF" fontWeight="semibold" fontSize="xs">
                              {team.team_name}
                            </Td>
                            <Td color="#CBD5E1" fontSize="xs">
                              {leaderFullName}
                              {team.leader_college && team.leader_college !== "—" ? ` (${team.leader_college})` : ""}
                            </Td>
                            <Td textAlign="center" onClick={(e) => e.stopPropagation()}>
                              <Flex justify="center" align="center" gap={1.5}>
                                <Checkbox
                                  colorScheme="teal"
                                  size="md"
                                  isChecked={isAllowed}
                                  onChange={() => toggleAllowedLeaderId(leaderId)}
                                />
                                <Badge
                                  px={2}
                                  py={0.5}
                                  rounded="full"
                                  fontSize="3xs"
                                  fontWeight="bold"
                                  bg={isAllowed ? "rgba(56, 217, 169, 0.2)" : "rgba(239, 68, 68, 0.15)"}
                                  color={isAllowed ? "#38D9A9" : "#F87171"}
                                  border={`1px solid ${isAllowed ? "#38D9A9" : "rgba(239, 68, 68, 0.4)"}`}
                                  cursor="pointer"
                                  onClick={() => toggleAllowedLeaderId(leaderId)}
                                >
                                  {isAllowed ? "APPLICABLE" : "RESTRICTED"}
                                </Badge>
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </Box>

            {/* Manual IDs Synced Input */}
            <Box>
              <Flex justify="space-between" align="center" mb={1.5}>
                <Text fontSize="2xs" fontWeight="bold" color="#94A3B8" textTransform="uppercase" letterSpacing="0.05em">
                  Allowed Team Leader IDs (comma-separated, auto-synced with ticked leaders above)
                </Text>
              </Flex>
              <Textarea
                placeholder="Selected Team Leader IDs will automatically appear here, or enter comma-separated IDs (e.g. 101, 105, 120)..."
                value={allowedLeaderIdsInput}
                onChange={(e) => handleManualAllowedIdsChange(e.target.value)}
                bg="rgba(3, 8, 23, 0.8)"
                color={textColor}
                borderColor="rgba(56, 217, 169, 0.3)"
                focusBorderColor="#38D9A9"
                size="xs"
                rounded="md"
                rows={2}
              />
            </Box>

            {/* Action Buttons */}
            <Flex
              direction={{ base: "column-reverse", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              gap={3}
              pt={2}
            >
              <Button
                as="a"
                href="/hacknova"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                w={{ base: "full", sm: "auto" }}
                variant="outline"
                borderColor="rgba(56, 217, 169, 0.4)"
                color="#38D9A9"
                fontSize="xs"
                rounded="md"
                _hover={{ bg: "rgba(56, 217, 169, 0.1)" }}
                textAlign="center"
              >
                View Submission Portal: /hacknova ↗
              </Button>

              <Button
                size="md"
                w={{ base: "full", sm: "auto" }}
                bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                color="#030512"
                fontFamily="'Inter', sans-serif"
                fontSize="xs"
                fontWeight="extrabold"
                letterSpacing="0.1em"
                textTransform="uppercase"
                rounded="md"
                _hover={{ bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)" }}
                onClick={handleSaveAllowedHacknovaLeaders}
                isLoading={savingAllowedLeaders}
                loadingText="Saving Permissions..."
                px={6}
              >
                Save Allowed Team Leaders
              </Button>
            </Flex>
          </VStack>
        </Box>

        {/* Publish Event Results Card */}
        <Box
          w="100%"
          maxWidth="900px"
          p={{ base: 4, sm: 6, md: 8 }}
          position="relative"
          border="1px solid rgba(56, 217, 169, 0.4)"
          borderRadius="none"
          boxShadow="0 0 30px rgba(56, 217, 169, 0.2), 0 12px 32px rgba(0, 0, 0, 0.85)"
          bg={bgCard}
          backdropFilter="blur(16px)"
          overflow="hidden"
          mt={8}
        >
          {/* 4 Corner HUD Brackets */}
          <Box position="absolute" top="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" top="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderTop="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="4px" left="4px" w="8px" h="8px" borderLeft="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />
          <Box position="absolute" bottom="4px" right="4px" w="8px" h="8px" borderRight="2px solid #38D9A9" borderBottom="2px solid #38D9A9" pointerEvents="none" />

          <Text
            fontFamily="'Orbitron', sans-serif !important"
            fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
            mb={2}
            fontWeight="bold"
            textAlign="center"
            color="#FFFFFF"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            PUBLISH <chakra.span color="#38D9A9">EVENT RESULTS</chakra.span>
          </Text>
          <Text
            fontFamily="'Inter', sans-serif"
            fontSize="xs"
            color="#94A3B8"
            textAlign="center"
            mb={4}
          >
            Broadcast shortlisted Team / Participant IDs publicly for HackNova, InnoWave, Freeze, etc. Public results on /results are automatically sorted in alphabetical order of name.
          </Text>
          <Divider mb={6} borderColor="rgba(56, 217, 169, 0.3)" />

          <VStack spacing={5} align="stretch" fontFamily="'Inter', sans-serif">
            {/* Event Slug Selector */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#38D9A9" textTransform="uppercase" mb={2} letterSpacing="0.05em">
                Select Event
              </Text>
              <Flex gap={3} direction={{ base: "column", sm: "row" }}>
                <Select
                  value={resultEventSlug}
                  onChange={(e) => setResultEventSlug(e.target.value)}
                  bg="rgba(3, 8, 23, 0.8)"
                  color={textColor}
                  borderColor="rgba(56, 217, 169, 0.3)"
                  focusBorderColor="#38D9A9"
                  size="md"
                  rounded="md"
                  flex="1"
                >
                  <option value="hacknova" style={{ background: "#071024" }}>HackNova (hacknova)</option>
                  <option value="innowave" style={{ background: "#071024" }}>InnoWave (innowave)</option>
                  <option value="freeze" style={{ background: "#071024" }}>Freeze (freeze)</option>
                  <option value="rootcause" style={{ background: "#071024" }}>Root Cause (rootcause)</option>
                  {events
                    .filter((ev) => !["hacknova", "innowave", "freeze", "rootcause"].includes(ev.route?.toLowerCase().replace(/^\//, "")))
                    .map((ev) => {
                      const slug = (ev.route ? ev.route.replace(/^\//, "") : ev.name.toLowerCase().replace(/\s+/g, "")).toLowerCase();
                      return (
                        <option key={ev.id} value={slug} style={{ background: "#071024" }}>
                          {ev.name} ({slug})
                        </option>
                      );
                    })}
                </Select>

                <Input
                  placeholder="Or custom event slug..."
                  value={resultEventSlug}
                  onChange={(e) => setResultEventSlug(e.target.value.toLowerCase().trim())}
                  bg="rgba(3, 8, 23, 0.8)"
                  color={textColor}
                  borderColor="rgba(56, 217, 169, 0.3)"
                  focusBorderColor="#38D9A9"
                  size="md"
                  rounded="md"
                  flex="1"
                />
              </Flex>
            </Box>

            {/* Round Name */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#38D9A9" textTransform="uppercase" mb={2} letterSpacing="0.05em">
                Round Title
              </Text>
              <Input
                placeholder="e.g. Round 1, Round 2, Finals"
                value={resultRoundName}
                onChange={(e) => setResultRoundName(e.target.value)}
                bg="rgba(3, 8, 23, 0.8)"
                color={textColor}
                borderColor="rgba(56, 217, 169, 0.3)"
                focusBorderColor="#38D9A9"
                size="md"
                rounded="md"
              />
            </Box>

            {/* Public Column Display Options */}
            <Box
              p={{ base: 3, sm: 4 }}
              rounded="md"
              bg="rgba(3, 8, 23, 0.75)"
              border="1px solid rgba(56, 217, 169, 0.35)"
              boxShadow="0 4px 14px rgba(0, 0, 0, 0.4)"
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="#38D9A9"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={3}
              >
                Public Column Visibility Options
              </Text>
              <Flex direction={{ base: "column", md: "row" }} gap={{ base: 3, md: 6 }}>
                <HStack spacing={3} align="center">
                  <Switch
                    id="show-id-option"
                    colorScheme="teal"
                    size="md"
                    isChecked={showIdOption}
                    onChange={(e) => setShowIdOption(e.target.checked)}
                  />
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#FFFFFF">
                      Display Candidate / Team ID
                    </Text>
                    <Badge
                      px={1.5}
                      py={0.2}
                      rounded="sm"
                      fontSize="2xs"
                      color={showIdOption ? "#38D9A9" : "#94A3B8"}
                      bg={showIdOption ? "rgba(56, 217, 169, 0.15)" : "rgba(255, 255, 255, 0.05)"}
                      border={`1px solid ${showIdOption ? "rgba(56, 217, 169, 0.4)" : "rgba(255, 255, 255, 0.1)"}`}
                    >
                      {showIdOption ? "VISIBLE ON /RESULTS" : "HIDDEN ON /RESULTS"}
                    </Badge>
                  </Box>
                </HStack>

                <HStack spacing={3} align="center">
                  <Switch
                    id="show-leader-college-option"
                    colorScheme="teal"
                    size="md"
                    isChecked={showLeaderCollegeOption}
                    onChange={(e) => setShowLeaderCollegeOption(e.target.checked)}
                  />
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="#FFFFFF">
                      Display Leader / College
                    </Text>
                    <Badge
                      px={1.5}
                      py={0.2}
                      rounded="sm"
                      fontSize="2xs"
                      color={showLeaderCollegeOption ? "#38D9A9" : "#94A3B8"}
                      bg={showLeaderCollegeOption ? "rgba(56, 217, 169, 0.15)" : "rgba(255, 255, 255, 0.05)"}
                      border={`1px solid ${showLeaderCollegeOption ? "rgba(56, 217, 169, 0.4)" : "rgba(255, 255, 255, 0.1)"}`}
                    >
                      {showLeaderCollegeOption ? "VISIBLE ON /RESULTS" : "HIDDEN ON /RESULTS"}
                    </Badge>
                  </Box>
                </HStack>
              </Flex>
            </Box>

            {/* Candidate Shortlist Selection Table with Checkbox / Tick */}
            <Box mt={2}>
              <Flex
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                direction={{ base: "column", sm: "row" }}
                gap={2}
                mb={3}
              >
                <HStack spacing={2} wrap="wrap">
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="#38D9A9"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                  >
                    Candidates / Teams
                  </Text>
                  <Badge
                    px={2.5}
                    py={0.5}
                    rounded="full"
                    bg="rgba(56, 217, 169, 0.15)"
                    border="1px solid #38D9A9"
                    color="#38D9A9"
                    fontSize="2xs"
                    fontWeight="bold"
                  >
                    {selectedCandidateIds.size} Shortlisted / {candidatesList.length} Total
                  </Badge>
                </HStack>

                <HStack spacing={2} w={{ base: "full", sm: "auto" }} justify={{ base: "space-between", sm: "flex-end" }}>
                  <Button
                    size="xs"
                    flex={{ base: 1, sm: "initial" }}
                    variant="outline"
                    borderColor="rgba(56, 217, 169, 0.4)"
                    color="#38D9A9"
                    onClick={handleSelectAllFiltered}
                    _hover={{ bg: "rgba(56, 217, 169, 0.15)" }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="xs"
                    flex={{ base: 1, sm: "initial" }}
                    variant="outline"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="#94A3B8"
                    onClick={handleDeselectAll}
                    _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  >
                    Clear All
                  </Button>
                </HStack>
              </Flex>

              {/* Search bar */}
              <InputGroup size="sm" mb={3}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="#38D9A9" />
                </InputLeftElement>
                <Input
                  placeholder="Search by Team Name, ID, Leader, or College..."
                  value={candidateSearchQuery}
                  onChange={(e) => setCandidateSearchQuery(e.target.value)}
                  bg="rgba(3, 8, 23, 0.8)"
                  color={textColor}
                  borderColor="rgba(56, 217, 169, 0.3)"
                  focusBorderColor="#38D9A9"
                  rounded="md"
                />
              </InputGroup>

              {/* Mobile swipe hint */}
              <Text display={{ base: "block", md: "none" }} fontSize="2xs" color="#94A3B8" mb={2}>
                👉 Swipe horizontally to view full candidate details &amp; checkboxes
              </Text>

              {/* Candidate Table */}
              <Box
                border="1px solid rgba(56, 217, 169, 0.3)"
                rounded="md"
                bg="rgba(3, 8, 23, 0.7)"
                maxH="440px"
                overflowY="auto"
                overflowX="auto"
                sx={{
                  "&::-webkit-scrollbar": { width: "5px", height: "5px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(56, 217, 169, 0.4)",
                    borderRadius: "3px",
                  },
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {loadingCandidates ? (
                  <Flex justify="center" align="center" py={12} direction="column" gap={2}>
                    <Spinner size="md" color="#38D9A9" />
                    <Text fontSize="xs" color="#94A3B8">Loading candidates for {resultEventSlug}...</Text>
                  </Flex>
                ) : filteredCandidates.length === 0 ? (
                  <Box py={8} textAlign="center">
                    <Text fontSize="xs" color="#94A3B8">
                      {candidatesList.length === 0
                        ? `No registered teams or candidates found for "${resultEventSlug}".`
                        : `No candidates match "${candidateSearchQuery}".`}
                    </Text>
                  </Box>
                ) : (
                  <Table variant="simple" size="sm" minW="480px">
                    <Thead bg="#071024" position="sticky" top={0} zIndex={1}>
                      <Tr borderBottom="2px solid rgba(56, 217, 169, 0.4)">
                        <Th color="#38D9A9" fontSize="2xs" w="45px" textAlign="center">#</Th>
                        <Th color="#38D9A9" fontSize="2xs" w="75px">ID</Th>
                        <Th color="#38D9A9" fontSize="2xs" minW="130px">Team / Candidate</Th>
                        <Th color="#38D9A9" fontSize="2xs" minW="120px">Leader / College</Th>
                        <Th color="#38D9A9" fontSize="2xs" w="130px" textAlign="center">Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredCandidates.map((cand, idx) => {
                        const isTicked = selectedCandidateIds.has(cand.id);
                        return (
                          <Tr
                            key={cand.id}
                            borderBottom="1px solid rgba(255, 255, 255, 0.06)"
                            bg={isTicked ? "rgba(56, 217, 169, 0.09)" : "transparent"}
                            _hover={{ bg: "rgba(56, 217, 169, 0.16)" }}
                            cursor="pointer"
                            onClick={() => toggleCandidateShortlist(cand.id)}
                            transition="background 0.15s ease"
                          >
                            <Td color="#94A3B8" fontSize="xs" textAlign="center">{idx + 1}</Td>
                            <Td>
                              <Badge
                                px={1.5}
                                py={0.5}
                                rounded="md"
                                bg="rgba(34, 211, 238, 0.12)"
                                border="1px solid rgba(34, 211, 238, 0.4)"
                                color="#22D3EE"
                                fontFamily="'Orbitron', sans-serif"
                                fontSize="2xs"
                              >
                                #{cand.id}
                              </Badge>
                            </Td>
                            <Td color="#FFFFFF" fontWeight="semibold" fontSize="xs">
                              {cand.team_name}
                            </Td>
                            <Td color="#CBD5E1" fontSize="xs">
                              {cand.leader_name}
                              {cand.college && cand.college !== "—" ? ` (${cand.college})` : ""}
                            </Td>
                            <Td textAlign="center" onClick={(e) => e.stopPropagation()}>
                              <Flex justify="center" align="center" gap={1.5}>
                                <Checkbox
                                  colorScheme="teal"
                                  size="md"
                                  isChecked={isTicked}
                                  onChange={() => toggleCandidateShortlist(cand.id)}
                                />
                                <Badge
                                  px={1.5}
                                  py={0.5}
                                  rounded="full"
                                  fontSize="3xs"
                                  fontWeight="bold"
                                  bg={isTicked ? "rgba(56, 217, 169, 0.2)" : "rgba(255, 255, 255, 0.05)"}
                                  color={isTicked ? "#38D9A9" : "#64748B"}
                                  border={`1px solid ${isTicked ? "#38D9A9" : "rgba(255, 255, 255, 0.1)"}`}
                                  cursor="pointer"
                                  onClick={() => toggleCandidateShortlist(cand.id)}
                                >
                                  {isTicked ? "SHORTLISTED" : "UNSELECTED"}
                                </Badge>
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </Box>

            {/* Optional Manual IDs Synced Field */}
            <Box>
              <Flex justify="space-between" align="center" mb={1.5}>
                <Text fontSize="2xs" fontWeight="bold" color="#94A3B8" textTransform="uppercase" letterSpacing="0.05em">
                  Shortlisted IDs (Auto-synced with ticked candidates above)
                </Text>
              </Flex>
              <Textarea
                placeholder="Selected candidate IDs will automatically appear here..."
                value={resultShortlistedIds}
                onChange={(e) => handleManualIdsChange(e.target.value)}
                bg="rgba(3, 8, 23, 0.8)"
                color={textColor}
                borderColor="rgba(56, 217, 169, 0.3)"
                focusBorderColor="#38D9A9"
                size="xs"
                rounded="md"
                rows={2}
              />
            </Box>

            {/* Action Bar */}
            <Flex
              direction={{ base: "column-reverse", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              gap={3}
              pt={2}
            >
              <Button
                as="a"
                href={`/results/${resultEventSlug || "hacknova"}`}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                w={{ base: "full", sm: "auto" }}
                variant="outline"
                borderColor="rgba(56, 217, 169, 0.4)"
                color="#38D9A9"
                fontSize="xs"
                rounded="md"
                _hover={{ bg: "rgba(56, 217, 169, 0.1)" }}
                textAlign="center"
              >
                View Public URL: /results/{resultEventSlug || "hacknova"} ↗
              </Button>

              <Button
                size="md"
                w={{ base: "full", sm: "auto" }}
                bg="linear-gradient(90deg, #38D9A9 0%, #22D3EE 100%)"
                color="#030512"
                fontFamily="'Inter', sans-serif"
                fontSize="xs"
                fontWeight="extrabold"
                letterSpacing="0.1em"
                textTransform="uppercase"
                rounded="md"
                _hover={{ bg: "linear-gradient(90deg, #22D3EE 0%, #38D9A9 100%)" }}
                onClick={handlePublishResults}
                isLoading={publishingResults}
                loadingText="Publishing..."
                px={6}
              >
                Publish Results
              </Button>
            </Flex>

            {/* Currently Published Results */}
            {publishedResultsList.length > 0 && (
              <Box mt={6} pt={4} borderTop="1px solid rgba(56, 217, 169, 0.2)">
                <Text
                  fontFamily="'Orbitron', sans-serif !important"
                  fontSize="sm"
                  color="#38D9A9"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  mb={3}
                >
                  Published Results Catalog
                </Text>

                <Box
                  overflowX="auto"
                  sx={{
                    "&::-webkit-scrollbar": { height: "5px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(56, 217, 169, 0.4)",
                      borderRadius: "3px",
                    },
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <Table variant="simple" size="sm" minW="450px">
                    <Thead bg="rgba(56, 217, 169, 0.08)">
                      <Tr borderBottom="1px solid rgba(56, 217, 169, 0.3)">
                        <Th color="#38D9A9" fontSize="2xs">Event</Th>
                        <Th color="#38D9A9" fontSize="2xs">Round</Th>
                        <Th color="#38D9A9" fontSize="2xs">Link</Th>
                        <Th color="#38D9A9" fontSize="2xs" textAlign="right">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {publishedResultsList.map((item, idx) => (
                        <Tr key={idx} borderBottom="1px solid rgba(255, 255, 255, 0.06)">
                          <Td color="#FFFFFF" fontWeight="semibold" textTransform="uppercase">
                            {item.event_slug}
                          </Td>
                          <Td color="#CBD5E1">
                            {item.round_name}
                          </Td>
                          <Td>
                            <Button
                              as="a"
                              href={`/results/${item.event_slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="2xs"
                              variant="link"
                              color="#22D3EE"
                            >
                              /results/{item.event_slug} ↗
                            </Button>
                          </Td>
                          <Td textAlign="right">
                            <Button
                              size="xs"
                              variant="outline"
                              borderColor="rgba(239, 68, 68, 0.4)"
                              color="#EF4444"
                              rounded="md"
                              _hover={{ bg: "rgba(239, 68, 68, 0.15)" }}
                              onClick={() => handleUnpublishResults(item.event_slug, item.round_name)}
                              isLoading={unpublishingKey === `${item.event_slug}_${item.round_name}`}
                            >
                              Unpublish
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}
          </VStack>
        </Box>
      </Flex>
    </Layout>
  );
};

export default privateAdminRoute(AdminPage);


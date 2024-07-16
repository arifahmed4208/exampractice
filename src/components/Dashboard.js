import React, { useState, useEffect, useContext } from 'react';
import {
  VStack,
  Select,
  useToast,
  Box,
  Heading,
  Text,
  Container,
  useColorModeValue,
  Progress,
  Button,
  IconButton,
  Spinner,
  Flex,
  Icon,
  useDisclosure,
  Avatar,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { AuthContext } from '../contexts/AuthContext';
import { getQuestions, saveProgress, getProgress, getTotalQuestionsCount } from '../services/firestore';
import Question from './Question';
import { TbLogout } from "react-icons/tb";
import LoadMoreButton from './LoadMoreButton';
import {logout} from '../services/firebase'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState(1);
  const [dataLoaded, setLoaded] = useState(true)
  const [subject, setSubject] = useState('Dermatology');
  const [userProgress, setUserProgress] = useState({});
  const [lastLoadedId, setLastLoadedId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(30);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const containerBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchTotalQuestionCount();
    loadQuestions();
    loadUserProgress();
  }, [difficulty, user, subject]);

  const fetchTotalQuestionCount = async () =>{
    setLoaded(false);
    const totalCount = await getTotalQuestionsCount(difficulty, subject);
    setLoaded(true);
    setTotalQuestions(totalCount);
  }

  const loadQuestions = async (loadMore = false) => {
    setLoaded(false);
    const newQuestions = await getQuestions(difficulty, subject, loadMore ? lastLoadedId : null, 5);
    setLoaded(true);
    if (newQuestions.length === 0 && !loadMore) {
      toast({
        title: 'Questions unavailable',
        description: 'No question in this category',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (newQuestions.length === 0 && loadMore) {
      toast({
        title: 'No more questions',
        description: 'More questions will be added soon',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setQuestions(loadMore ? [...questions, ...newQuestions] : newQuestions);
    if (newQuestions.length > 0) {
      setLastLoadedId(newQuestions[newQuestions.length - 1].id);
    }
  };

  const loadUserProgress = async () => {
    if (user) {
      setLoaded(false);
      const progress = await getProgress(user.uid);
      const progressMap = progress.reduce((acc, item) => {
        acc[item.questionId] = item.selectedOptionId;
        return acc;
      }, {});
      setUserProgress(progressMap);
      setLoaded(true);
    }
  };

  const handleDifficultyChange = (e) =>{
    if(difficulty !== e.target.value){
      setQuestions([]);
    }
    setDifficulty(Number(e.target.value))
    loadUserProgress();
  }

  const handleSubjectChange = (e) =>{
    if(subject !== e.target.value){
      setQuestions([]);
    }
    setSubject(e.target.value)
    loadUserProgress();
  }


  const answeredQuestionsCount = Object.keys(userProgress).length;

  const handleAnswerSubmit = async (questionId, selectedOptionId) => {
    await saveProgress(user.uid, questionId, selectedOptionId);
    setUserProgress(prev => ({ ...prev, [questionId]: selectedOptionId }));
  };

  const handleSignout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/exampractice');
      toast({
        title: `Logged out successfully!`,
        status: 'success',
        variant:'top-accent',
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: `Error logging out. Try again later!`,
        status: 'error',
        variant:'top-accent',
        isClosable: true,
      })
      console.error('Error signing out', error);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      bgImage="url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
      py={8}
    >
      <Container maxW="4xl" bg={containerBg} borderRadius="xl" boxShadow="xl" p={6}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Flex justifyContent={'space-between'}>
              {user?.photoURL && (
                  <Avatar 
                    src={user.photoURL} 
                    size="md" 
                    mr={3}
                    name={user.displayName || 'User'}
                  />
                )}
              <Heading size="xl" mb={2}>NEET PG | Practise</Heading>
              <IconButton
                isRound={true}
                variant='outline'
                colorScheme='pink'
                aria-label='Logout'
                onClick={onOpen}
                icon={<Icon as={TbLogout} />}
              />
            </Flex>
            
            <Flex alignItems="center" justifyContent="center">
              
              <Text fontSize="lg">Hello, {user?.displayName || 'Student'}!</Text>
            </Flex>
           
              <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="md" mb={2}>
              Total Answered: {answeredQuestionsCount}
              </Text>
              <Text fontSize="md" mb={2}>
              Total: {totalQuestions}
              </Text>
              
              </Flex>
              
            <Progress hasStripe value={(answeredQuestionsCount / totalQuestions) * 100} size="sm" colorScheme={answeredQuestionsCount!==totalQuestions ? 'pink' : 'green'} />
          </Box>

          <Flex gap={2}>
          <Select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e)}
            bg={useColorModeValue('white', 'gray.600')}
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
            <option value={4}>Insane</option>
          </Select>

          <Select
            value={subject}
            onChange={(e) => handleSubjectChange(e)}
            bg={useColorModeValue('white', 'gray.600')}
          >
            <option value={'Dermatology'}>Dermatology</option>
            <option value={'Microbiology'}>Microbiology</option>
            <option value={'Medicine'}>Medicine</option>
            <option value={'Paediatrics'}>Paediatrics</option>
            <option value={'Obg'}>Obg</option>
          </Select>
          </Flex>

          {!dataLoaded && (
            <Flex justifyContent={'center'}>
               <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
          />
            </Flex>
           
          )}
          {questions.map((question) => (
            <Question
              key={question.id}
              question={question}
              onSubmit={handleAnswerSubmit}
              selectedOption={userProgress[question.id]}
            />
          ))}

          <Box textAlign="center">
            <LoadMoreButton onClick={() => loadQuestions(true)} />
          </Box>
        </VStack>

        <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Logout?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to logout?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme='pink' ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button ml={3} onClick={handleSignout}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
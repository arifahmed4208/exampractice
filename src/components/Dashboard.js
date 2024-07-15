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
  Image,
  Flex, Avatar
} from '@chakra-ui/react';
import { AuthContext } from '../contexts/AuthContext';
import { getQuestions, saveProgress, getProgress, getTotalQuestionsCount } from '../services/firestore';
import Question from './Question';
import LoadMoreButton from './LoadMoreButton';

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState(1);
  const [userProgress, setUserProgress] = useState({});
  const [lastLoadedId, setLastLoadedId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(30);
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const containerBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchTotalQuestionCount();
    loadQuestions();
    loadUserProgress();
  }, [difficulty, user]);

  const fetchTotalQuestionCount = async () =>{
    const totalCount = await getTotalQuestionsCount(difficulty);
    setTotalQuestions(totalCount);
  }

  const loadQuestions = async (loadMore = false) => {
    const newQuestions = await getQuestions(difficulty, loadMore ? lastLoadedId : null, 2);
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
      const progress = await getProgress(user.uid);
      const progressMap = progress.reduce((acc, item) => {
        acc[item.questionId] = item.selectedOptionId;
        return acc;
      }, {});
      setUserProgress(progressMap);
    }
  };

  const handleDifficultyChange = (e) =>{
    if(difficulty !== e.target.value){
      setQuestions([]);
    }
    setDifficulty(Number(e.target.value))
    // setUserProgress({});
    loadUserProgress();
  }

  const answeredQuestionsCount = Object.keys(userProgress).length;

  const handleAnswerSubmit = async (questionId, selectedOptionId) => {
    await saveProgress(user.uid, questionId, selectedOptionId);
    setUserProgress(prev => ({ ...prev, [questionId]: selectedOptionId }));
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
            <Heading size="xl" mb={2}>NEET PG | Practise</Heading>
            <Flex alignItems="center" justifyContent="center">
              {user?.photoURL && (
                <Avatar 
                  src={user.photoURL} 
                  size="md" 
                  mr={3}
                  name={user.displayName || 'User'}
                />
              )}
              <Text fontSize="lg">Hello, {user?.displayName || 'Student'}!</Text>
            </Flex>
           
              <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="md" mb={2}>
              Answered: {answeredQuestionsCount}
              </Text>
              <Text fontSize="md" mb={2}>
              Total: {totalQuestions}
              </Text>
              
              </Flex>
              
            <Progress value={(answeredQuestionsCount / totalQuestions) * 100} size="sm" colorScheme="green" />
          </Box>

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
      </Container>
    </Box>
  );
};

export default Dashboard;
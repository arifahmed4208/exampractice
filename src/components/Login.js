import React, { useContext } from 'react';
import { Button, VStack,  Box, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { signInWithGoogle } from '../services/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'

const Login = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const buttonColor = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('blue.500', 'blue.200');
  const toast = useToast()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('dashboard');
      toast({
        title: `Logged in successfully!`,
        status: 'success',
        variant:'top-accent',
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: `Error signing in with Google`,
        status: 'error',
        variant:'top-accent',
        isClosable: true,
      })
      console.error('Error signing in with Google', error);
    }
  };

  if (user) {
    navigate('dashboard');
    return null;
  }

  return (
    <Box
      h="100vh"
      w="100%"
      bgImage="url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"
      bgSize="cover"
      bgPosition="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
        opacity={0.9}
      >
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Welcome to MCQ Practice
          </Text>
          <Button
            leftIcon={<Icon as={FaGoogle} />}
            onClick={handleGoogleSignIn}
            bg={buttonBg}
            color={buttonColor}
            size="lg"
            _hover={{ bg: 'blue.600' }}
            _active={{ bg: 'blue.700' }}
          >
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
import React from 'react';
import { Button, useColorModeValue } from '@chakra-ui/react';

const LoadMoreButton = ({ onClick }) => {
  const buttonBg = useColorModeValue('blue.500', 'blue.200');
  const buttonColor = useColorModeValue('white', 'gray.800');

  return (
    <Button
      onClick={onClick}
      bg={buttonBg}
      color={buttonColor}
      _hover={{ bg: 'blue.600' }}
      _active={{ bg: 'blue.700' }}
    >
      Load More Questions
    </Button>
  );
};

export default LoadMoreButton;
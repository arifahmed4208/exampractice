import React, { useState } from 'react';
import { VStack, Text, Radio, RadioGroup, Box, Icon, useColorModeValue } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const Question = ({ question, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    onSubmit(question.id, optionId);
  };

  const getOptionColor = (option) => {
    if (!showFeedback) return 'black';
    if (option.correct) return 'green.500';
    if (option.id === selectedOption && !option.correct) return 'red.500';
    return 'black';
  };

  return (
    <VStack align="start" spacing={4} w="100%" bg={bgColor} p={4} borderRadius="md">
      <Text fontWeight="bold" fontSize="lg">{question.question_name}</Text>
      <Text>{question.question_description}</Text>
      <RadioGroup onChange={handleOptionSelect} value={selectedOption}>
        <VStack align="start" spacing={2} w="100%">
          {question.options.map((option) => (
            <Box key={option.id}>
              <Radio value={option.id} isDisabled={showFeedback}>
                <Text color={getOptionColor(option)}>{option.name}</Text>
              </Radio>
              {showFeedback && option.correct && option.description && (
                <Box ml={6} mt={2}>
                  <Icon as={InfoIcon} mr={2} color="blue.500" />
                  <Text as="span" fontSize="sm" color="gray.600">{option.description}</Text>
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  );
};

export default Question;
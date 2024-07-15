import React, { useState, useEffect } from 'react';
import { VStack, Text, Radio, RadioGroup, Box, Icon, useColorModeValue, Tooltip, Flex  } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const Question = ({ question, onSubmit,selectedOption: initialSelectedOption  }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    setSelectedOption(initialSelectedOption);
    setShowFeedback(!!initialSelectedOption);
  }, [initialSelectedOption]);

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
      {question.question_description && (
        <Text>{question.question_description}</Text>
      )}
      <RadioGroup onChange={handleOptionSelect} value={selectedOption}>
        <VStack align="start" spacing={2} w="100%">
          {question.options.map((option) => (
            <Box key={option.id}>
              <Radio value={option.id} isDisabled={showFeedback}>
                <Flex gap={2} alignItems={'center'}>
                  <Text color={getOptionColor(option)}>{option.name}
                  </Text>
                  {showFeedback && !option.correct && option.description&&(
                      <Tooltip label={option.description} fontSize='md'>
                      <InfoIcon />
                    </Tooltip>
                    )}
                </Flex>
                
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
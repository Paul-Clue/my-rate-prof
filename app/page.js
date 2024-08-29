'use client';
import Image from 'next/image';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm the rate my Professor support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    setMessage('');
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };
  return (
    <>
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        backgroundColor='black'
      >
        <Box
          sx={{
            my: 5,
          }}
        >
          <Typography
            sx={{
              color: 'whitesmoke',
              fontSize: '2em',
              fontWeight: 'bold',
            }}
          >
            Find the right professor and class for you!
          </Typography>
        </Box>
        <Box
           sx={{
            position: 'absolute',
            left: '10%',
            top: '50%',
          }}
        >
          <Image
            src='/pi.png'
            alt='A group of multiracial college professors'
            width={200}
            height={200}
          />
        </Box>
        <Box
           sx={{
            position: 'absolute',
            left: '10%',
            top: '10%',
          }}
        >
          <Image
            src='/globe.png'
            alt='A group of multiracial college professors'
            width={200}
            height={200}
          />
        </Box>
        <Box
           sx={{
            position: 'absolute',
            left: '20%',
            top: '20%',
          }}
        >
          <Image
            src='/books.png'
            alt='A group of multiracial college professors'
            width={200}
            height={200}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: '67%',
            top: '20%',
          }}
        >
          <Image
            src='/professors.png'
            alt='A group of multiracial college professors'
            width={300}
            height={300}
          />
        </Box>
        <Stack
          direction={'column'}
          width='500px'
          height='700px'
          border='5px solid silver'
          p={2}
          spacing={3}
          borderRadius={8}
          mb={5}
          sx={{
            backgroundColor: 'whitesmoke',
          }}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow='auto'
            maxHeight='100%'
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display='flex'
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color='white'
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label='Message'
              fullWidth
              value={message}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgb(156, 39, 176)', 
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgb(156, 39, 176)',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgb(156, 39, 176)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'blue', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(156, 39, 176)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'whitesmoke',
                },
              }}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant='contained' onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

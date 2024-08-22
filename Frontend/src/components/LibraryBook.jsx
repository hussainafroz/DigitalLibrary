import React from 'react'

import {
    Center,
    Text,
    Heading,
    VStack,
    Button,
    Image,
    useToast,
} from "@chakra-ui/react";
import ReactStars from "react-rating-stars-component";
export default function LibraryBook({book,refreshData}) {
  return (
     <VStack maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" spacing={8} key={book.id} padding={4}>
        <Image src={book.thumbnail} width={40} height={60}/>
        <Center>
            <Heading size="sm">{book.title}</Heading>
        </Center>
        {
            book.state == 0 && !book.rating && (
                <Text fontSize="sm">Rate Book?</Text>
            )
        }

        {
            book.state === 0 && (
                <ReactStars
                    count={5}
                    onChange={(new_rating) => ratingChanged(new_rating,book)}
                    size={24}
                    activeColor="#ffd700"
                    value={book.rating}
                />
            )
        }

        {
            book.state === 1 && (
                <Button variant="outline" colorScheme="red" size="sm" onClick={() => null}>
                    Completed? 
                </Button>
            )
        }

        {
            book.state === 2 && (
                <Button variant="outline" colorScheme="red" size="sm">
                    Purchased Book?
                </Button>
            )
        }
        
     </VStack>
  )
}

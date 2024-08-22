import React from 'react'
import {
Center,Text,Heading,VStack,HStack,Button,Input,SimpleGrid,
Image,Badge,useToast
}
from "@chakra-ui/react"

import { AddIcon } from '@chakra-ui/icons'

import {useState,useEffect} from "react"

const API_KEY = "AIzaSyALyJhNcVW5f3UASEc6qJeIMS4EeUWAKWs"
export default function Discover({refreshData}) {
  const [searchQuery,setsearchQuery] = useState("");
  const [searchResult,setsearchResult] = useState([])

  const bookAddToast = useToast()
  // https://www.googleapis.com/books/v1/volumes?q=harry+potter&callback=handleResponse"
  const onSearchClick = () => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${API_KEY}&maxResults=30`)
    .then(response => response.json())
    .then((data) => setsearchResult(data["items"]))
  }


  //**BACKEND**// */
  //CONNECTING TO THE POST METHOD IN BACKEND CODEBASE
  const addBook = (book) => {
    const body = JSON.stringify(
      {
        volume_id:book.id,
        title:book.volumeInfo.title,
        authors:book.volumeInfo.authors?.join(", "),
        thumbnail:book.volumeInfo.imageLinks?.thumbnail,
        state:2, 
        rating:0,
      }
    );

    // NOTE:- FASTAPI ACCEPTS ONLY HTTP NOT HTTPS (i.e https:// will give error) so use http:// instead.
    fetch("http://127.0.0.1:8000/books",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json",},
        body:body
    })
    .then(response=>response.json())
    .then(data => {
      refreshData()
      bookAddToast({
        title:"Added",
        description:"Book added to wishList",
        status: "success",
        duration: 3000,
        isClosable:true,
      })
    })
  }

  //**END**// */

  return(
    <VStack spacing={7} padding={5}>
      <Heading size="lg">Search Books</Heading>
      <Text>Find new books to add to your library</Text>
      <HStack spacing={12}>
        <Input width="600px" value = {searchQuery} onChange={(e) => setsearchQuery(e.target.value)}></Input>
        <Button colorScheme="red" size="lg" onClick={onSearchClick}>
          Search Book
        </Button>
      </HStack>
      {
        searchResult.length === 0 && (
          <Center>
            <Heading>You gotta search to see results</Heading>
          </Center>
        )
      }

      <SimpleGrid columns = {4} spacing = {8}>
         {
          searchResult.length !== 0 && searchResult.map((book) => {
            return(
              <VStack maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" spacing={8} key={book.id}>
                <Image src={book.volumeInfo.imageLinks?.thumbnail} width={40} height={60} paddingTop={2}/>
                <Badge borderRadius="full" px="2" colorScheme="teal">
                  {book.volumeInfo.categories?.join(", ")}
                </Badge>
                 <VStack>
                  <Badge colorScheme="red">
                      Google Rating:{" "}
                      {book.volumeInfo.averageRating  ? book.volumeInfo.averageRating: "N/A"}
                  </Badge>
                  <Text textAlign="center">
                    Author:{book.volumeInfo.authors?.join(", ")}
                  </Text>
                 </VStack>
                 <VStack>
                    <Heading size="md">{book.volumeInfo.title}</Heading>
                    <Text padding={3} color="gray">
                      {book.searchInfo?.textSnippet ? book.searchInfo.textSnippet : book.volumeInfo.subtitle}
                    </Text>
                    <Center paddingBottom={2}>
                      <Button variant="outline" onClick={()=> addBook(book)}>
                        <HStack>
                          <AddIcon w={4} h={4} color="red.500"/>
                          <Text>Add Book</Text>
                        </HStack>
                      </Button>
                    </Center>
                 </VStack>
              </VStack>

            )
          })
         }
      </SimpleGrid>
    </VStack>

  )
}

import React from 'react'
import { Text, Heading, VStack, SimpleGrid } from "@chakra-ui/react";
import LibraryBook from './LibraryBook';

// here allBooks is the collection of books from the database

export default function Library({ allBooks, refreshData }) {
  return (
    <VStack spacing={7}>
      <Text>
        This is your digital library! Add new books here and
        browse them and even review them!
      </Text>

      <Heading size="md">Completed</Heading>
      <SimpleGrid columns={6} spacing={8}>
        {allBooks.length !== 0 && allBooks.map((book) => {
          if (book.state === 0) {
            return <Text key={book.id}>{book.title}</Text>;
          } else {
            return null;
          }
        })}
      </SimpleGrid>

      <Heading size="md">Unfinished</Heading>
      <SimpleGrid columns={6} spacing={8}>
        {allBooks.length !== 0 && allBooks.map((book) => {
          if (book.state === 1) {
            return <Text key={book.id}>{book.title}</Text>;
          } else {
            return null;
          }
        })}
      </SimpleGrid>

      <Heading size="md">Wishlist</Heading>
      <SimpleGrid columns={6} spacing={8}>
        {allBooks.length !== 0 && allBooks.map((book) => {
          if (book.state === 2) {
            // return <Text key={book.id}>{book.title}</Text>;
            return <LibraryBook book={book} refreshData={refreshData}></LibraryBook>
          } else {
            return null;
          }
        })}
      </SimpleGrid>
    </VStack>
  )
}

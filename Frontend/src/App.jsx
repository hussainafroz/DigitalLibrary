import { useEffect, useState } from 'react'
import './App.css'
import {
  Center,
  Heading,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  ChakraProvider,
}
from "@chakra-ui/react"
import Discover from './components/Discover';
import Library from './components/Library';
function App() {
  const [AllBooks,setAllBooks] = useState([])
  const [RefreshData,setRefreshData] = useState(false);

  const toggle = ()=>{
    setRefreshData(!RefreshData)
  }

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/books')
    //converting response to json
    .then(response => response.json())
    // setting our data to varaibel ALLbooks 
    .then((data)=>setAllBooks(data))
  },[RefreshData])


  // console.log(AllBooks)

  return (
     <ChakraProvider>
      <Center bg="black" color="white" padding={8}>
        <VStack spacing={7}>
          <Tabs variant="soft-rounded" colorScheme="red">
            <Center>
              <TabList>
                <Tab>
                  <Heading>Discover</Heading>
                </Tab>
                <Tab>
                  <Heading>Library</Heading>
                </Tab>
              </TabList>
            </Center>
            <TabPanels>
              <TabPanel>
                {/* <p>Hello discover content</p> */}
                <Discover refreshData = {toggle}/>
              </TabPanel>
              <TabPanel>
                {/* <p>Hello library content</p> */}
                <Library allBooks={AllBooks} refreshData={toggle}/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Center>
     </ChakraProvider>
  )
}

export default App

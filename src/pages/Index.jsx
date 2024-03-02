import React, { useState } from "react";
import { Box, Container, Heading, VStack, HStack, Text, Table, Thead, Tbody, Tr, Th, Td, IconButton, Input, Select, useToast } from "@chakra-ui/react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

import { useMemo } from "react";

const Index = () => {
  const toast = useToast();

  const [inventory, setInventory] = useState({ "Room 101": [], "Room 102": [], Lobby: [], Restaurant: [], Gym: [], Pool: [], Spa: [], "Conference Room": [], "Executive Suite": [] });
  const [newItem, setNewItem] = useState({ name: "", location: "", quantity: 0 });

  // Function to get the count of a specific item in the selected location.
  const getItemCountInLocation = (itemName, location) => {
    if (!inventory[location]) return 0;
    const item = inventory[location].find((item) => item.name === itemName);
    return item ? item.quantity : 0;
  };

  const handleAddItem = () => {
    const { name, location, quantity } = newItem;
    if (!newItem.name || !newItem.location || newItem.quantity <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values before adding an item.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update the inventory data structure to include the new item.
    setInventory((prevInventory) => {
      const locationInventory = prevInventory[location] || [];
      const itemIndex = locationInventory.findIndex((item) => item.name === name);
      let updatedLocationInventory;

      if (itemIndex > -1) {
        updatedLocationInventory = [...locationInventory];
        updatedLocationInventory[itemIndex].quantity += quantity;
      } else {
        updatedLocationInventory = [...locationInventory, { name, quantity }];
      }

      return { ...prevInventory, [location]: updatedLocationInventory };
    });
    setNewItem({ name: "", location: "", quantity: 0 });
  };

  const updateQuantity = (location, itemName, delta) => {
    setInventory((prevInventory) => {
      const locationInventory = [...prevInventory[location]];
      const itemIndex = locationInventory.findIndex((item) => item.name === itemName);
      if (itemIndex > -1) {
        locationInventory[itemIndex].quantity += delta;
      }
      return { ...prevInventory, [location]: locationInventory };
    });
  };

  const removeItem = (location, itemName) => {
    setInventory((prevInventory) => {
      const locationInventory = prevInventory[location].filter((item) => item.name !== itemName);
      return { ...prevInventory, [location]: locationInventory };
    });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6}>
        <Heading>Hotel Supplies Inventory Tracker</Heading>
        <Box w="100%">
          <HStack mb={4}>
            <Input placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <Select placeholder="Select location" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}>
              <option value="Room 101">Room 101</option>
              <option value="Room 102">Room 102</option>
              <option value="Lobby">Lobby</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Gym">Gym</option>
              <option value="Pool">Pool</option>
              <option value="Spa">Spa</option>
              <option value="Conference Room">Conference Room</option>
              <option value="Executive Suite">Executive Suite</option>
            </Select>
            <Input placeholder="Quantity" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} />
            <IconButton icon={<FaPlus />} onClick={handleAddItem} colorScheme="green" aria-label="Add item" />
          </HStack>
          <Table>
            <Thead>
              <Tr>
                <Th>Item Name</Th>
                <Th>Location</Th>
                <Th>Quantity</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(inventory).map(([location, items]) =>
                items.map((item, index) => (
                  <Tr key={`${location}-${index}`}>
                    <Td>{item.name}</Td>
                    <Td>{location}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton icon={<FaMinus />} onClick={() => updateQuantity(location, item.name, -1)} isDisabled={item.quantity <= 0} colorScheme="orange" aria-label="Decrease quantity" />
                        <IconButton icon={<FaPlus />} onClick={() => updateQuantity(location, item.name, 1)} colorScheme="green" aria-label="Increase quantity" />
                        <IconButton icon={<FaTrash />} onClick={() => removeItem(location, item.name)} colorScheme="red" aria-label="Remove item" />
                      </HStack>
                    </Td>
                  </Tr>
                )),
              )}
              {inventory.length === 0 && (
                <Tr>
                  <Td colSpan="4">
                    <Text textAlign="center" mt={4}>
                      No items in inventory.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;

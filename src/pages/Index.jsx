import React, { useState } from "react";
import { Box, Container, Heading, VStack, HStack, Text, Table, Thead, Tbody, Tr, Th, Td, IconButton, Input, useToast } from "@chakra-ui/react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

import { useMemo } from "react";

const Index = () => {
  const toast = useToast();

  const [inventory, setInventory] = useState({});
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

  const updateQuantity = (index, delta) => {
    const newInventory = [...inventory];
    newInventory[index].quantity += delta;
    setInventory(newInventory);
  };

  const removeItem = (index) => {
    const newInventory = [...inventory];
    newInventory.splice(index, 1);
    setInventory(newInventory);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6}>
        <Heading>Hotel Supplies Inventory Tracker</Heading>
        <Box w="100%">
          <HStack mb={4}>
            <Input placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <Input placeholder="Location" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} />
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
              {inventory.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.name}</Td>
                  <Td>{item.location}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton icon={<FaMinus />} onClick={() => updateQuantity(index, -1)} isDisabled={item.quantity <= 0} colorScheme="orange" aria-label="Decrease quantity" />
                      <IconButton icon={<FaPlus />} onClick={() => updateQuantity(index, 1)} colorScheme="green" aria-label="Increase quantity" />
                      <IconButton icon={<FaTrash />} onClick={() => removeItem(index)} colorScheme="red" aria-label="Remove item" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
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

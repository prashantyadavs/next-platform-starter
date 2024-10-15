"use client"
/* eslint-disable */

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spacer, useDisclosure, DatePicker, Switch, Card, CardHeader, CardBody, Image, CardFooter, Textarea,  Autocomplete, 
  AutocompleteItem, 
  Avatar  } from "@nextui-org/react"; 
import React, { useState,useEffect } from "react";
import Up from './Up';
import Down from './Down';
import './Tradebook.css';
import {now, getLocalTimeZone} from "@internationalized/date";
import { useStockSymbols } from './useStockSymbol'; // Adjust the path as needed

export default function AddTradeModal({ fetchEventData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal state management
  const list = useStockSymbols(); // Use the custom hook for stock symbols
  const [isOpen2, setIsOpen] = React.useState(false);

  const [notes, setNotes] = useState(''); // State to manage notes
  const [image, setImage] = useState(null); // State to manage selected image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const fileInputRef = React.createRef();
// Inside your component
const [userEmail, setUserEmail] = useState('userEmail');

useEffect(() => {
  const email = localStorage.getItem('userEmail');
  if (email) {
    setUserEmail(email);
  }
}, []);
// Function to handle image selection
const handleImageSelect = () => {
  fileInputRef.current.click(); // Trigger the hidden file input click
};

// Handle file selection
const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    if (selectedFile) {
      setImage(selectedFile); // Update the image state
      setImagePreview(URL.createObjectURL(selectedFile)); // Create and set image preview URL
    }
  };
  
  // Form data state
  const [tradeData, setTradeData] = useState({
    symbol: '',
    quantity: '',
    entryPrice: '',
    exitPrice: '',
    risk: '',
    entryDate: null,
  });
  const [errors, setErrors] = useState({
    symbol: '',
    quantity: '',
    entryPrice: '',
    exitPrice: '',
    risk: '',
    entryDate: '',
  });
  
  // State for determining if the trade is long or short
  const [isLongTrade, setIsLongTrade] = useState(true); // Default to true for "Buy"

  // Function to handle input change
  const handleChange = (e) => {
    setTradeData({
      ...tradeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (dateObj) => {
    if (dateObj && dateObj.year && dateObj.month && dateObj.day) {
      const { year, month, day, hour, minute } = dateObj;
  
      // Construct a new Date object
      const formattedDate = new Date(year, month - 1, day, hour, minute); // Include time
  
      // Log to confirm the converted date
      // console.log('Formatted Date:', formattedDate);
  
      setTradeData({
        ...tradeData,
        entryDate: formattedDate, // Store as a JS Date object
      });
    } else {
      console.error("Invalid date object:", dateObj);
      setTradeData({
        ...tradeData,
        entryDate: null, // Ensure this is set to null if invalid
      });
    }
  };
  
  const handleAddTrade = async () => {
    // Log to confirm the function is triggered
    // console.log("handleAddTrade triggered");
  
    if (!userEmail) {
      console.error("User email is not set.");
      return;
    }
  
    // Reset errors
    setErrors({});
  
    // Validation checks
    let valid = true;
    const newErrors = {};
    if (!tradeData.symbol) {
      newErrors.symbol = 'Symbol is required.';
      valid = false;
    }
    if (!tradeData.quantity) {
      newErrors.quantity = 'Quantity is required.';
      valid = false;
    }
    if (!tradeData.entryPrice) {
      newErrors.entryPrice = 'Entry Price is required.';
      valid = false;
    }
    if (!tradeData.exitPrice) {
      newErrors.exitPrice = 'Exit Price is required.';
      valid = false;
    }
    if (!tradeData.risk) {
      newErrors.risk = 'Risk is required.';
      valid = false;
    }
    if (!tradeData.entryDate) {
      newErrors.entryDate = 'Entry Date is required.';
      valid = false;
    }
    
    setErrors(newErrors);
  
    // Early exit if any field is invalid
    if (!valid) return;
  
    try {
      const formattedDate = tradeData.entryDate instanceof Date && !isNaN(tradeData.entryDate)
        ? tradeData.entryDate.toISOString()
        : null;
  
      // Check if entryDate is null and handle accordingly
      if (!formattedDate) {
        console.error("Entry date is invalid or not set.");
        return;
      }
  
      const tradePayload = new FormData();
      tradePayload.append('symbol', tradeData.symbol);
      tradePayload.append('quantity', tradeData.quantity);
      tradePayload.append('entryPrice', tradeData.entryPrice);
      tradePayload.append('exitPrice', tradeData.exitPrice);
      tradePayload.append('risk', tradeData.risk);
      tradePayload.append('entryDate', formattedDate);
      tradePayload.append('isLongTrade', isLongTrade);
      tradePayload.append('notes', notes);
      tradePayload.append('userEmail', userEmail);
      if (image) {
        tradePayload.append('image', image);
      }
  
      // console.log('Sending payload:', Array.from(tradePayload.entries())); // Log payload entries
  
      const response = await fetch('https://main.tradifyapi.in/trades', {
        method: 'POST',
        body: tradePayload,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      // console.log('Trade added successfully:', data);
  
      // Check for errors in the response
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        // Reset state after successful addition
        onOpenChange(false);
        setTradeData({
          symbol: '',
          quantity: '',
          entryPrice: '',
          exitPrice: '',
          risk: '',
          entryDate: null,
        });
        setNotes('');
        setImage(null);
        fetchEventData();
      }
      
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };
  
  // Handle selection change from Autocomplete
  const handleSelectionChange = (selected) => {
    // Assuming selected has a property 'symbol' that you want to capture
    if (selected) {
      setTradeData((prev) => ({
        ...prev,
        symbol: selected,
      }));
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button
        className="text-tiny text-white bg-transparent border-none"
        variant="flat"
        color="default"
        radius="lg"
        size="sm"
        onPress={onOpen}
      >
        Add
      </Button>

      {/* Modal for adding a trade */}
      <Modal isOpen={isOpen} size="lg" onOpenChange={onOpenChange} backdrop="blur" color="primary">
        <ModalContent>
          {(onClose) => (
            <>
              <div className="flex justify-between items-center">
                <ModalHeader className="text-white">Add New Trade</ModalHeader>
                <div className="flex flex-col items-center">
                  <Switch
                    isSelected={isLongTrade} // Use isSelected for controlled state
                    onValueChange={setIsLongTrade} // Handle state change
                    size="md"
                    color={isLongTrade ? "success" : "error"} // Change color based on state
                    startContent={<Up />}
                    endContent={<Down />}
                    className="mb-1" // 1px margin for spacing
                  />
                  {/* Buy/Sell Label aligned under Switch */}
                  <span className="switchtext">
                    {isLongTrade ? "Buy" : "Sell"} {/* Displays "Sell" when checked, "Buy" otherwise */}
                  </span>
                </div>
              </div>

              <ModalBody>
              <Autocomplete
        label="Select Stock Symbol"
        isLoading={list.isLoading}
        onOpenChange={setIsOpen}
        selectionMode="single"
        onInputChange={list.setFilterText} // Set filter text based on input change
        endContent={
          <Avatar
            className="text-xl"
            src={tradeData.symbol ? "./logo-.png" : "./logo-.png"} // Use a different src based on selection
            isBordered={true}
            size="sm"
            color="default"
            radius="sm"
          />
        }
        onSelectionChange={handleSelectionChange} // Handle selection change
      >
        {list.items.map(({ symbol, name, email, avatar }) => (
          <AutocompleteItem key={symbol} textValue={symbol}>
            <div className="flex gap-2 items-center">
              <Avatar alt={name} className="flex-shrink-0" size="sm" src={avatar} />
              <div className="flex flex-col">
                <span className="text-small text-white">{symbol}</span>
                <span className="text-tiny text-default-400">{name}</span>
              </div>
            </div>
          </AutocompleteItem>
        ))}
        {list.items.length === 0 && !list.isLoading && (
          <AutocompleteItem disabled>No results found</AutocompleteItem>
        )}
      </Autocomplete>
                <Spacer y={1} />

                {/* Flex container for Quantity, Entry Price, and Exit Price */}
                <div className="flex gap-2">
                <Input
  label="Quantity"
  name="quantity"
  value={tradeData.quantity}
  onChange={handleChange}
  type="number"
  min={0} // Prevent negative values

  fullWidth
  isInvalid={!!errors.quantity}
  errorMessage={errors.quantity} // Display error message
/>
<Input
  label="Entry Price"
  name="entryPrice"
  value={tradeData.entryPrice}
  onChange={handleChange}
  type="number"
  fullWidth
  min={0} // Prevent negative values

  isInvalid={!!errors.entryPrice}
  errorMessage={errors.entryPrice} // Display error message
/>
<Input
  label="Exit Price"
  name="exitPrice"
  value={tradeData.exitPrice}
  onChange={handleChange}
  type="number"
  fullWidth
  min={0} // Prevent negative values

  isInvalid={!!errors.exitPrice}
  errorMessage={errors.exitPrice} // Display error message
/>

                </div>

                <Spacer y={1} />

                {/* Flex container for Risk and Entry Date */}
                <div className="flex gap-2">
                <Input
  label="Risk on the trade (₹)"
  name="risk"
  value={tradeData.risk}
  onChange={handleChange}
  type="number"
  fullWidth
  min={0} // Prevent negative values

  endContent={
    <div className="pointer-events-none flex items-center">
      <span className="text-default-400 text-small">$</span>
    </div>
  }
  isInvalid={!!errors.risk}
  errorMessage={errors.risk} // Display error message
/>
<DatePicker 
  fullWidth 
  defaultValue={now(getLocalTimeZone())}
  hideTimeZone
  label="Entry Date" 
  placeholder="Select Entry Date" 
  onChange={handleDateChange} 
  clearable // Allow clearing the date selection
  isInvalid={!!errors.entryDate}
  errorMessage={errors.entryDate} // Display error message
  
/>

                </div>

                <Spacer y={1} />

                {/* Flex container for cards */}
                <div className="flex gap-4">
                  {/* Card 1 */}
                  <Card isFooterBlurred radius="lg" className="border-none relative">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <h4 className="font-bold text-medium mt-1">Add Trade Chart</h4>
                      <small className="text-default-500">Visualisation</small>
                    </CardHeader>
                    <CardBody className="overflow-visible relative">
                    <Image
  alt="Selected trade chart"
  className="object-cover"
  height={200}
  src={imagePreview || "tradechart4.png"} // Use imagePreview if available, otherwise use the default
  width={200}
/>

                      <CardFooter className="absolute bottom-0 left-1/2 transform -translate-x-1/2 justify-between before:bg-white/10 border-white/20 border-0 overflow-hidden py-1 w-[calc(100%_-_8px)] shadow-small z-10">
                        <p className="text-tiny text-white/80">Upload Image</p>
                        <Button
  className="text-tiny text-white bg-black/20"
  variant="flat"
  color="default"
  radius="lg"
  size="sm"
  onPress={handleImageSelect} // Handle image selection
>
  Click me
</Button>
<input
  type="file"
  ref={fileInputRef} // Set ref for the hidden file input
  style={{ display: 'none' }} // Hide the file input
  onChange={handleFileChange} // Handle file selection
  accept="image/*" // Accept only images
/>


                      </CardFooter>
                    </CardBody>
                  </Card>

                  {/* Card 2 */}
                  <Card style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <h4 className="font-bold text-medium mt-1">Note to Remember</h4>
                      <small className="text-default-500">Important</small>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 flex-grow">
                    <Textarea
  className="mt-2 w-full h-full p-2 rounded-lg"
  placeholder="Write Important note..."
  css={{ height: '100%', minHeight: '200px' }}
  variant="underlined"
  description="Concise Note you want to remember from this Trade"
  value={notes} // Bind the value to notes state
  onChange={(e) => setNotes(e.target.value)} // Handle changes
/>

                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddTrade}>
                  Add Trade
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

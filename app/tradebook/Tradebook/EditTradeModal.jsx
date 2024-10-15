"use client"
/* eslint-disable */

import React, { useState, useRef } from 'react';
import { Modal, DatePicker, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Spacer, Card, CardHeader, CardBody, CardFooter, Image, Textarea, Switch } from "@nextui-org/react";
import { now, getLocalTimeZone,parseDate } from '@internationalized/date';
import axios from 'axios';
import Up from './Up';
import Down from './Down';
const EditTradeModal = ({ isOpen, onClose, selectedTrade, handleUpdateTrade }) => {
  if (!selectedTrade) {
    // Handle case where selectedTrade is not available
    return null; // Or display a loading message if necessary
  }

  const [tradeData, setTradeData] = useState(selectedTrade);
  const [isLongTrade, setIsLongTrade] = useState(selectedTrade.isLongTrade);
  const [notes, setNotes] = useState(selectedTrade.notes || '');
  const [imagePreview, setImagePreview] = useState(selectedTrade.image ? `https://main.tradifyapi.in/${selectedTrade.image.replace(/\\/g, '/')}` : '');

   console.log(selectedTrade)
  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Get only the date part
  };

  // Get the entry date string in YYYY-MM-DD format
  const entryDate = selectedTrade.entryDate 
    ? formatDate(selectedTrade.entryDate) 
    : formatDate(new Date());



  const fileInputRef = useRef(null);
  // console.log(entryDate)
// console.log( now(getLocalTimeZone()))
  const handleChange = (e) => {
    setTradeData({
      ...tradeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = () => {
    fileInputRef.current.click();
  };
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = formatDate(date); // Format the date to YYYY-MM-DD
      setTradeData({ ...tradeData, entryDate: formattedDate }); // Update the entryDate in tradeData
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    
    // Append all the trade data
    formData.append('symbol', tradeData.symbol);
    formData.append('quantity', tradeData.quantity);
    formData.append('entryPrice', tradeData.entryPrice);
    formData.append('exitPrice', tradeData.exitPrice);
    formData.append('risk', tradeData.risk);
    formData.append('entryDate', tradeData.entryDate); // Use entryDate from tradeData
    formData.append('isLongTrade', isLongTrade);
    formData.append('notes', notes);
    formData.append('userEmail', tradeData.userEmail);
    
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }

    try {
      const response = await axios.put(`https://main.tradifyapi.in/trades/${tradeData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      handleUpdateTrade(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" onOpenChange={onClose} backdrop="blur" color="primary">
      <ModalContent>
        {(onClose) => (
          <>
            <div className="flex justify-between items-center">
              <ModalHeader className="text-white">{`Edit Trade - ${tradeData.symbol}`}</ModalHeader>
              <div className="flex flex-col items-center">
                <Switch
                  isSelected={isLongTrade}
                  onValueChange={setIsLongTrade}
                  size="md"
                  color={isLongTrade ? 'success' : 'error'}
                  startContent={<Up />}
                  endContent={<Down />}
                  className="mb-1"
                />
                <span className="switchtext">{isLongTrade ? 'Buy' : 'Sell'}</span>
              </div>
            </div>

            <ModalBody>
              <Input
                fullWidth
                label="Symbol"
                placeholder="Enter Stock Symbol"
                name="symbol"
                value={tradeData.symbol}
                disabled
                onChange={handleChange}
              />
              <Spacer y={1} />

              <div className="flex gap-2">
                <Input
                  label="Quantity"
                  name="quantity"
                  value={tradeData.quantity}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  min={0}
                />
                <Input
                  label="Entry Price"
                  name="entryPrice"
                  value={tradeData.entryPrice}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  min={0}
                />
                <Input
                  label="Exit Price"
                  name="exitPrice"
                  value={tradeData.exitPrice}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  min={0}
                />
              </div>

              <Spacer y={1} />

              <div className="flex gap-2">
                <Input
                  label="Risk on the trade (₹)"
                  name="risk"
                  value={tradeData.risk}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  min={0}
                />
              <DatePicker
                  fullWidth
                  defaultValue={parseDate(entryDate || new Date().toISOString())} // Use parseDate function
                  hideTimeZone
                  label="Entry Date"
                  placeholder="Select Entry Date"
                  onChange={handleDateChange} // Call handleDateChange to update tradeData
                  clearable
                />
              </div>

              <Spacer y={1} />

              <div className="flex gap-4">
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
  src={imagePreview|| "tradechart4.png"}
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
                        onPress={handleImageSelect}
                      >
                        Click me
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </CardFooter>
                  </CardBody>
                </Card>

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
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </CardBody>
                </Card>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Update Trade
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditTradeModal;

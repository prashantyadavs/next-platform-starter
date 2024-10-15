"use client"
/* eslint-disable */

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  User,
  TableCell,
  Chip,
  Tooltip,
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
  Image,
  Avatar
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import EditTradeModal from './EditTradeModal'; // The modal component created above

export default function TradeDetailsModal({ selectedDate,trade, }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [trades, setTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null); // State to track the selected trade
  const [selectedTrade2, setSelectedTrade2] = useState(null); // State to track the selected trade

  const { isOpen: isZoomed, onOpen: openZoomModal, onOpenChange: closeZoomModal } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleUpdateTrade = (updatedTrade) => {
    // Logic to update the trade, e.g., update local state or refresh data
    console.log("Trade updated:", updatedTrade);
    // If you had a trades state array, you could find and replace the trade here
  };
    // Handle closing the modal and resetting the selected trade
    const handleModalClose = () => {
      onOpenChange(false); // Close the modal
      setSelectedTrade(null); // Reset selected trade
    };
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
  const handleDelete = async (tradeId) => {
    try {
      const response = await fetch(`https://main.tradifyapi.in/trades/${tradeId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete trade');
      }
  
      // Remove the deleted trade from the trades array
      setTrades((prevTrades) => prevTrades.filter((trade) => trade._id !== tradeId));
  
      // Optionally show a success message (like a toast)
      console.log('Trade deleted successfully');
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };
  

  useEffect(() => {
    if (isOpen && selectedDate) {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1); // Add one day to the selected date
      fetchTradesForDate(nextDate); // Fetch trades for the new date
    }
  }, [isOpen, selectedDate]);

  const fetchTradesForDate = async (date) => {
    try {
      const userEmail = localStorage.getItem('userEmail'); // Get the user email from local storage
  
      // Ensure userEmail is not null or undefined
      if (!userEmail) {
        throw new Error('User email not found in local storage');
      }
  
      // Fetch trades for the specific date and user email
      const response = await fetch(`https://main.tradifyapi.in/trades/date/${date.toISOString().split('T')[0]}/${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trades');
      }
  
      const tradesData = await response.json();
      setTrades(tradesData);
    } catch (error) {
      console.error('Error fetching trades:', error);
      setTrades([]); // Set trades to an empty array on error
    }
  };

  // Map for status colors
  const statusColorMap = {
    buy: "success", // Color for Buy
    sell: "danger",  // Color for Sell
    profit: "success", // Color for Profit
    loss: "danger",    // Color for Loss
  };
// Check if selectedTrade is not null before accessing its properties
let totalProfit = 0;
let totalCapitalInvested = 0;
let roi = 0;

if (selectedTrade) {
  totalProfit = selectedTrade.isLongTrade
    ? (selectedTrade.exitPrice - selectedTrade.entryPrice) * selectedTrade.quantity
    : (selectedTrade.entryPrice - selectedTrade.exitPrice) * selectedTrade.quantity;

  totalCapitalInvested = selectedTrade.entryPrice * selectedTrade.quantity;

  if (totalCapitalInvested !== 0) { // Prevent division by zero
    roi = (totalProfit / totalCapitalInvested) * 100;
  }
}
const formatRatio = (ratio) => {
  return ratio % 1 === 0 ? ratio.toFixed(0) : ratio.toFixed(1);
};

  return (
    <>
      <Button
        className="text-tiny text-white bg-black/20"
        variant="flat"
        color="default"
        radius="lg"
        size="sm"
        onPress={onOpen}
      >
        More
      </Button>
      <Modal 
        classNames={{
          body: "py-6",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
          
        }}
        backdrop="blur"
        size="3xl"
        className="dark "
        isOpen={isOpen}
        onOpenChange={(isModalOpen) => {
          onOpenChange(isModalOpen); // Update modal open state
          if (!isModalOpen) {
            setSelectedTrade(null);   // Reset selected trade when closing modal
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                {selectedTrade
                  ? `Trade Details for ${selectedTrade.symbol}`
                  : `Trades Placed on ${selectedDate?.toDateString()}`}
              </ModalHeader>
              <ModalBody className="text-white">
                {/* Conditionally render the table or trade details */}
                {!selectedTrade ? (
                  trades && trades.length > 0 ? (
                    <Table aria-label="Trade Details">
                      <TableHeader>
                        <TableColumn>Symbol</TableColumn>
                        <TableColumn>Trade Type</TableColumn>
                        <TableColumn>Profit & Loss</TableColumn>
                        <TableColumn>Actions</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {trades.map((trade) => {
                          const avatarSrc = `https://images.5paisa.com/MarketIcons/${
                            trade.symbol.includes("NIFTY")
                              ? "NIFTY50"
                              : trade.symbol.replace("-", "&")
                          }.png`;

                          const totalProfit = trade.isLongTrade
                            ? (trade.exitPrice - trade.entryPrice) * trade.quantity
                            : (trade.entryPrice - trade.exitPrice) * trade.quantity;

                          const chipColor =
                            totalProfit >= 0 ? statusColorMap.profit : statusColorMap.loss;
                          const chipLabel =
                            totalProfit >= 0
                              ? `+ ₹${totalProfit.toFixed(2)}`
                              : `- ₹${Math.abs(totalProfit).toFixed(2)}`;

                          return (
                            <TableRow key={trade._id}>
                              <TableCell>
                                <User
                                  avatarProps={{
                                    radius: "lg",
                                    src: avatarSrc,
                                    isBordered: "true",
                                    size: "md",
                                  }}
                                  isBordered
                                  description={"Symbol"}
                                  name={trade.symbol}
                                >
                                  {trade.symbol}
                                </User>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  className="capitalize"
                                  color={
                                    trade.isLongTrade
                                      ? statusColorMap.buy
                                      : statusColorMap.sell
                                  }
                                  size="sm"
                                  variant="flat"
                                >
                                  {trade.isLongTrade ? "Buy" : "Sell"}
                                </Chip>
                              </TableCell>

                              <TableCell>
                                <Chip
                                  className="capitalize"
                                  color={chipColor}
                                  size="sm"
                                  variant="flat"
                                >
                                  {chipLabel}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <div className="relative flex items-center gap-2">
                                  <Tooltip className="light" content="Details">
                                    <span
                                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                      onClick={() => setSelectedTrade(trade)} // Set the selected trade
                                    >
                                      <EyeIcon />
                                    </span>
                                  </Tooltip>
                                  <Tooltip className="light" content="Edit Trade">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={handleOpenModal}
        >
           <EditIcon  onClick={() => {
                                 setSelectedTrade2(trade);
                                }} />
        </span>
      </Tooltip>
      {isModalOpen && (
        <EditTradeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedTrade={selectedTrade2} // Pass the trade data for editing
          handleUpdateTrade={handleUpdateTrade} // Pass the update function
        />
      )}
                                  <Tooltip color="danger" content="Delete trade">
  <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDelete(trade._id)}>
    <DeleteIcon />
  </span>
</Tooltip>

                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No trades available for this date.</p>
                  )
                ) : (
                  // Display detailed information for the selected trade
<div className="flex flex-row space-x-6">
  {/* Left Card: Trade Details */}
  <Card radius="lg" className="min-w-[220px] border-none relative">
    
    <CardBody>
  <div className="flex flex-col space-y-3"> {/* Column alignment with spacing */}
    <Chip
      variant="flat"
      size="lg"
      avatar={
        <Avatar
          name={selectedTrade.symbol} // Name of the trade symbol
          src={`https://images.5paisa.com/MarketIcons/${
            selectedTrade.symbol.includes("NIFTY")
              ? "NIFTY50"
              : selectedTrade.symbol.replace("-", "&")
          }.png`} // Dynamic avatar source
        />
      }
    >
      {selectedTrade.symbol}
    </Chip>
    <Divider/>

    {/* Row alignment for the two Chip components */}
    <div className="flex flex-row space-x-3">
      <Chip size="sm" variant="flat" color="warning">
        {selectedTrade.quantity} Qty
      </Chip>

      <Chip
        className="capitalize"
        color={
          selectedTrade.isLongTrade ? statusColorMap.buy : statusColorMap.sell
        }
        size="sm"
        variant="flat"
      >
        {selectedTrade.isLongTrade ? "Buy" : "Sell"}
      </Chip>
    </div>
    <div className="flex flex-row space-x-3">
    <Chip size="sm"  variant="shadow" color="primary">
      Entry: ₹{selectedTrade.entryPrice}
    </Chip>

    <Chip size="sm"  variant="shadow" color="primary">
      Exit: ₹{selectedTrade.exitPrice}
    </Chip>
    </div>
    <div className="flex flex-row space-x-3">

    {/* Calculate Total Profit and ROI */}
    <Chip size="sm"  variant="flat" color={totalProfit >= 0 ? "success" : "danger"}>
      P&L: ₹{totalProfit.toFixed(2)}
    </Chip>

    <Chip size="sm" variant="flat" color={roi >= 0 ? "success" : "danger"}>
      ROI: {roi.toFixed(2)}%
    </Chip>
    </div>
    <Divider/>

    <div className="flex flex-row space-x-2">
  {/* Display Risk on the left */}
  {selectedTrade && selectedTrade.risk > 0 && (
    <Chip color="secondary" variant="flat" className="text-white">
      Risk: ₹{selectedTrade.risk}
    </Chip>
  )}

  {/* Display Risk-to-Reward Ratio for both long and short trades */}
  {selectedTrade && (
    <Chip color="secondary" variant="flat" className="text-white">
      1 :{" "}
      {selectedTrade.risk > 0 
        ? selectedTrade.isLongTrade
          ? formatRatio((selectedTrade.exitPrice - selectedTrade.entryPrice) / selectedTrade.risk) // For long trades
          : formatRatio((selectedTrade.entryPrice - selectedTrade.exitPrice) / selectedTrade.risk) // For short trades
        : "No Risk Set"} {/* Handle case where risk is 0 */}
    </Chip>
  )}
</div>



  </div>
  </CardBody>
</Card>

<Card radius="lg" className="min-w-[220px] border-none relative">
<CardHeader>
        <Chip variant="flat" size="lg">Notes</Chip>
      </CardHeader>
      <Divider />
  {selectedTrade.notes ? (
    <>
      <CardBody>
        <p className="text-gray-400">{selectedTrade.notes}</p>
      </CardBody>
    </>
  ) : (
<div className="flex justify-center items-center h-full"> {/* Container for centering */}
  <Card isFooterBlurred radius="lg" className="border-none">
    
    <Image
      alt="No trades available"
      className="object-cover rounded-lg"
      height={200}
      radius="lg"
      src="https://nextui.org/images/card-example-2.jpeg"
      width={200}
    />
  <CardFooter className="absolute bottom-0 left-0 right-0 h-full flex justify-between items-center before:bg-white/10  py-1 overflow-hidden rounded-lg shadow-small z-10">
      <p className="text-white">No notes available for this trade.</p>
    </CardFooter>
  </Card>
</div>

  )}
</Card>


<>
<Card isFooterBlurred radius="lg" className="border-none relative">
  <CardHeader>
    <Chip variant="flat" size="lg">
      Trade Chart
    </Chip>
  </CardHeader>
  <Divider />

  <CardBody className="overflow-visible relative">
    {selectedTrade.image ? (
      <Image
        src={`https://main.tradifyapi.in/${selectedTrade.image.replace(/\\/g, '/')}`} // Corrected image path
        alt="Trade"
        className="object-cover"
        width={200}
        height={200}
      />
    ) : (
      <p className="text-gray-400">No image available for this trade.</p>
    )}
  </CardBody>

  <CardFooter className="absolute bottom-0 left-1/2 transform -translate-x-1/2 justify-between border-0 overflow-hidden py-1 w-[calc(100%_-_8px)] shadow-small z-10">
    <p className="text-tiny text-white/80">Zoom Image</p>
    <Button
      className="text-tiny text-white bg-black/20"
      variant="flat"
      color="default"
      radius="lg"
      size="sm"
      onPress={openZoomModal} // Open modal on click
    >
      Click me
    </Button>
  </CardFooter>
</Card>

{/* Modal for zoomed image */}
<Modal
  size="5xl"
  closeButton
  aria-labelledby="zoomed-image-modal"
  isOpen={isZoomed}
  onOpenChange={closeZoomModal}
>
  <ModalContent>
    <ModalBody className="p-4">
      {selectedTrade.image ? ( // Check if image exists before displaying
        <Image
          src={`https://main.tradifyapi.in/${selectedTrade.image.replace(/\\/g, '/')}`}
          alt="Zoomed Trade"
          className="object-cover"
          width={1000} // Adjust the width as needed for zoom effect
          height={1000}
        />
      ) : (
        <p className="text-gray-400">No image available to zoom.</p>
      )}
    </ModalBody>
  </ModalContent>
</Modal>

    </>
</div>



                
                )}
              </ModalBody>

              <ModalFooter>
  <Button color="danger" variant="light" onPress={() => { onClose(); setSelectedTrade(null); }}>
    Close
  </Button>
  
  {selectedTrade && (
    <Button color="primary" onPress={() => setSelectedTrade(null)}>
      Back to Trades
    </Button>
  )}
</ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

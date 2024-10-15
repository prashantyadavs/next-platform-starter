/* eslint-disable */

"use client"
import React, { useRef, useState,useEffect } from 'react';
import { Select, SelectItem, DateRangePicker,Button,Tooltip,Card, CardFooter, Image,Popover, PopoverTrigger, PopoverContent,Input,CardHeader,CardBody,Divider,  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure, } from '@nextui-org/react';
import CalendarHeatmap from 'react-calendar-heatmap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-calendar-heatmap/dist/styles.css';
import './Tradebook.css';
import { formatISO } from 'date-fns';

import Setting from './setting';
import AddTradeModal from './AddTradeModal'
import TradeDetailsModal from './TradeDetailsModal.jsx'
import TradeDetailsAllModal from './TradeDetailsAllModal.jsx'
const animals = [
  { key: "equity", label: "EQUITY" },
  { key: "fno", label: "FNO" }
];

const getColorByValue = (value) => {
  if (typeof value === 'number') {
    if (value > 0) {
      return 'rgb(58, 252, 161)'; // Bright color for profit
    } else {
      return 'red'; // Color for loss
    }
  } else if (typeof value === 'string' && value.includes(':')) { // For R:R
    const [reward, risk] = value.split(':').map(Number); // Changed to reward and risk
    const ratio = reward / risk; // Calculate ratio as reward/risk
    if (ratio > 2) return 'rgb(76, 175, 80)'; // Green shade for good R:R
    if (ratio > 1) return 'rgb(255, 193, 7)'; // Yellow shade for moderate R:R
    if (ratio < 1) return 'rgb(244, 67, 54)'; // Yellow shade for moderate R:R

    return 'rgb(244, 67, 54)'; // Red shade for poor R:R
  } else if (typeof value === 'string' && value.endsWith('%')) { // For Capital Returns
    const percentage = parseFloat(value);
    if (percentage > 20) return 'rgb(76, 175, 80)'; // Green shade for good returns
    if (percentage > 10) return 'rgb(255, 193, 7)'; // Yellow shade for moderate returns
    return 'rgb(244, 67, 54)'; // Red shade for poor returns
  }
  return 'gray'; // Default color
};




const Tradebook = ({ }) => {
  const heatmapRowRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null); // Initialize to null
  const [selectedDateInfo, setSelectedDateInfo] = useState(null); // State for selected date info
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [riskPerTrade, setRiskPerTrade] = useState(0);
  const [totalCapital, setTotalCapital] = useState(0);
  console.log(selectedDateInfo)

const [selectedDateRange, setSelectedDateRange] = useState(null); // Store selected date range
const [eventData, setEventData] = useState({}); // State to hold event data
const [userEmail, setUserEmail] = useState('');
const [calculatedTotalProfit, setCalculatedTotalProfit] = useState(0);
const [calculatedRiskToReward, setCalculatedRiskToReward] = useState(0);
const [calculatedCapitalReturn, setCalculatedCapitalReturn] = useState(0);
const [calculatedTotalTrades, setCalculatedTotalTrades] = useState(0); // Add this line
const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Manage modal state
const [settingsFetched, setSettingsFetched] = useState(false); // State to track if settings have been fetched
const [isModalOpen, setIsModalOpen] = useState(false);

const handleOpenModal = () => {
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};
useEffect(() => {
  if (heatmapRowRef.current) {
    heatmapRowRef.current.scrollLeft = heatmapRowRef.current.scrollWidth;
  }
}, [eventData]); // Run when eventData changes
// Fetch user email from local storage
useEffect(() => {
  const email = localStorage.getItem('userEmail');
  if (email) {
    setUserEmail(email);
  }
}, []);
  // Fetch user settings on mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`https://main.tradifyapi.in/settings/${encodeURIComponent(userEmail)}`);
          const settings = await response.json();

          // console.log("Fetched User Settings:", settings);

          // Check total capital here and open modal if invalid
          if (settings.totalCapital && settings.totalCapital > 0) {
            setTotalCapital(settings.totalCapital);
          } else {
            console.warn("Total capital fetched is not valid:", settings.totalCapital);
            onOpen(); // Open modal if total capital is not set
          }
        } catch (error) {
          console.error("Error fetching user settings:", error);
        }
      }
    };

    fetchUserSettings();
  }, [userEmail]);

  // Save total capital to the server when it changes
  useEffect(() => {
    const saveUserSettings = async () => {
      if (userEmail) {
        try {
          await fetch('https://main.tradifyapi.in/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, totalCapital }),
          });
        } catch (error) {
          console.error('Error saving user settings:', error);
        }
      }
    };

    if (totalCapital > 0) {
      saveUserSettings();
    }
  }, [totalCapital, userEmail]);

  
    const fetchEventData = async () => {
      // console.log("Fetching event data...");
      if (userEmail ) { // Check if settings have been fetched
      
        try {
          const response = await fetch(`https://main.tradifyapi.in/trades?email=${encodeURIComponent(userEmail)}`);
          const data = await response.json();
  
          // Process the data to match your heatmap format
          const formattedData = {};
          data.forEach((trade) => {
            const entryDate = new Date(trade.entryDate);
            entryDate.setHours(entryDate.getHours() - 5);
            entryDate.setMinutes(entryDate.getMinutes() - 30);
            const date = formatISO(entryDate, { representation: "date" });
                  
            // Adjust profit calculation for long and short trades
            const entryPrice = parseFloat(trade.entryPrice) || 0;
            const exitPrice = parseFloat(trade.exitPrice) || 0;
            const quantity = parseFloat(trade.quantity) || 0;
          
            // Calculate profit/loss
            const profit = trade.isLongTrade
              ? ((exitPrice - entryPrice) * quantity).toFixed(2)
              : ((entryPrice - exitPrice) * quantity).toFixed(2); // For short trades
          
            const trades = 1;
          
            // Safeguard for cases where trade.risk is 0, undefined, or NaN
            const validRisk = isNaN(trade.risk) || trade.risk <= 0 ? 1 : parseFloat(trade.risk);
          
         // Calculate risk to reward for both long and short trades
let riskToReward = trade.isLongTrade
? ((exitPrice - entryPrice) * quantity) / validRisk
: ((entryPrice - exitPrice) * quantity) / validRisk; // Adjust for short trades

// Handle cases where short trades are at a loss (exitPrice > entryPrice)
if (!trade.isLongTrade && exitPrice > entryPrice) {
// Log the situation and assign a value for riskToReward
// // console.log("Short trade is in loss, treating R:R as 0 for this calculation.");
riskToReward = 0; // Or use a default value you find appropriate
}

// Safeguard: Ensure riskToReward is not NaN or negative
if (isNaN(riskToReward) || riskToReward < 0) {
riskToReward = 0;
}

          
            // // Log the values to debug if needed
            // // console.log("Trade Details:", {
            //   entryPrice,
            //   exitPrice,
            //   quantity,
            //   risk: trade.risk,
            //   validRisk,
            // });
            // // console.log("Calculated (Adjusted) Risk to Reward:", riskToReward);
          
            // Ensure riskToReward is formatted to 2 decimal points and prevent NaN values
            const adjustedRiskToReward = riskToReward !== null ? parseFloat(riskToReward.toFixed(2)) : 0;
          
            // Aggregate the capital return based on the user's total capital
            const tradeProfit = parseFloat(profit);
            if (totalCapital > 0) {
              const tradeCapitalReturn = ((tradeProfit / totalCapital) * 100).toFixed(2);
              if (!formattedData[date]) {
                formattedData[date] = {
                  profit: tradeProfit,
                  trades,
                  riskToReward: riskToReward !== null ? parseFloat(adjustedRiskToReward) : 0, // Use adjusted risk to reward
                  capitalReturn: parseFloat(tradeCapitalReturn),
                };
              } else {
                formattedData[date].profit += tradeProfit;
                formattedData[date].trades += trades;
                formattedData[date].riskToReward = riskToReward !== null
                  ? (
                      (formattedData[date].riskToReward + parseFloat(adjustedRiskToReward)) /
                      2
                    ).toFixed(2)
                  : formattedData[date].riskToReward; // Keep it unchanged if riskToReward is null
                formattedData[date].capitalReturn += parseFloat(tradeCapitalReturn);
              }
            }
          });
          
          
  
          setEventData(formattedData);
  
          // Calculate total PnL values for the PnLComponent
          const totalProfitCalc = Object.values(formattedData)
            .reduce((acc, event) => acc + event.profit, 0)
            .toFixed(2);
          const totalTradesCalc = Object.values(formattedData).reduce((acc, event) => acc + event.trades, 0);
          const avgRiskToRewardCalc =
            totalTradesCalc > 0
              ? (
                  Object.values(formattedData).reduce((acc, event) => acc + parseFloat(event.riskToReward), 0) /
                  totalTradesCalc
                ).toFixed(1)
              : "0.00"; // Return '0.00' as string for consistency
  
          setCalculatedTotalProfit(parseFloat(totalProfitCalc));
         // Calculate total weighted risk to reward
const totalWeightedRiskToRewardCalc = Object.values(formattedData).reduce((acc, event) => {
  const tradeWeight = event.trades; // You can adjust this to a more appropriate weight
  return acc + parseFloat(event.riskToReward) * tradeWeight;
}, 0);

// Calculate sum of all weights (e.g., total trades)
const totalWeight = Object.values(formattedData).reduce((acc, event) => acc + event.trades, 0);

// Compute weighted average risk to reward
const weightedAvgRiskToRewardCalc =
  totalWeight > 0 ? (totalWeightedRiskToRewardCalc / totalWeight).toFixed(2) : "0.00";

// Set the weighted average risk to reward
setCalculatedRiskToReward(parseFloat(weightedAvgRiskToRewardCalc));

          setCalculatedTotalTrades(totalTradesCalc);
  
          // Correctly calculate total capital invested
          const capitalReturnPercentage = ((parseFloat(totalProfitCalc) / totalCapital) * 100).toFixed(2); // Use totalProfitCalc for capital return
          setCalculatedCapitalReturn(parseFloat(capitalReturnPercentage));
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      }
    };
    useEffect(() => {
    fetchEventData();
  }, [userEmail, totalCapital]);
  
  
  const scrollLeft = () => {
    if (heatmapRowRef.current) {
      heatmapRowRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (heatmapRowRef.current) {
      heatmapRowRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  const handleDateClick = (date) => {
    const formattedDate = formatISO(date, { representation: 'date' });
    const event = eventData[formattedDate];
    setSelectedDateInfo(event ? { date: formattedDate, ...event } : null);
  };

  useEffect(() => {
    if (totalCapital > 0 && riskPerTrade > 0) {
      const totalProfit = Object.values(eventData).reduce((acc, event) => acc + event.profit, 0);
      setCapitalReturn(((totalProfit / totalCapital) * 100).toFixed(2)); // Percentage return on capital
  
      // Assuming a simplified calculation for expected profit based on trades
      const expectedProfit = totalProfit / totalTrades; // Average profit per trade
      const newRiskToReward = (expectedProfit / riskPerTrade).toFixed(2);
      setRiskToReward(newRiskToReward);
    }
  }, [riskPerTrade, totalCapital, eventData, totalTrades]);
  
  const handleDateRangeChange = (range) => {
    // console.log('Date Range Changed in Tradebook:', range); // Log the date range received
    setSelectedDateRange(range); // Update the selected date range
  };
  useEffect(() => {
    // console.log('Selected Date Range:', selectedDateRange);
  
    if (selectedDateRange) {
      const startDateObj = selectedDateRange.start;
      const endDateObj = selectedDateRange.end;
  
      if (!startDateObj || !endDateObj) {
        console.error('Invalid Date Objects:', startDateObj, endDateObj);
        return;
      }
  
      const startDate = new Date(startDateObj.year, startDateObj.month - 1, startDateObj.day);
      const endDate = new Date(endDateObj.year, endDateObj.month - 1, endDateObj.day);
  
      // Filter the events based on the date range
      const filteredEvents = Object.entries(eventData).filter(([date]) => {
        const eventDate = new Date(date);
        return eventDate >= startDate && eventDate <= endDate;
      });
  
      // Calculate total profit
      const totalProfitCalc = filteredEvents.reduce((acc, [_, event]) => {
        if (!event || typeof event !== 'object') {
          console.warn('Invalid event data:', event);
          return acc; // Skip invalid event
        }
  
        // Ensure profit is a number and accumulate
        const { profit } = event;
        return typeof profit === 'number' ? acc + profit : acc;
      }, 0);
  
      // Calculate total trades
      const totalTradesCalc = filteredEvents.reduce((acc, [_, event]) => acc + event.trades, 0);
  
      // Calculate total capital return
      const totalCapitalReturnCalc = filteredEvents.reduce((acc, [_, event]) => acc + event.capitalReturn, 0);
  
      // Calculate weighted average risk-to-reward
      const totalWeightedRiskToRewardCalc = filteredEvents.reduce((acc, [_, event]) => {
        const tradeWeight = event.trades; // Use trade count as weight, or change to any other metric
        return acc + parseFloat(event.riskToReward) * tradeWeight;
      }, 0);
  
      const totalWeight = filteredEvents.reduce((acc, [_, event]) => acc + event.trades, 0); // Total weight
  
      const weightedAvgRiskToRewardCalc = totalWeight > 0
        ? (totalWeightedRiskToRewardCalc / totalWeight).toFixed(2)
        : '0.00'; // Default to '0.00' if no valid trades
  
      // Update state with calculated values
      setCalculatedTotalTrades(totalTradesCalc);
      setCalculatedTotalProfit(totalProfitCalc);
      setCalculatedRiskToReward(parseFloat(weightedAvgRiskToRewardCalc)); // Ensure it's a number
  
      // Assuming a fixed capital of 1000 per trade for total capital invested
      const totalCapitalInvested = totalTradesCalc > 0 ? totalTradesCalc * 1000 : 1; // Adjust as necessary
  
      // Calculate capital return percentage based on filtered events
      const capitalReturnPercentage = ((parseFloat(totalProfitCalc) / totalCapital) * 100).toFixed(1); // Store as string with 1 decimal point
      setCalculatedCapitalReturn(capitalReturnPercentage);
    }
  }, [selectedDateRange, eventData]);
  
  
    
      // Function to generate heatmap data
 // Function to calculate max profit and loss
 const calculateMaxProfitAndLoss = () => {
  let maxProfit = -Infinity;
  let maxLoss = Infinity;

  Object.values(eventData).forEach(data => {
    if (data.profit > maxProfit) {
      maxProfit = data.profit;
    }
    if (data.profit < maxLoss) {
      maxLoss = data.profit;
    }
  });

  return { maxProfit, maxLoss };
};

// Function to generate heatmap data
const generateHeatmapData = (month) => {
  const data = [];
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    const formattedDate = formatISO(date, { representation: 'date' });

    const profit = eventData[formattedDate] ? eventData[formattedDate].profit : 0;
    data.push({ date: formattedDate, count: profit });
  }

  return data;
};

// Function to adjust color dynamically based on max profit and loss percentages
const getColorByValue2 = (count) => {
  const { maxProfit, maxLoss } = calculateMaxProfitAndLoss();

  // Calculate the percentage of the profit/loss
  let percentage;
  if (count > 0) {
    percentage = (count / maxProfit) * 100; // For profits
  } else {
    percentage = (count / Math.abs(maxLoss)) * 100; // For losses
  }

  // Define your color thresholds based on percentage
  if (count === 0) return 'color-empty'; // Ensure this class is defined in CSS
  if (count < 0) { // Loss colors
    if (percentage > -30) return 'color-low-loss';    // Light loss color
    if (percentage > -70) return 'color-medium-loss'; // Medium loss color
    return 'color-high-loss';                          // Dark loss color
  } else { // Profit colors
    if (percentage < 30) return 'color-low-profit';    // Light profit color
    if (percentage < 70) return 'color-medium-profit'; // Medium profit color
    return 'color-high-profit';                         // Dark profit color
  }
};

// Function to generate monthly heatmaps
const generateMonthlyHeatmaps = () => {
  const heatmapComponents = [];
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  for (let i = 0; i < 12; i++) {
    const month = new Date(currentMonth);
    month.setMonth(currentMonth.getMonth() - i);

    heatmapComponents.push(
      <div className="heatmap-container" key={month.getMonth()}>
        <CalendarHeatmap
          startDate={new Date(month.getFullYear(), month.getMonth(), 1)}
          endDate={new Date(month.getFullYear(), month.getMonth() + 1, 0)}
          values={generateHeatmapData(month)}
          classForValue={value => {
            if (!value) {
              return 'color-empty';
            }
            return getColorByValue2(value.count);
          }}
          tooltipDataAttrs={value => ({
            'data-tip': value ? `${value.date}: ${value.count}` : 'No data',
          })}
        />

        <div className="month-label">
          {month.toLocaleString('default', { month: 'short' })}
        </div>
      </div>
    );
  }

  return heatmapComponents.reverse();
};

  return (
    <div className="tradebook-container">
      <div className="row-container">
        <SelectComponent label="Segment" items={animals} />
        <Tooltip
        color='primary'
      content={
        <div className="px-1 py-2">
          <div className="text-small font-bold">Date Range</div>
          <div className="text-tiny">Select the Date Range for which you want to see your Journal</div>
        </div>
      }
    >
      <div>
      <DateRangeComponent label="Trade Duration" onChange={handleDateRangeChange} /> {/* Pass the onChange handler here */}
        </div>
        </Tooltip>
    
        <div className="pnl-components-container">
          
        <PnLComponent 
  amount={`₹${!isNaN(calculatedTotalProfit) ? calculatedTotalProfit : 0}`} 
  label="Total PnL" 
  color={getColorByValue(calculatedTotalProfit)} 
/>
<PnLComponent 
  amount={`1:${!isNaN(calculatedRiskToReward) ? calculatedRiskToReward : 0}`} 
  label="Risk to Reward" 
  color={getColorByValue(calculatedRiskToReward)} 
/>
<PnLComponent 
  amount={`${!isNaN(calculatedCapitalReturn) ? calculatedCapitalReturn : '0.00'}%`} 
  label="Capital Return" 
  color={getColorByValue(calculatedCapitalReturn)} 
/>


</div>
<Tooltip
        color='primary'

      content={
        <div className="px-1 py-2">
          <div className="text-small font-bold">Settings</div>
          <div className="text-tiny">Configure the settings of this Trading Journal</div>
        </div>
      }
    >
  <Popover backdrop="blur"  placement="bottom" showArrow>
      <PopoverTrigger>
        <Button size="lg" variant="light" endContent={<Setting />}></Button>
      </PopoverTrigger>
      <PopoverContent  color="default" className="p-1">
        <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
          <CardHeader>
            <h4 className="text-small font-semibold">Trade Settings ⚙️</h4>
          </CardHeader>
          <Divider/>
          <CardBody className="flex flex-col gap-4">
            <div>
              <label className="text-small font-medium text-white font-semibold">Your Total Capital (₹)</label>
              <Input 
                  label="Enter total capital" 
                  size="sm"   
                  value={totalCapital}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTotalCapital(value);
                    // Recalculate capital return when total capital is updated
                    if (value > 0) {
                      const newCapitalReturn = ((totalProfit / value) * 100).toFixed(1); // Update capital return based on new total capital
                      setCapitalReturn(newCapitalReturn);
                    }
                  }}
                />
            </div>
         
          </CardBody>
          <Divider/>

          <CardFooter>
          <Button color="default" >Set</Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
          </Tooltip>  



      </div>

      <hr className="divider-line" />

      <div className="heatmap-navigation">
        <Button className="scroll-Button left-scroll" onClick={scrollLeft}>
          &lt;
        </Button>

        <div className="heatmap-row" ref={heatmapRowRef}>
          {generateMonthlyHeatmaps()}
        </div>

        <Button className="scroll-Button right-scroll" onClick={scrollRight}>
          &gt;
        </Button>
      </div>

      {/* Calendar for events */}
      <div className="calendar-containe">
     
      <div className="calender">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            onClickDay={handleDateClick} // Add click handler
           // When rendering the calendar
tileClassName={({ date }) => {
  const adjustedDate = formatISO(date, { representation: 'date' });
  const event = eventData[adjustedDate];


  if (event) {
    return event.profit > 0 ? 'circle-green' : 'circle-red'; // Correct class based on profit
  }
  return ''; // Return empty for no events
}}
          />
        </div>

        <div className="date-info-container">
  {selectedDate ? (
    selectedDateInfo ? (
      // When a date is selected and trades exist
      <div className="date-info">
        <div className="info-cards-container">
          <div className="info-card">
            <h4>Total Profit</h4>
            <p style={{ color: getColorByValue(selectedDateInfo.profit) }}>
              ₹{selectedDateInfo.profit}
            </p>
          </div>
          <div className="info-card">
            <h4>Number of Trades</h4>
            <p>{selectedDateInfo.trades}</p>
          </div>
          <div className="info-card">
            <h4>Average Risk to Reward</h4>
            <p style={{ color: getColorByValue(selectedDateInfo.riskToReward) }}>
              {selectedDateInfo.riskToReward || '--'}
            </p>
          </div>
          <div className="info-card">
            <h4>% Capital Return</h4>
            <p style={{ color: getColorByValue(selectedDateInfo.capitalReturn) }}>
    {selectedDateInfo.capitalReturn ? selectedDateInfo.capitalReturn.toFixed(2) : '--'}%
  </p>
          </div>

          {/* New Trade Entry Card */}
                 <div className="info-card1">
          <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="No trades available"
            className="object-cover"
            height={100}
            src="trial2.jpeg"
            width={200}
          />
  <CardFooter className="absolute bottom-0 left-0 right-0 h-full flex justify-between items-center before:bg-white/10 border-white/20 border-1 py-1 overflow-hidden rounded-b-lg shadow-small z-10">
            <p className="cardtext"> Get Detailed Infomation</p>
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
                    <TradeDetailsModal selectedDate={selectedDate} selectedDateInfo={selectedDateInfo} />
            </Button>
          </CardFooter>
        </Card>
          </div>
          <div className="info-card1">
          <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="No trades available"
            className="object-cover"
            height={100}
            src="trialresize.jpeg"
            width={200}
          />
  <CardFooter className="absolute bottom-0 left-0 right-0 h-full flex justify-between items-center before:bg-white/10 border-white/20 border-1 py-1 overflow-hidden rounded-b-lg shadow-small z-10">
            <p className="cardtext">Add Another Trade</p>
            <Button
  className="text-tiny text-white bg-black/20"
  variant="flat"
  color="default"
  radius="lg"
  size="sm"
>
<AddTradeModal fetchEventData={fetchEventData} />
</Button>
          </CardFooter>
        </Card>
          </div>


   
        </div>
      </div>
    ) : (
      // When no trades exist for the selected date
      <div className="no-trades-info">
        <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="No trades available"
            className="object-cover"
            height={200}
            src="trial.jpeg"
            width={200}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">No Trades for this date</p>
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
<AddTradeModal fetchEventData={fetchEventData}/>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  ) : (
    // When no date is selected: Show total stats
<div className="total-stats-info">
  <div className="info-cards-container">

      <div className="info-card">
        <h4>Total Profit</h4>
        <p style={{ color: getColorByValue(calculatedTotalProfit) }}>
          ₹{calculatedTotalProfit}
        </p>
      </div>
      <div className="info-card">
        <h4>Number of Trades</h4>
        <p>{calculatedTotalTrades}</p>
      </div>
      <div className="info-card">
        <h4>Average Risk to Reward</h4>
        <p style={{ color: getColorByValue(calculatedRiskToReward) }}>
          {calculatedRiskToReward || '--'}
        </p>
      </div>
      <div className="info-card">
        <h4>% Capital Return</h4>
        <p style={{ color: getColorByValue(calculatedCapitalReturn) }}>
          {calculatedCapitalReturn || '--'}%
        </p>
      </div>

      <Modal backdrop="blur" isDismissable={false} className="light" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Warning</ModalHeader>
              <ModalBody>
                <p>Please set your total capital from settings before proceeding.</p>
              </ModalBody>
              <ModalFooter>
              
                <Popover backdrop="blur" placement="bottom" showArrow>
          <PopoverTrigger>
            <Button  color="warning"> Set Total Capital</Button>
          </PopoverTrigger>
          <PopoverContent color="default" className="p-1">
            <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
              <CardHeader>
                <h4 className="text-small font-semibold">Trade Settings ⚙️</h4>
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-4">
                <div>
                  <label className="text-small font-medium text-white font-semibold">Your Total Capital (₹)</label>
                  <Input
                    label="Enter total capital"
                    size="sm"
                    value={totalCapital}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setTotalCapital(value);
                      // Recalculate capital return when total capital is updated
                      if (value > 0) {
                        const newCapitalReturn = ((totalProfit / value) * 100).toFixed(1);
                        setCapitalReturn(newCapitalReturn);
                      }
                    }}
                  />
                </div>
              </CardBody>
              <Divider />
              <CardFooter>
                <Button  onPress={() => {
                    onClose(); // Close the modal
                  }} color="default">Set</Button>
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

        <div className="info-card1">
          <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="No trades available"
            className="object-cover"
            height={100}
            src="trial2.jpeg"
            width={200}
          />
  <CardFooter className="absolute bottom-0 left-0 right-0 h-full flex justify-between items-center before:bg-white/10 border-white/20 border-1 py-1 overflow-hidden rounded-b-lg shadow-small z-10">
            <p className="cardtext"> Get Detailed Infomation</p>
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
                                  <TradeDetailsAllModal />

            </Button>
          </CardFooter>
        </Card>
          </div>
          <div className="info-card1">
          <Card isFooterBlurred radius="lg" className="border-none">
          <Image
            alt="No trades available"
            className="object-cover"
            height={100}
            src="trialresize.jpeg"
            width={200}
          />
  <CardFooter className="absolute bottom-0 left-0 right-0 h-full flex justify-between items-center before:bg-white/10 border-white/20 border-1 py-1 overflow-hidden rounded-b-lg shadow-small z-10">
            <p className="cardtext">Add Another Trade</p>
            <Button
              className="text-tiny text-white bg-black/20"
              variant="flat"
              color="default"
              radius="lg"
              size="sm"
            >
            <AddTradeModal fetchEventData={fetchEventData}/>
            </Button>
          </CardFooter>
        </Card>
          </div>
      </div>
    </div>
  )}
</div>
{/* <div>
      <Button onPress={handleOpenModal}>Show Performance Analysis</Button>
      <PerformanceAnalysisModal isOpen={isModalOpen} onClose={handleCloseModal} userEmail={userEmail} />
    </div> */}

</div>
      
    </div>
  );
};



const SelectComponent = ({ label, items }) => {
  return (
    <Select
      items={items}
      isDisabled

      label={label}
      placeholder="Select an option"
      className="tradebook-element"
      defaultSelectedKeys={["equity"]}

    >
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  );
};

const DateRangeComponent = ({ label, onChange }) => {
  const handleDateChange = (range) => {
    if (onChange) {
      onChange(range); // Call the onChange prop with the selected range
    }
  };

  return (
    <DateRangePicker
      label={label}
      className="tradebook-element"
      onChange={handleDateChange} // Ensure your date picker supports this
    />
  );
};
const PnLComponent = ({ amount, label, color }) => {
  return (
    <div className="pnl-container">
      <div className="pnl-amount" style={{ color: color }}> {/* Use the color prop here */}
        {amount}
      </div>
      <div className="pnl-label">{label}</div>
    </div>
  );
};


export default Tradebook;

/* eslint-disable */

import { useState } from 'react';
import { Button } from '@nextui-org/react'; // Assuming you're using Next UI's Button
import { DateRangePicker } from '@nextui-org/react'; // Ensure the import is correct
import PnLComponent from './Tra'; // Adjust the import path as needed

const DateRangeComponent = ({ label }) => {
  const [dateRange, setDateRange] = useState([null, null]); // State to hold selected date range
  const [totalProfit, setTotalProfit] = useState(0);
  const [riskToReward, setRiskToReward] = useState(0);
  const [capitalReturn, setCapitalReturn] = useState(0);

  const eventData = {
    "2024-09-14": { profit: -2000, trades: 5, riskToReward: 1.5, capitalReturn: 1000 },
    "2024-09-19": { profit: 1500, trades: 3, riskToReward: 2.0, capitalReturn: 2000 },
    "2024-09-18": { profit: 3500, trades: 10, riskToReward: 1.8, capitalReturn: 500 },
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range); // Update state with the selected date range
  };

  const handleButtonClick = () => {
    const fetchedData = fetchDataBasedOnDateRange(dateRange);
    
    // Update PnL values based on the fetched data
    setTotalProfit(fetchedData.totalProfit);
    setRiskToReward(fetchedData.riskToReward);
    setCapitalReturn(fetchedData.capitalReturn);
  };

  // Function to fetch data based on the selected date range
  const fetchDataBasedOnDateRange = (range) => {
    const [startDate, endDate] = range;
    let totalProfit = 0;
    let totalTrades = 0;
    let totalRiskToReward = 0;
    let totalCapitalReturn = 0;

    // Iterate over the eventData to find relevant entries
    for (const date in eventData) {
      const eventDate = new Date(date);
      if (eventDate >= new Date(startDate) && eventDate <= new Date(endDate)) {
        totalProfit += eventData[date].profit;
        totalTrades += eventData[date].trades;
        totalRiskToReward += eventData[date].riskToReward;
        totalCapitalReturn += eventData[date].capitalReturn;
      }
    }

    // Calculate average Risk to Reward if trades exist to avoid division by zero
    const averageRiskToReward = totalTrades > 0 ? (totalRiskToReward / totalTrades).toFixed(2) : 0;

    return {
      totalProfit,
      riskToReward: averageRiskToReward,
      capitalReturn: totalCapitalReturn,
    };
  };

  return (
    <>
      <DateRangePicker
        label={label}
        className="tradebook-element"
        onChange={handleDateRangeChange} // Handle date range change
      />
      <Button size="lg" onClick={handleButtonClick} endContent={<Go />}>
        Submit
      </Button>
      <PnLComponent 
        amount={`₹${totalProfit}`} 
        label="Total PnL" 
        color={getColorByValue(totalProfit)} 
      />
      <PnLComponent 
        amount={`1:${riskToReward}`} 
        label="Risk to Reward" 
        color={getColorByValue(riskToReward)} 
      />
      <PnLComponent 
        amount={`${capitalReturn}%`} 
        label="Capital Return" 
        color={getColorByValue(`${capitalReturn}%`)} 
      />
    </>
  );
};

export default DateRangeComponent;

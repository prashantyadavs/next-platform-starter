// useStockSymbols.js
/* eslint-disable */

import { useAsyncList } from "@react-stately/data"; // Ensure this is installed
import { StockSymbols } from './StockSymbols'; // Adjust the path as needed

const PAGE_SIZE = 10; // Number of items to fetch per request

export function useStockSymbols() {
  return useAsyncList({
    async load({ signal, filterText }) {
      // Simulate a network request delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter stock symbols based on the filterText
      const filteredSymbols = StockSymbols.filter(symbol =>
        symbol.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
        symbol.name.toLowerCase().includes(filterText.toLowerCase())
      );

      // Paginate the results
      const paginatedSymbols = filteredSymbols.slice(0, PAGE_SIZE);

      return {
        items: paginatedSymbols, // Return the paginated items
      };
    },
  });
}

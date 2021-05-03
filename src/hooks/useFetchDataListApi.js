import React, { useState, useEffect } from 'react';
import { apiClient } from '../api.js'

const useFetchDataListApi = (apiEndpoint) => {
    const [ pageCount, setPageCount ] = useState(1);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ dataList, setDataList ] = useState([]);
    const [ keywords, setKeywords ] = useState('');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isError, setIsError ] = useState(false);
   
    useEffect(() => {
      const url = new URL(window.location);
      const page = parseInt(url.searchParams.get('page'));

      if (page !== undefined && page !== 0) {
        setCurrentPage(page)
      }

      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);
   
        try {
          const result = await apiClient.get(apiEndpoint)

          console.log(result)
          if (result.status === 200) {
            setDataList(result.data.data);
            setPageCount(result.data.meta.last_page);  
          }
        } catch (error) {
          setIsError(true);
        }
   
        setIsLoading(false);
      };
   
      fetchData();
    }, [currentPage, keywords]);
   
    return [
      { pageCount, dataList, keywords, currentPage, isLoading, isError },
      setKeywords, setCurrentPage
    ];
  }

  export default useFetchDataListApi;
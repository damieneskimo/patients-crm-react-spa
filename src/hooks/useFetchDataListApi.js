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
      const searchParams = new URLSearchParams(window.location.search);
      const page = parseInt(searchParams.get('page'));
      const keywordsQuery = searchParams.get('keywords')

      if (keywordsQuery) {
        setKeywords(keywordsQuery)
      }
      if (page !== undefined && page !== 1) {
        setCurrentPage(page)
      }
    }, [])

    useEffect(() => {
      const params = {};
      if (keywords.length) {
        params.keywords = keywords;
      }
      if (currentPage > 1) {
        params.page = currentPage;
      }
      const queryString = new URLSearchParams(params).toString();

      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);

        try {
          const result = await apiClient.get(apiEndpoint + (queryString? `?${queryString}` : ''))

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
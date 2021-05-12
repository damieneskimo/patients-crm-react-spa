import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api'

export function useFetchDataListApi<T>(apiEndpoint: string) {
    const [ pageCount, setPageCount ] = useState(1);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ dataList, setDataList ] = useState<T[]>([]);
    const [ keywords, setKeywords ] = useState('');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isError, setIsError ] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const page = searchParams.get('page');
      const keywordsQuery = searchParams.get('keywords')

      if (keywordsQuery) {
        setKeywords(keywordsQuery)
      }
      if (page !== null) {
        setCurrentPage(parseInt(page))
      }
    }, [])

    useEffect(() => {
      const params: {keywords?: string, page?: number} = {};
      if (keywords.length) {
        params.keywords = keywords;
      }
      if (currentPage > 1) {
        params.page = currentPage;
      }
      const queryString = new URLSearchParams(params.toString()).toString();

      const fetchData = async () => {
        setIsError(false);
        setIsLoading(true);

        try {
          const result = await apiClient.get(apiEndpoint + (queryString? `?${queryString}` : ''))

          if (result.status === 200) {
            if (! mountedRef.current) return null;
            setDataList(result.data.data);
            setPageCount(result.data.meta.last_page);
          }
        } catch (error) {
          if (! mountedRef.current) return null; 
          setIsError(true);
        }
   
        setIsLoading(false);
      };
   
      fetchData();

      // clean up 
      return () => {
        mountedRef.current = false;
      }
    }, [currentPage, keywords]);
   
    return [
      { pageCount, dataList, keywords, currentPage, isLoading, isError },
      setKeywords, setCurrentPage
    ] as const;
  }

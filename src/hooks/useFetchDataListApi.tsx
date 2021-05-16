import { useState, useEffect, MutableRefObject } from 'react';
import { apiClient } from '../api'

export function useFetchDataListApi<T>(apiEndpoint: string, mountedRef: MutableRefObject<boolean>) {
    const [ pageCount, setPageCount ] = useState(1);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ dataList, setDataList ] = useState<T[]>([]);
    const [ keywords, setKeywords ] = useState('');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isError, setIsError ] = useState(false);

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
      const params = new URLSearchParams();
      if (keywords.length) {
        params.set('keywords', keywords);
      }
      if (currentPage > 1) {
        params.set('page', currentPage.toString());
      }
      
      const queryString = params.toString();
      
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
    }, [currentPage, keywords]);
   
    return [
      { pageCount, dataList, keywords, currentPage, isLoading, isError },
      setKeywords, setCurrentPage
    ] as const;
  }

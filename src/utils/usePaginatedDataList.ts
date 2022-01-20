import { useState, useEffect, MutableRefObject } from 'react';
import { http } from './http';
import { useMountedRef } from './useMountedRef';

export function usePaginatedDataList<T>(apiEndpoint: string) {
  const [ pageCount, setPageCount ] = useState(1);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ dataList, setDataList ] = useState<T[]>([]);
  const [ keywords, setKeywords ] = useState('');
  const [ isLoading, setIsLoading ] = useState(true);
  const [ hasError, setHasError ] = useState(false);
  const mountedRef = useMountedRef();

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
      setHasError(false);
      setIsLoading(true);

      try {
        const result = await http(apiEndpoint + (queryString? `?${queryString}` : ''))
          // console.log(result);
          
      //   if (result.status === 200) {
          if (! mountedRef.current) return null;
          setDataList(result.data);
          setPageCount(result.meta.last_page);

          // update url query string
          const url = new URL(window.location.href);
          url.searchParams.delete('page');
          if (keywords.length) {
            url.searchParams.set('keywords', keywords);
          }
          window.history.pushState({}, '', url.toString());
      //   }
      } catch (error) {
        if (! mountedRef.current) return null; 
        setHasError(true);
      }
  
      setIsLoading(false);
    };
  
    fetchData();
  }, [currentPage, keywords]);
  
  return [
    { pageCount, dataList, keywords, currentPage, isLoading, hasError },
    setKeywords,
    setCurrentPage,
    setDataList
  ] as const;
}

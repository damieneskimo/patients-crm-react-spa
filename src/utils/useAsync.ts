import React, { useState, useEffect, DependencyList, useCallback} from 'react';
import { useMountedRef } from './useMountedRef';

type FnReturningPromise = (...args: any[]) => Promise<any>;
type PromiseType<P extends Promise<any>> = P extends Promise<infer T> ? T : never;
type StateFromFunctionReturningPromise<T extends FnReturningPromise> = [
  AsyncState<PromiseType<ReturnType<T>>>, 
  React.Dispatch<React.SetStateAction<AsyncState<PromiseType<ReturnType<T>>>>>
];
type AsyncState<T> = {
  isLoading: boolean,
  data?: null | undefined | T,
  error?: Error | undefined
}

export function useAsync<T extends FnReturningPromise>(
  asyncFn: T,
  deps: DependencyList = []
): StateFromFunctionReturningPromise<T> {
  const [ state, setState ] = useState<AsyncState<PromiseType<ReturnType<T>>>>({ isLoading: true })

  const isMounted = useMountedRef();

  useEffect(() => {
    let didCancel = false;

    if (! state.isLoading) {
      setState((prevState) => ({ ...prevState, isLoading: true }));
    }

    asyncFn().then(
      (res) => {
        if(isMounted.current && ! didCancel) {
          setState({
            isLoading: false,
            data: res
          })
        }
        return res;
      },
      (error) => {
        if(isMounted.current && ! didCancel) {
          setState({
            isLoading: false,
            error
          })
        }
        return error;
      }
    )

    return () => { didCancel = true; }
  }, deps);
  
  return [state, setState]
}

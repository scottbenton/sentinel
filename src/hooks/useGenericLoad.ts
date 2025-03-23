import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useGenericLoad<T>(
  getData: () => Promise<T>,
  errorMessage: string
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const hasStartedInitialLoad = useRef(false);

  useEffect(() => {
    if (hasStartedInitialLoad.current) {
      return;
    }
    hasStartedInitialLoad.current = true;
    getData()
      .then((data) => {
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        console.error(error);
        setState({ data: null, loading: false, error: errorMessage });
      });
  }, [getData, errorMessage]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    getData()
      .then((data) => {
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        console.error(error);
        setState({ data: null, loading: false, error: errorMessage });
      });
  }, [getData, errorMessage]);

  return useMemo(
    () => ({
      ...state,
      reload,
    }),
    [state, reload]
  );
}

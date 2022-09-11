import useSWR from 'swr';

export const useSharedState = (key, initial) => {
  const { data: state, mutate: setState } = useSWR(key, Promise.resolve(), {
    fallbackData: initial,
  });

  return [state, setState];
};

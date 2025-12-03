import useSWR from 'swr';
import { api } from './api';

export function useMe() {
  const { data, error, mutate } = useSWR('/users/me', async (url) => {
    const res = await api.get(url);
    return res.data;
  });
  return { me: data, loading: !data && !error, error, mutate };
}

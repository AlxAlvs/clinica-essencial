import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ListTable from '../../../src/components/ListTable';

const fetcher = (url) => fetch(url).then((r) => r.json());

const List = () => {
  const router = useRouter();
  const { table } = router.query;

  const { data, error } = useSWR(`/api/getAll/${table}`, fetcher);

  if (error) return <div>Erro ao carregar</div>;

  return (
    <ListTable
      table={table}
      data={data}
    />
  );
};

export default List;

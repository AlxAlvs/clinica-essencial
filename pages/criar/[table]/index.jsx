import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  CardTitle,
} from '../../../public/static/css/styledComponents';
import ListTable from '../../../src/components/ListTable';

const fetcher = (url) => fetch(url).then((r) => r.json());

const Create = () => {
  const router = useRouter();
  const { table } = router.query;

  const { data, error } = useSWR(`/api/create/${table}`, fetcher);

  if (error) return <div>Erro ao carregar</div>;

  const renderTableHeader = () => {
    switch (table) {
      case 'produto':
        return (
          <thead>
            <tr>
              <th>Nome do produto</th>
              <th>Valor do produto (R$)</th>
              <th>Data de vencimento</th>
            </tr>
          </thead>
        );
      default:
        return (
          <thead />
        );
    }
  };

  const renderTableTitle = () => {
    switch (table) {
      case 'produto':
        return (
          <CardTitle>
            Produtos
          </CardTitle>
        );
      default:
        return (
          <thead />
        );
    }
  };

  return (
    <ListTable
      table={table}
      data={data}
      renderTableTitle={renderTableTitle}
      renderTableHeader={renderTableHeader}
    />
  );
};

export default Create;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Spinner,
} from 'react-bootstrap';
import ListTable from '../../../src/components/ListTable';

const fetcher = (url) => fetch(url).then((r) => r.json());

const List = () => {
  const router = useRouter();
  const { table } = router.query;
  const [objectsToList, setObjectsToList] = useState(null);

  const { data, error } = useSWR(`/api/getAll/${table}`, fetcher);

  if (error) return <div>Erro ao carregar</div>;

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  const procedimentoResultToObject = (finalList, procedimentoResultById) => {
    const profissionais = [];
    const profissionaisIds = [];
    const equipamentos = [];
    const equipamentosIds = [];
    const produtos = [];
    const produtosIds = [];

    procedimentoResultById.forEach((result) => {
      if (!profissionaisIds.includes(result.profissionalIdentification)) {
        profissionais.push(result.profissionalNome);
        profissionaisIds.push(result.profissionalIdentification);
      }
      if (!equipamentosIds.includes(result.equipamentoIdentification)) {
        equipamentos.push(result.equipamentoNome);
        equipamentosIds.push(result.equipamentoIdentification);
      }
      if (!produtosIds.includes(result.produtoIdentification)) {
        produtos.push(result.produtoNome);
        produtosIds.push(result.produtoIdentification);
      }
    });

    finalList.push(
      {
        id: procedimentoResultById ? procedimentoResultById[0].id : null,
        nome: procedimentoResultById ? procedimentoResultById[0].nome : null,
        valor: procedimentoResultById ? procedimentoResultById[0].valor : null,
        profissionais: profissionais ? profissionais.join(', ') : null,
        equipamentos: equipamentos ? equipamentos.join(', ') : null,
        produtos: produtos ? produtos.join(', ') : null,
      },
    );
  };

  useEffect(() => {
    if (data && Array.isArray(data.result)) {
      const finalList = [];
      if (table === 'procedimento') {
        const allProcedimentoIds = data.result.map((result) => result.id);
        const uniqueProcedimentoIds = [...new Set(allProcedimentoIds)];
        const groupedByProcedimentoId = groupBy(data.result, (result) => result.id);
        uniqueProcedimentoIds
          .forEach((id) => procedimentoResultToObject(finalList, groupedByProcedimentoId.get(id)));
        const dataFinal = {
          result: finalList,
        };
        setObjectsToList(dataFinal);
      } else {
        setObjectsToList(data);
      }
    }
  }, [data]);

  return (
    <div>
      {objectsToList ? (
        <ListTable
          table={table}
          data={objectsToList}
        />
      ) : (<Spinner />)}
    </div>
  );
};

export default List;

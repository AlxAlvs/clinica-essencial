import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Row,
  Col,
  Container,
  Table,
  Card,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  CardDiv,
  CardTitle,
  CentralizedDiv,
  DivCalculo,
  LabelWhiteText,
  DivYellowColor,
} from '../../public/static/css/styledComponents';
import {
    formatterValue,
} from '../../src/utils';

const fetcher = (url) => fetch(url).then((r) => r.json());

const Caixa = () => {
  const [fluxoProcedimentosToList, setFluxoProcedimentosToList] = useState([]);
  const [saidasDeCaixaToList, setSaidasDeCaixaToList] = useState([]);
  const [sumOfSaidasDeCaixa, setSumOfSaidasDeCaixa] = useState(0);
  const [sumOfAllFluxoProcedimento, setSumOfAllFluxoProcedimento] = useState(0);
  const [sumOfAllEntradasSubtractSaidas, setSumOfAllEntradasSubtractSaidas] = useState(0);
  const [sumOfAllEntradas, setSumOfAllEntradas] = useState(0);
  const [produtosToList, setProdutosToList] = useState([]);
  const [sumOfProdutosvendidos, setSumOfProdutosvendidos] = useState(0);
  
  const { data, error } = useSWR(`/api/getAll/fluxoProcedimento`, fetcher);

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

  const fluxoProcedimentoResultToObject = (finalList, fluxoProcedimentoResultById) => {
    const profissionais = [];
    const profissionaisIds = [];
    const equipamentos = [];
    const equipamentosIds = [];
    const produtos = [];
    const produtosIds = [];
    const procedimentos = [];
    const procedimentosIds = [];
    const clientes = [];
    const clientesIds = [];

    fluxoProcedimentoResultById.forEach((result) => {
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
      if (!procedimentosIds.includes(result.procedimentoIdentification)) {
        procedimentos.push(result.procedimentoNome);
        procedimentosIds.push(result.procedimentoIdentification);
      }
      if (!clientesIds.includes(result.clienteIdentification)) {
        clientes.push(result.clienteNome);
        clientesIds.push(result.clienteIdentification);
      }
    });

    finalList.push(
      {
        id: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].id : null,
        profissionais: profissionais ? profissionais.join(', ') : null,
        equipamentos: equipamentos ? equipamentos.join(', ') : null,
        procedimentos: procedimentos ? procedimentos.join(', ') : null,
        produtos: produtos ? produtos.join(', ') : null,
        clientes: clientes ? clientes.join(', ') : null,
        valor_profissional: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].valor_profissional : null,
        data_procedimento: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].data_procedimento : null,
        descrição: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].descrição : null,
        valor_total: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].valor_total : null,
        forma_pagamento: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].forma_pagamento : null,
        pago: fluxoProcedimentoResultById ? fluxoProcedimentoResultById[0].pago : null,
      },
    );
  };
  
  const CalcSumOfFluxoProcedimentos = (fluxoProcedimentos) => {
    const sumOfFluxoProcedimentos = fluxoProcedimentos.filter(fluxo => Boolean(fluxo.pago.data[0]) === true).reduce((sum, nextItem) => sum + parseFloat(nextItem.valor_total ? nextItem.valor_total : 0), 0);
    setSumOfAllFluxoProcedimento(sumOfFluxoProcedimentos);
  };

  useEffect(() => {
    if (data && Array.isArray(data.result)) {
      const finalList = [];
      const allFluxoProcedimentoIds = data.result.map((result) => result.id);
      const uniqueFluxoProcedimentoIds = [...new Set(allFluxoProcedimentoIds)];
      const groupedByFluxoProcedimentoId = groupBy(data.result, (result) => result.id);
      uniqueFluxoProcedimentoIds
        .forEach((id) => fluxoProcedimentoResultToObject(finalList, groupedByFluxoProcedimentoId.get(id)));
      const dataFinal = {
        result: finalList,
      };
      setFluxoProcedimentosToList(dataFinal.result);
      CalcSumOfFluxoProcedimentos(dataFinal.result);
    }
  }, [data]);

  const CalcSumOfSaidas = (saidasDeCaixa) => {
    const sumOfSaidas = saidasDeCaixa.reduce((sum, nextItem) => sum + parseFloat(nextItem.valor ? nextItem.valor : 0), 0);
    setSumOfSaidasDeCaixa(sumOfSaidas ? sumOfSaidas.toFixed(2): 0);
  };

  const CalcSumOfProdutosVendidos = (filteredProdutos) => {
    const sumOfProdutos = filteredProdutos.reduce((sum, nextItem) => sum + parseFloat(nextItem.valor ? (nextItem.valor * nextItem.vendidos) : 0), 0);
    setSumOfProdutosvendidos(sumOfProdutos);
  };

  const calcEntradasESaidas = () => {
    const entradas = parseFloat(sumOfAllEntradas);
    const saidas = parseFloat(sumOfSaidasDeCaixa);
    const total = entradas - saidas;
    setSumOfAllEntradasSubtractSaidas(total ? total.toFixed(2) : 0);
  };

  const calcEntradas = () => {
    const total = parseFloat(sumOfAllFluxoProcedimento) + sumOfProdutosvendidos;
    setSumOfAllEntradas(total ? total.toFixed(2): 0);
  };

  const calcTotalVendidoPerProduto = (produto) => {
    let totalValue = 0;
    if (produto.vendidos > 0) {
      totalValue = (produto.vendidos * produto.valor).toFixed(2);
    }
    return totalValue;
  };

  const fetchSaidaDeCaixas = async () => {
    try {
        await fetch('/api/getAll/saidaDeCaixa')
          .then((resp) => resp.json())
          .then((data) => {
            setSaidasDeCaixaToList(data.result);
            CalcSumOfSaidas(data.result);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorMessage(error.message);
      }
  };

  const fetchProdutos = async () => {
    try {
        await fetch('/api/getAll/produto')
          .then((resp) => resp.json())
          .then((data) => {
            if (data && data.result) {
              const vendidos = data.result.filter(produto => produto.vendidos > 0);
              setProdutosToList(vendidos);
              CalcSumOfProdutosVendidos(vendidos);
            }
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorMessage(error.message);
      }
  };

  useEffect(() => {
    fetchSaidaDeCaixas();
    fetchProdutos();
  }, []);

  useEffect(() => {
    calcEntradas();
  }, [sumOfAllFluxoProcedimento, sumOfSaidasDeCaixa, sumOfProdutosvendidos]);

  useEffect(() => {
    calcEntradasESaidas();
    calcEntradas();
  }, [sumOfAllEntradas, sumOfSaidasDeCaixa, fluxoProcedimentosToList, produtosToList, saidasDeCaixaToList]);

  return (
    <CardDiv>
      <Container fluid>
        <Row>
          <Col md={{ span: 5, offset: 1 }}>
            {fluxoProcedimentosToList ? (
              <Card
                bg="dark"
              >
                <Card.Header>
                    <CardTitle><DivYellowColor>Saídas de caixa</DivYellowColor></CardTitle>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th key={uuidv4()}>Descrição</th>
                            <th key={uuidv4()}>Data do pagamento</th>
                            <th key={uuidv4()}>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saidasDeCaixaToList.length > 0 ? (
                            saidasDeCaixaToList.map((saidaDeCaixa) => (
                                <tr key={uuidv4()}>
                                    <td>{saidaDeCaixa.descrição}</td>
                                    <td>{moment(saidaDeCaixa.data_pagamento, 'YYYY-MM-DD').format('DD MM YYYY')}</td>
                                    <td>{formatterValue(saidaDeCaixa.valor)}</td>
                                </tr>
                            ))
                        ) : (
                            <>
                                <tr />
                            </>
                        )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            ) : (
              <CentralizedDiv>
                <Spinner animation="border" />
              </CentralizedDiv>
            )}
          </Col>
          <Col
            md={{ span: 5 }}
          >
            {fluxoProcedimentosToList ? (
                <Card
                  bg="dark"
                >
                    <Card.Header>
                        <CardTitle><DivYellowColor>Entradas</DivYellowColor></CardTitle>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th key={uuidv4()}>Cliente</th>
                                <th key={uuidv4()}>Procedimentos</th>
                                <th key={uuidv4()}>Data do procedimento</th>
                                <th key={uuidv4()}>Pago</th>
                                <th key={uuidv4()}>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fluxoProcedimentosToList.length > 0 ? (
                                fluxoProcedimentosToList.map((fluxoProperty) => (
                                    <tr key={uuidv4()}>
                                        <td>{fluxoProperty.clientes}</td>
                                        <td>{fluxoProperty.procedimentos}</td>
                                        <td>{fluxoProperty.data_procedimento ? moment(fluxoProperty.data_procedimento, 'YYYY-MM-DD').format('DD MM YYYY') : null}</td>
                                        <td>{fluxoProperty.pago.data[0] ? 'Sim' : 'Não'}</td>
                                        <td>{formatterValue(fluxoProperty.valor_total)}</td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    <tr />
                                </>
                            )}
                        </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            ) : (
              <CentralizedDiv>
                <Spinner animation="border" />
              </CentralizedDiv>
            )}
          </Col>
        </Row>
        <br />
        <Row>
          <Col
            md={{ span: 5, offset: 6 }}
          >
            {true ? (
                <Card
                  bg="dark"
                >
                    <Card.Header>
                        <CardTitle><DivYellowColor>Produtos</DivYellowColor></CardTitle>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                        <thead>
                          <tr>
                            <th key={uuidv4()}>Nome</th>
                            <th key={uuidv4()}>Valor unitário</th>
                            <th key={uuidv4()}>Quantidade</th>
                            <th key={uuidv4()}>Vendidos</th>
                            <th key={uuidv4()}>Total vendido</th>
                          </tr>
                        </thead>
                        <tbody>
                          {produtosToList.length > 0 ? (
                            produtosToList.map((produto) => (
                              <tr key={uuidv4()}>
                                <td>{produto.nome}</td>
                                <td>{formatterValue(produto.valor)}</td>
                                <td>{produto.quantidade}</td>
                                <td>{produto.vendidos}</td>
                                <td>{formatterValue(calcTotalVendidoPerProduto(produto))}</td>
                              </tr>
                            ))
                          ) : (
                            <>
                              <tr />
                            </>
                          )}
                        </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            ) : (
              <CentralizedDiv>
                <Spinner animation="border" />
              </CentralizedDiv>
            )}
          </Col>
        </Row>
        <DivCalculo>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Card
              bg="dark"
            >
              <Card.Header>
                  <CardTitle><CentralizedDiv><DivYellowColor>Cálculo Total:</DivYellowColor></CentralizedDiv></CardTitle>
              </Card.Header>
              <Card.Body>
                  <LabelWhiteText>
                      <CentralizedDiv>
                          <Table striped bordered hover variant="dark">
                              <thead>
                                  <td><strong>Soma de saidas</strong></td>
                                  <td><strong>Soma de entradas</strong></td>
                                  <td><strong>Total</strong></td>
                              </thead>
                              <tbody>
                                  <td>{formatterValue(sumOfSaidasDeCaixa)}</td>
                                  <td>{formatterValue(sumOfAllEntradas)}</td>
                                  <td>{formatterValue(sumOfAllEntradasSubtractSaidas)}</td>
                              </tbody>
                          </Table>
                      </CentralizedDiv>
                  </LabelWhiteText>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </DivCalculo>
      </Container>
    </CardDiv>
  );
};

export default Caixa;

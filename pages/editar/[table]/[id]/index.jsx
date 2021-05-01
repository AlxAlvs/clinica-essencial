import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Alert,
  Button,
  Container,
  Spinner,
} from 'react-bootstrap';
import {
  CardDiv,
  CentralizedDiv,
} from '../../../../public/static/css/styledComponents';
import Create from '../../../criar/[table]/index';

const fetcher = (url) => fetch(url).then((r) => r.json());

const Edit = () => {
  const router = useRouter();
  const { table, id } = router.query;
  const [produtoToEdit, setProdutoToEdit] = useState(null);
  const [equipamentoToEdit, setEquipamentoToEdit] = useState(null);
  const [profissionalToEdit, setProfissionalToEdit] = useState(null);

  const [objectFound, setObjectFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const avoidCache = React.useRef(Date.now());

  const { data, error } = useSWR([`/api/getById/${table}/${id}`, avoidCache], fetcher);

  if (error) return <div>Erro ao carregar</div>;

  setTimeout(() => { setLoading(false); }, 3000);

  useEffect(() => {
    if (data && Array.isArray(data.result) && data.result.length > 0) {
      switch (table) {
        case 'produto':
          setProdutoToEdit(data.result[0]);
          setObjectFound(true);
          break;
        case 'equipamento':
          setEquipamentoToEdit(data.result[0]);
          setObjectFound(true);
          break;
        case 'profissional':
          setProfissionalToEdit(data.result[0]);
          setObjectFound(true);
          break;
        default:
          break;
      }
    }
  }, [data]);

  return (
    <div>
      {objectFound ? (
        <Create
          produtoToEdit={produtoToEdit}
          equipamentoToEdit={equipamentoToEdit}
          profissionalToEdit={profissionalToEdit}
          tableToEdit={table}
        />
      ) : (
        <>
          <CardDiv>
            <Container fluid>
              <CentralizedDiv>
                {!loading ? (
                  <Alert
                    variant="danger"
                    onClose={() => {
                      router.push(`/listar/${table}`);
                    }}
                  >
                    <CentralizedDiv>
                      Erro:
                      {' '}
                      {table}
                      {' '}
                      não encontrado(a)
                    </CentralizedDiv>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() => {
                          router.push(`/listar/${table}`);
                        }}
                        variant="outline-danger"
                      >
                        OK
                      </Button>
                    </div>
                  </Alert>
                ) : <Spinner animation="border" />}
              </CentralizedDiv>
            </Container>
          </CardDiv>
        </>
      )}
    </div>
  );
};

export default Edit;

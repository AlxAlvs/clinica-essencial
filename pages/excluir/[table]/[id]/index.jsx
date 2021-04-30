/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Modal,
  Button,
  Spinner,
  Alert,
  Container,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import {
  CardDiv,
  CentralizedDiv,
  DivBreakWord,
} from '../../../../public/static/css/styledComponents';

const fetcher = (url) => fetch(url).then((r) => r.json());

const Edit = () => {
  const router = useRouter();
  const { table, id } = router.query;
  const [objectToDelete, setObjectToDelete] = useState(null);
  const avoidCache = React.useRef(Date.now());
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { data, error } = useSWR([`/api/getById/${table}/${id}`, avoidCache], fetcher);

  if (error) return <div>Erro ao carregar</div>;

  setTimeout(() => { setLoading(false); }, 3000);

  useEffect(() => {
    if (data && Array.isArray(data.result) && data.result.length > 0) {
      setObjectToDelete(data.result[0]);
      setShowSuccessAlert(false);
    }
  }, [data]);

  const deleteObject = async () => {
    try {
      if (errorMessage) setErrorMessage('');
      const res = await fetch(`/api/delete/${table}/${id}`, {
        method: 'DELETE',
      });

      if (res.status === 200) {
        setShowSuccessAlert(true);
      } else {
        // eslint-disable-next-line no-console
        setErrorMessage('erro ao excluir');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <CardDiv>
        <Container fluid>
          {showSuccessAlert && (
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <Card
                bg="dark"
              >
                <Card.Header />
                <Card.Body>
                  <CentralizedDiv>
                    <Alert
                      variant="success"
                      onClose={() => {
                        setShowSuccessAlert(false);
                      }}
                    >
                      <CentralizedDiv>Excluído com sucesso</CentralizedDiv>
                      <div className="d-flex justify-content-center">
                        <Button
                          onClick={() => {
                            setShowSuccessAlert(false);
                            router.push(`/listar/${table}`);
                          }}
                          variant="outline-success"
                        >
                          OK
                        </Button>
                      </div>
                    </Alert>
                  </CentralizedDiv>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          )}
          {objectToDelete && !showSuccessAlert ? (
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title><CentralizedDiv>Deseja excluir ?</CentralizedDiv></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <CentralizedDiv>{table}</CentralizedDiv>
                {Object.keys(objectToDelete).map((key) => (
                  <div key={uuidv4()}>
                    {key !== 'id' ? (
                      <DivBreakWord>
                        <strong>{`${key}: `}</strong>
                        {objectToDelete[key]}
                      </DivBreakWord>
                    ) : null }
                  </div>
                ))}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/listar/${table}`)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteObject()}
                >
                  Sim
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          ) : (
            <CentralizedDiv>
              {!loading && !showSuccessAlert ? (
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
              ) : !showSuccessAlert ? (<Spinner animation="border" />) : <div />}
            </CentralizedDiv>
          )}
        </Container>
      </CardDiv>
    </div>
  );
};

export default Edit;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Form,
  Col,
  Button,
  Card,
  Row,
  Container,
  Alert,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import ptBR from 'date-fns/locale/pt-BR';
import {
  CardDiv,
  CardTitle,
  LabelWhiteText,
  ErrorTextMessage,
  CentralizedDiv,
} from '../../../public/static/css/styledComponents';
import getModel from '../../../src/models/index';
import 'react-datepicker/dist/react-datepicker.css';
import {
  formatterValue,
  cpfMask,
  cnpjMask,
  phoneMask,
} from '../../../src/utils/index';

registerLocale('pt-BR', ptBR);

const Create = ({
  produtoToEdit,
  equipamentoToEdit,
  profissionalToEdit,
  tableToEdit,
}) => {
  const router = useRouter();
  let { table } = router.query;

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const produtoInitialState = {
    nome: '',
    valor: '',
    data_validade: undefined,
  };

  const [produtoToSave, setProdutoToSave] = useState(produtoInitialState);

  const equipamentoInitialState = {
    nome: '',
    valor: '',
    tipo: '',
  };

  const [equipamentoToSave, setEquipamentoToSave] = useState(equipamentoInitialState);

  const profissionalInitialState = {
    nome: '',
    cpf: '',
    cnpj: '',
    celular: '',
    fixo: false,
    aluga_sala: false,
  };

  const [profissionalToSave, setProfissionalToSave] = useState(profissionalInitialState);

  const setObjectToEdit = (tableName) => {
    switch (tableName) {
      case 'produto':
        setProdutoToSave({
          id: produtoToEdit.id,
          nome: produtoToEdit.nome,
          valor: formatterValue(produtoToEdit.valor),
          data_validade: produtoToEdit.data_validade ? moment(produtoToEdit.data_validade, 'YYYY-MM-DD').format('DD MM YYYY') : null,
        });
        break;
      case 'equipamento':
        setEquipamentoToSave({
          id: equipamentoToEdit.id,
          nome: equipamentoToEdit.nome,
          valor: formatterValue(equipamentoToEdit.valor),
          tipo: equipamentoToEdit.tipo,
        });
        break;
      case 'profissional':
        setProfissionalToSave({
          id: profissionalToEdit.id,
          nome: profissionalToEdit.nome,
          cpf: profissionalToEdit.cpf ? cpfMask(profissionalToEdit.cpf) : null,
          cnpj: profissionalToEdit.cnpj ? cnpjMask(profissionalToEdit.cnpj) : null,
          celular: profissionalToEdit.celular ? phoneMask(profissionalToEdit.celular) : null,
          fixo: profissionalToEdit.fixo.data[0],
          aluga_sala: profissionalToEdit.aluga_sala.data[0],
        });
        break;
      default:
        break;
    }

    setIsEdit(true);
    table = tableName;
  };

  useEffect(() => {
    if (tableToEdit) {
      setObjectToEdit(tableToEdit);
    }
  }, []);

  const clearFields = () => {
    setProdutoToSave(produtoInitialState);
    setEquipamentoToSave(equipamentoInitialState);
    setProfissionalToSave(profissionalInitialState);
    setValidated(false);
  };

  const objectToJson = () => {
    switch (table) {
      case 'produto':
        return JSON.stringify(produtoToSave);
      case 'equipamento':
        return JSON.stringify(equipamentoToSave);
      case 'profissional':
        return JSON.stringify(profissionalToSave);
      default:
        return '';
    }
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      if (isEdit) {
        try {
          if (errorMessage) setErrorMessage('');
          const res = await fetch(`/api/edit/${table || tableToEdit}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: objectToJson(),
          });

          if (res.status === 200) {
            setShowSuccessAlert(true);
          } else {
            // eslint-disable-next-line no-console
            setErrorMessage('erro ao editar');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          setErrorMessage(error.message);
        }

        setValidated(true);
        return;
      }

      try {
        if (errorMessage) setErrorMessage('');
        const res = await fetch(`/api/create/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: objectToJson(),
        });

        if (res.status === 200) {
          setShowSuccessAlert(true);
        } else {
          // eslint-disable-next-line no-console
          setErrorMessage('erro ao cadastrar');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorMessage(error.message);
      }
    }

    setValidated(true);
  };

  const renderTitle = () => {
    const title = !isEdit ? `Cadastre ${table}` : `Edite ${table}`;
    return (
      <CardTitle>
        {title}
      </CardTitle>
    );
  };

  const renderFormGroupControlProduto = (displayName) => {
    switch (displayName) {
      case 'nome':
        return (
          <Form.Control
            maxLength={60}
            value={produtoToSave.nome}
            type="text"
            onChange={(e) => {
              setProdutoToSave({
                ...produtoToSave,
                nome: e.target.value,
              });
            }}
            required
          />
        );
      case 'data de validade':
        return (
          <>
            <br />
            <DatePicker
              value={produtoToSave.data_validade}
              id="react-datepicker"
              locale="pt-BR"
              showYearDropdown
              autoComplete="off"
              onChange={(value) => {
                setProdutoToSave({
                  ...produtoToSave,
                  data_validade: value ? moment(value, 'YYYY-MM-DD').format('DD MM YYYY') : null,
                });
              }}
            />
          </>
        );
      case 'valor (R$)':
        return (
          <Form.Control
            value={produtoToSave.valor}
            type="text"
            required
            onChange={(e) => {
              setProdutoToSave({
                ...produtoToSave,
                valor: e ? formatterValue(e.target.value) : null,
              });
            }}
          />
        );
      default:
        return <div />;
    }
  };

  const renderFormGroupControlEquipamento = (displayName) => {
    switch (displayName) {
      case 'nome':
        return (
          <Form.Control
            maxLength={60}
            value={equipamentoToSave.nome}
            type="text"
            onChange={(e) => {
              setEquipamentoToSave({
                ...equipamentoToSave,
                nome: e.target.value,
              });
            }}
            required
          />
        );
      case 'tipo':
        return (
          <>
            <br />
            <Form.Control
              value={equipamentoToSave.tipo}
              type="text"
              onChange={(e) => {
                setEquipamentoToSave({
                  ...equipamentoToSave,
                  tipo: e ? e.target.value : null,
                });
              }}
            />
          </>
        );
      case 'valor (R$)':
        return (
          <Form.Control
            value={equipamentoToSave.valor}
            type="text"
            required
            onChange={(e) => {
              setEquipamentoToSave({
                ...equipamentoToSave,
                valor: e ? formatterValue(e.target.value) : null,
              });
            }}
          />
        );
      default:
        return <div />;
    }
  };

  const renderFormGroupControlProfissional = (displayName) => {
    switch (displayName) {
      case 'nome':
        return (
          <Form.Control
            maxLength={60}
            value={profissionalToSave.nome}
            type="text"
            onChange={(e) => {
              setProfissionalToSave({
                ...profissionalToSave,
                nome: e.target.value,
              });
            }}
            required
          />
        );
      case 'cpf':
        return (
          <Form.Control
            maxLength={60}
            value={profissionalToSave.cpf}
            type="text"
            onChange={(e) => {
              setProfissionalToSave({
                ...profissionalToSave,
                cpf: e ? cpfMask(e.target.value) : null,
              });
            }}
          />
        );
      case 'cnpj':
        return (
          <Form.Control
            maxLength={60}
            value={profissionalToSave.cnpj}
            type="text"
            onChange={(e) => {
              setProfissionalToSave({
                ...profissionalToSave,
                cnpj: e ? cnpjMask(e.target.value) : null,
              });
            }}
          />
        );
      case 'celular':
        return (
          <Form.Control
            maxLength={60}
            value={profissionalToSave.celular}
            type="text"
            required
            onChange={(e) => {
              setProfissionalToSave({
                ...profissionalToSave,
                celular: e ? phoneMask(e.target.value) : null,
              });
            }}
          />
        );
      case 'fixo':
        return (
          <Form.Check
            type="checkbox"
            checked={!!profissionalToSave.fixo}
            onChange={() => {
              setProfissionalToSave({
                ...profissionalToSave,
                fixo: !profissionalToSave.fixo,
              });
            }}
          />
        );
      case 'aluga sala':
        return (
          <Form.Check
            type="checkbox"
            checked={!!profissionalToSave.aluga_sala}
            onChange={() => {
              setProfissionalToSave({
                ...profissionalToSave,
                aluga_sala: !profissionalToSave.aluga_sala,
              });
            }}
          />
        );
      default:
        return <div />;
    }
  };

  const renderFormGroupControl = (displayName) => {
    switch (table) {
      case 'produto':
        return renderFormGroupControlProduto(displayName);
      case 'equipamento':
        return renderFormGroupControlEquipamento(displayName);
      case 'profissional':
        return renderFormGroupControlProfissional(displayName);
      default:
        return '';
    }
  };

  const redirectToList = () => {
    if (isEdit) {
      router.push(`/listar/${table}`);
    }
  };

  const renderFormGroup = () => (
    <Form.Row>
      {getModel(table).map((property) => (
        <Form.Group as={Col} md={4} controlId={`${Object.values(property)[0].displayName}-validation`} key={`${Object.values(property)[0].displayName}`}>
          <Form.Label>
            <LabelWhiteText>
              {Object.values(property)[0].displayName}
            </LabelWhiteText>
          </Form.Label>
          {renderFormGroupControl(Object.values(property)[0].displayName)}
          <Form.Control.Feedback type="invalid">
            Campo Invalido
          </Form.Control.Feedback>
        </Form.Group>
      ))}
    </Form.Row>
  );

  return (
    <CardDiv>
      <Container fluid>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Card
              bg="dark"
            >
              <Card.Header>
                {renderTitle()}
              </Card.Header>
              <Card.Body>
                {!showSuccessAlert && (
                  <Form noValidate validated={validated} onSubmit={handleSubmit} key="FormSave" autoComplete="off">
                    {renderFormGroup()}
                    <Button
                      type="submit"
                    >
                      Salvar
                    </Button>
                    &nbsp;
                    <Button
                      type="reset"
                      variant="secondary"
                      onClick={() => {
                        clearFields();
                      }}
                    >
                      Limpar
                    </Button>
                  </Form>
                )}
                {errorMessage && (
                <ErrorTextMessage>
                  {errorMessage}
                </ErrorTextMessage>
                )}
                {showSuccessAlert && (
                  <CentralizedDiv>
                    <Alert
                      variant="success"
                      onClose={() => {
                        setShowSuccessAlert(false);
                      }}
                    >
                      <CentralizedDiv>{isEdit ? 'Editado com sucesso' : 'Cadastro concluído com sucesso'}</CentralizedDiv>
                      <div className="d-flex justify-content-center">
                        <Button
                          onClick={() => {
                            clearFields();
                            setShowSuccessAlert(false);
                            redirectToList();
                          }}
                          variant="outline-success"
                        >
                          OK
                        </Button>
                      </div>
                    </Alert>
                  </CentralizedDiv>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </CardDiv>
  );
};

Create.propTypes = {
  produtoToEdit: PropTypes.shape({
    nome: PropTypes.string,
    valor: PropTypes.string,
    data_validade: PropTypes.string,
    id: PropTypes.number,
  }),
  equipamentoToEdit: PropTypes.shape({
    nome: PropTypes.string,
    valor: PropTypes.string,
    tipo: PropTypes.string,
    id: PropTypes.number,
  }),
  profissionalToEdit: PropTypes.shape({
    nome: PropTypes.string,
    cpf: PropTypes.string,
    cnpj: PropTypes.string,
    celular: PropTypes.string,
    fixo: PropTypes.shape({
      data: PropTypes.shape({}),
    }),
    aluga_sala: PropTypes.shape({
      data: PropTypes.shape({}),
    }),
    id: PropTypes.number,
  }),
  tableToEdit: PropTypes.string,
};

Create.defaultProps = {
  produtoToEdit: {},
  equipamentoToEdit: {},
  profissionalToEdit: {},
  tableToEdit: '',
};

export default Create;

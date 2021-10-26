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
import Select from 'react-select';
import DatePicker, { registerLocale } from 'react-datepicker';
import moment from 'moment';
import ptBR from 'date-fns/locale/pt-BR';
import {
  CardDiv,
  CardTitle,
  LabelWhiteText,
  ErrorTextMessage,
  CentralizedDiv,
  SpanInvalid,
} from '../../../public/static/css/styledComponents';
import getModel from '../../../src/models/index';
import 'react-datepicker/dist/react-datepicker.css';
import {
  formatterValue,
  cpfMask,
  cnpjMask,
  phoneMask,
  renderTableName,
  handleProcedimento,
  handleFluxoProcedimento,
  formatMoneyForDatabase,
} from '../../../src/utils/index';

registerLocale('pt-BR', ptBR);

const Create = ({
  produtoToEdit,
  equipamentoToEdit,
  profissionalToEdit,
  clienteToEdit,
  saidaDeCaixaToEdit,
  procedimentoToEdit,
  fluxoProcedimentoToEdit,
  tableToEdit,
}) => {
  const router = useRouter();
  let { table } = router.query;

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [profissionaisList, setProfissionaisList] = useState([]);
  const [equipamentosList, setEquipamentosList] = useState([]);
  const [produtosList, setProdutosList] = useState([]);
  const [procedimentosList, setProcedimentosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);  
  const [isFluxoProcedimentoValid, setIsFluxoProcedimentoValid] = useState(true);  

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

  const clienteInitialState = {
    nome: '',
    data_nascimento: '',
    endereço: '',
    celular: '',
  };

  const [clienteToSave, setClienteToSave] = useState(clienteInitialState);

  const saidaDeCaixaInitialState = {
    descrição: '',
    valor: '',
    data_pagamento: '',
  };

  const [saidaDeCaixaToSave, setSaidaDeCaixaToSave] = useState(saidaDeCaixaInitialState);

  const procedimentoInitialState = {
    nome: '',
    profissionais: [],
    equipamentos: [],
    produtos: [],
    valor: '',
  };

  const [procedimentoToSave, setProcedimentoToSave] = useState(procedimentoInitialState);

  const fluxoProcedimentoInitialState = {
    cliente: [],
    procedimentos: [],
    profissionais: [],
    equipamentos: [],
    produtos: [],
    valor_profissional: '',
    data_procedimento: '',
    descrição: '',
    valor_total: '',
    pago: false,
    forma_pagamento: '',
  };

  const [fluxoProcedimentoToSave, setFluxoProcedimentoToSave] = useState(fluxoProcedimentoInitialState);

  const fluxoProcedimentoFormatToEdit = () => {
    const fluxoProcedimentoFormatted = handleFluxoProcedimento(fluxoProcedimentoToEdit);
    const isPago = Boolean(fluxoProcedimentoFormatted.pago.data[0]);
    setFluxoProcedimentoToSave({
      id: fluxoProcedimentoFormatted.id,
      cliente: fluxoProcedimentoFormatted.cliente,
      procedimentos: fluxoProcedimentoFormatted.procedimentos,
      profissionais: fluxoProcedimentoFormatted.profissionais,
      equipamentos: fluxoProcedimentoFormatted.equipamentos,
      produtos: fluxoProcedimentoFormatted.produtos,
      valor_profissional: fluxoProcedimentoFormatted.valor_profissional,
      data_procedimento: fluxoProcedimentoFormatted.data_procedimento ? moment(fluxoProcedimentoFormatted.data_procedimento, 'YYYY-MM-DD').format('DD MM YYYY') : null,
      descrição: fluxoProcedimentoFormatted.descrição,
      valor_total: fluxoProcedimentoFormatted.valor_total,
      pago: isPago,
      forma_pagamento: fluxoProcedimentoFormatted.forma_pagamento,
    });
  };

  const procedimentoFormatToEdit = () => {
    const procedimentoFormatted = handleProcedimento(procedimentoToEdit);
    setProcedimentoToSave({
      id: procedimentoFormatted.id,
      nome: procedimentoFormatted.nome,
      profissionais: procedimentoFormatted.profissionais,
      equipamentos: procedimentoFormatted.equipamentos,
      produtos: procedimentoFormatted.produtos,
      valor: procedimentoFormatted.valor,
    });
  };

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
          fixo: profissionalToEdit.fixo ? profissionalToEdit.fixo.data[0] : false,
          aluga_sala: profissionalToEdit.aluga_sala ? profissionalToEdit.aluga_sala.data[0] : false,
        });
        break;
      case 'cliente':
        setClienteToSave({
          id: clienteToEdit.id,
          nome: clienteToEdit.nome,
          data_nascimento: clienteToEdit.data_nascimento ? moment(clienteToEdit.data_nascimento, 'YYYY-MM-DD').format('DD MM YYYY') : null,
          endereço: clienteToEdit.endereço,
          celular: clienteToEdit.celular ? phoneMask(clienteToEdit.celular) : null,
        });
        break;
      case 'saidaDeCaixa':
        setSaidaDeCaixaToSave({
          id: saidaDeCaixaToEdit.id,
          descrição: saidaDeCaixaToEdit.descrição,
          valor: saidaDeCaixaToEdit.valor,
          data_pagamento: saidaDeCaixaToEdit.data_pagamento ? moment(saidaDeCaixaToEdit.data_pagamento, 'YYYY-MM-DD').format('DD MM YYYY') : null,
        });
        break;
      case 'procedimento':
        procedimentoFormatToEdit();
        break;
      case 'fluxoProcedimento':
        fluxoProcedimentoFormatToEdit();
        break;
      default:
        break;
    }

    setIsEdit(true);
    table = tableName;
  };

  const getAllForMultipleSelects = async (tableToGet, setter) => {
    try {
      if (errorMessage) setErrorMessage('');
      await fetch(`/api/getAll/${tableToGet}`)
        .then((resp) => resp.json())
        .then((data) => {
          const result = [];
          if (data && Array.isArray(data.result)) {
            data.result.forEach((obj) => {
              if (!result.some(data => data.value === obj.id)) {
                result.push({ value: obj.id, label: obj.nome, valor: obj.valor });
              }
            });
          }
          setter(result);
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

  const clearFields = () => {
    setProdutoToSave({
      ...produtoInitialState,
      id: produtoToEdit ? produtoToEdit.id : null,
    });
    setEquipamentoToSave({
      ...equipamentoInitialState,
      id: equipamentoToEdit ? equipamentoToEdit.id : null,
    });
    setProfissionalToSave({
      ...profissionalInitialState,
      id: profissionalToEdit ? profissionalToEdit.id : null,
    });
    setClienteToSave({
      ...clienteInitialState,
      id: clienteToEdit ? clienteToEdit.id : null,
    });
    setSaidaDeCaixaToSave({
      ...saidaDeCaixaInitialState,
      id: saidaDeCaixaToEdit ? saidaDeCaixaToEdit.id : null,
    });
    setProcedimentoToSave({
      ...procedimentoInitialState,
      id: procedimentoToEdit && procedimentoToEdit[0] ? procedimentoToEdit[0].id : null,
    });
    setFluxoProcedimentoToSave({
      ...fluxoProcedimentoInitialState,
      id: fluxoProcedimentoToEdit && fluxoProcedimentoToEdit[0] ?  fluxoProcedimentoToEdit[0].id : null,
    });
    setValidated(false);
  };

  useEffect(() => {
    if (tableToEdit) {
      setObjectToEdit(tableToEdit);
    }
    getAllForMultipleSelects('profissional', setProfissionaisList);
    getAllForMultipleSelects('equipamento', setEquipamentosList);
    getAllForMultipleSelects('produto', setProdutosList);
    getAllForMultipleSelects('procedimento', setProcedimentosList);
    getAllForMultipleSelects('cliente', setClientesList);
  }, []);

  const objectToJson = () => {
    switch (table) {
      case 'produto':
        return JSON.stringify(produtoToSave);
      case 'equipamento':
        return JSON.stringify(equipamentoToSave);
      case 'profissional':
        return JSON.stringify(profissionalToSave);
      case 'cliente':
        return JSON.stringify(clienteToSave);
      case 'saidaDeCaixa':
        return JSON.stringify(saidaDeCaixaToSave);
      case 'procedimento':
        return JSON.stringify(procedimentoToSave);
      case 'fluxoProcedimento':
        return JSON.stringify(fluxoProcedimentoToSave);
      default:
        return '';
    }
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    if (table == 'fluxoProcedimento' && fluxoProcedimentoToSave.cliente.length <= 0) {
      event.preventDefault();
      event.stopPropagation();
      setIsFluxoProcedimentoValid(false);
      setValidated(true);
      return;
    }

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
    const title = !isEdit ? `Cadastre ${renderTableName(table)}` : `Edite ${renderTableName(table)}`;
    return (
      <CardTitle>
        {title}
      </CardTitle>
    );
  };

  const calculateTotalValueFluxoProcedimento = () => {
    const valorTotalProdutos = fluxoProcedimentoToSave.produtos.reduce((sum, nextItem) => sum + parseFloat(nextItem.valor ? nextItem.valor : 0), 0);
    const valorTotalProcedimentos = fluxoProcedimentoToSave.procedimentos.reduce((sum, nextItem) => sum + parseFloat(nextItem.valor ? nextItem.valor : 0), 0);
    const valorTotalEquipamentos = fluxoProcedimentoToSave.equipamentos.reduce((sum, nextItem) => sum + parseFloat(nextItem.valor ? nextItem.valor : 0), 0);
    const valorTotalProfissionais = parseFloat(fluxoProcedimentoToSave.valor_profissional ? formatMoneyForDatabase(fluxoProcedimentoToSave.valor_profissional) : 0);
    const defaultValue = valorTotalProdutos + valorTotalProcedimentos + valorTotalEquipamentos + valorTotalProfissionais;
    if (defaultValue > 0) {
      setFluxoProcedimentoToSave({
        ...fluxoProcedimentoToSave,
        valor_total: formatterValue(defaultValue.toFixed(2)),
      });
    }
  };

  useEffect(() => {
    if (fluxoProcedimentoToSave.cliente) {
      setIsFluxoProcedimentoValid(true);
    }
  }, [fluxoProcedimentoToSave.cliente]);

  useEffect(() => {
    calculateTotalValueFluxoProcedimento();
  }, [fluxoProcedimentoToSave.procedimentos, fluxoProcedimentoToSave.equipamentos, fluxoProcedimentoToSave.profissionais, fluxoProcedimentoToSave.produtos, fluxoProcedimentoToSave.valor_profissional]);

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

  const renderFormGroupControlCliente = (displayName) => {
    switch (displayName) {
      case 'nome':
        return (
          <Form.Control
            maxLength={60}
            value={clienteToSave.nome}
            type="text"
            onChange={(e) => {
              setClienteToSave({
                ...clienteToSave,
                nome: e.target.value,
              });
            }}
            required
          />
        );
      case 'data de nascimento':
        return (
          <>
            <br />
            <DatePicker
              value={clienteToSave.data_nascimento}
              id="react-datepicker"
              locale="pt-BR"
              showYearDropdown
              autoComplete="off"
              onChange={(value) => {
                setClienteToSave({
                  ...clienteToSave,
                  data_nascimento: value ? moment(value, 'YYYY-MM-DD').format('DD MM YYYY') : null,
                });
              }}
            />
          </>
        );
      case 'endereço':
        return (
          <Form.Control
            maxLength={60}
            value={clienteToSave.endereço}
            type="text"
            onChange={(e) => {
              setClienteToSave({
                ...clienteToSave,
                endereço: e.target.value,
              });
            }}
          />
        );
      case 'celular':
        return (
          <Form.Control
            maxLength={60}
            value={clienteToSave.celular}
            type="text"
            required
            onChange={(e) => {
              setClienteToSave({
                ...clienteToSave,
                celular: e ? phoneMask(e.target.value) : null,
              });
            }}
          />
        );
      default:
        return <div />;
    }
  };

  const renderFormGroupControlSaidaDeCaixa = (displayName) => {
    switch (displayName) {
      case 'descrição':
        return (
          <Form.Control
            as="textarea"
            rows={1}
            maxLength={200}
            value={saidaDeCaixaToSave.descrição}
            onChange={(e) => {
              setSaidaDeCaixaToSave({
                ...saidaDeCaixaToSave,
                descrição: e.target.value,
              });
            }}
            required
          />
        );
      case 'valor (R$)':
        return (
          <Form.Control
            value={saidaDeCaixaToSave.valor}
            type="text"
            required
            onChange={(e) => {
              setSaidaDeCaixaToSave({
                ...saidaDeCaixaToSave,
                valor: e ? formatterValue(e.target.value) : null,
              });
            }}
          />
        );
      case 'data do pagamento':
        return (
          <>
            <br />
            <DatePicker
              value={saidaDeCaixaToSave.data_pagamento}
              id="react-datepicker"
              locale="pt-BR"
              showYearDropdown
              autoComplete="off"
              onChange={(value) => {
                setSaidaDeCaixaToSave({
                  ...saidaDeCaixaToSave,
                  data_pagamento: value ? moment(value, 'YYYY-MM-DD').format('DD MM YYYY') : null,
                });
              }}
            />
          </>
        );
      default:
        return <div />;
    }
  };

  const renderFormGroupControlProcedimento = (displayName) => {
    switch (displayName) {
      case 'nome':
        return (
          <Form.Control
            maxLength={60}
            value={procedimentoToSave.nome}
            type="text"
            required
            onChange={(e) => {
              setProcedimentoToSave({
                ...procedimentoToSave,
                nome: e.target.value,
              });
            }}
          />
        );
      case 'profissionais':
        return (
          <Select
            options={profissionaisList}
            isMulti
            placeholder={'Selecione...'}
            isSearchable 
            value={procedimentoToSave.profissionais}
            onChange={(e) => {
              setProcedimentoToSave({
                ...procedimentoToSave,
                profissionais: e,
              });
            }}
          />
        );
      case 'equipamentos':
        return (
          <Select
            options={equipamentosList}
            isMulti
            isSearchable 
            value={procedimentoToSave.equipamentos}
            placeholder={'Selecione...'}
            onChange={(e) => {
              setProcedimentoToSave({
                ...procedimentoToSave,
                equipamentos: e,
              });
            }}
          />
        );
      case 'produtos':
        return (
          <Select
            options={produtosList}
            isMulti
            placeholder={'Selecione...'}
            isSearchable 
            value={procedimentoToSave.produtos}
            onChange={(e) => {
              setProcedimentoToSave({
                ...procedimentoToSave,
                produtos: e,
              });
            }}
          />
        );
      case 'valor (R$)':
        return (
          <Form.Control
            value={procedimentoToSave.valor}
            type="text"
            required
            onChange={(e) => {
              setProcedimentoToSave({
                ...procedimentoToSave,
                valor: e ? formatterValue(e.target.value) : null,
              });
            }}
          />
        );
      default:
        return <div />;
    }
  };

  const renderFormGroupControlFluxoProcedimento = (displayName) => {
    switch (displayName) {
      case 'cliente':
        return (
          <>
            <Select
              options={clientesList}
              placeholder={'Selecione...'}
              isSearchable 
              value={fluxoProcedimentoToSave.cliente}
              onChange={(e) => {
                setFluxoProcedimentoToSave({
                  ...fluxoProcedimentoToSave,
                  cliente: e,
                });
              }}
            />
            {isFluxoProcedimentoValid ? null : <SpanInvalid > Campo Invalido </SpanInvalid>}
          </>
        );
      case 'profissionais':
        return (
          <Select
            options={profissionaisList}
            isMulti
            placeholder={'Selecione...'}
            isSearchable
            value={fluxoProcedimentoToSave.profissionais}
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                profissionais: e,
              });
            }}
          />
        );
      case 'equipamentos':
        return (
          <Select
            options={equipamentosList}
            isMulti
            placeholder={'Selecione...'}
            isSearchable
            value={fluxoProcedimentoToSave.equipamentos}
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                equipamentos: e,
              });
            }}
          />
        );
      case 'produtos':
        return (
          <Select
            options={produtosList}
            isMulti
            placeholder={'Selecione...'}
            isSearchable
            value={fluxoProcedimentoToSave.produtos}
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                produtos: e,
              });
            }}
          />
        );
      case 'procedimentos':
        return (
          <Select
            options={procedimentosList}
            isMulti
            placeholder={'Selecione...'}
            isSearchable
            value={fluxoProcedimentoToSave.procedimentos}
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                procedimentos: e,
              });
            }}
          />
        );
      case 'valor dos profissionais (R$)':
        return (
          <Form.Control
            value={fluxoProcedimentoToSave.valor_profissional}
            type="text"
            required
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                valor_profissional: e ? formatterValue(e.target.value) : '',
              });
            }}
          />
        );
      case 'data do procedimento':
        return (
          <>
            <br />
            <DatePicker
              value={fluxoProcedimentoToSave.data_procedimento}
              id="react-datepicker"
              locale="pt-BR"
              showYearDropdown
              autoComplete="off"
              onChange={(value) => {
                setFluxoProcedimentoToSave({
                  ...fluxoProcedimentoToSave,
                  data_procedimento: value ? moment(value, 'YYYY-MM-DD').format('DD MM YYYY') : '',
                });
              }}
            />
          </>
        );
      case 'descrição':
        return (
          <Form.Control
            maxLength={200}
            value={fluxoProcedimentoToSave.descrição}
            type="text"
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                descrição: e.target.value,
              });
            }}
          />
        );
      case 'valor total do procedimento (R$)':
        return (
          <Form.Control
            value={fluxoProcedimentoToSave.valor_total}
            type="text"
            required
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                valor_total: e ? formatterValue(e.target.value) : '',
              });
            }}
          />
        );
      case 'pago':
        return (
          <Form.Check
            type="checkbox"
            checked={!!fluxoProcedimentoToSave.pago}
            onChange={() => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                pago: !fluxoProcedimentoToSave.pago,
              });
            }}
          />
        );
      case 'forma de pagamento':
        return (
          <Form.Control
            maxLength={100}
            value={fluxoProcedimentoToSave.forma_pagamento}
            type="text"
            onChange={(e) => {
              setFluxoProcedimentoToSave({
                ...fluxoProcedimentoToSave,
                forma_pagamento: e.target.value,
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
      case 'cliente':
        return renderFormGroupControlCliente(displayName);
      case 'saidaDeCaixa':
        return renderFormGroupControlSaidaDeCaixa(displayName);
      case 'procedimento':
        return renderFormGroupControlProcedimento(displayName);
      case 'fluxoProcedimento':
        return renderFormGroupControlFluxoProcedimento(displayName);
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
        <Form.Group as={Col} md={3} controlId={`${Object.values(property)[0].displayName}-validation`} key={`${Object.values(property)[0].displayName}`}>
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
    fixo: PropTypes.bool,
    aluga_sala: PropTypes.shape({
      data: PropTypes.shape({}),
    }),
    id: PropTypes.number,
  }),
  clienteToEdit: PropTypes.shape({
    nome: PropTypes.string,
    data_nascimento: PropTypes.string,
    endereço: PropTypes.string,
    celular: PropTypes.string,
    id: PropTypes.number,
  }),
  saidaDeCaixaToEdit: PropTypes.shape({
    descrição: PropTypes.string,
    valor: PropTypes.string,
    data_pagamento: PropTypes.string,
    id: PropTypes.number,
  }),
  procedimentoToEdit: PropTypes.shape({
    nome: PropTypes.string,
    profissionais: PropTypes.shape([]),
    equipamentos: PropTypes.shape([]),
    produtos: PropTypes.shape([]),
    valor: PropTypes.string,
    id: PropTypes.number,
  }),
  fluxoProcedimentoToEdit: PropTypes.shape({
    cliente: PropTypes.shape([]),
    profissionais: PropTypes.shape([]),
    equipamentos: PropTypes.shape([]),
    produtos: PropTypes.shape([]),
    procedimentos: PropTypes.shape([]),
    valor_profissional: PropTypes.string,
    data_procedimento: PropTypes.string,
    descrição: PropTypes.string,
    valor_total: PropTypes.string,
    pago: PropTypes.bool,
    id: PropTypes.number,
  }),
  tableToEdit: PropTypes.string,
};

Create.defaultProps = {
  produtoToEdit: {},
  equipamentoToEdit: {},
  profissionalToEdit: {},
  clienteToEdit: {},
  saidaDeCaixaToEdit: {},
  procedimentoToEdit: {},
  fluxoProcedimentoToEdit: {},
  tableToEdit: '',
};

export default Create;

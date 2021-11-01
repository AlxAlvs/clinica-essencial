import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Modal,
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiBell } from 'react-icons/bi';
import moment from 'moment';
import schedule from 'node-schedule';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomHeader,
  SelectOptions,
  HomeBtn,
  LinkInMenu,
  FirstParagraphHome,
  SecondParagraphHome,
  NavbarDiv,
  LastRightAlignedDiv,
  CentralizedDiv,
  DivBreakWord,
  ErrorTextMessage,
  HrAlertDivider,
  DivYellowColor,
} from '../../../public/static/css/styledComponents';
import {
  formatterValue,
} from '../../utils';

const Header = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [clientesBirthDay, setClientesBirthDay] = useState([]);
  const [showBirthDayModal, setShowBirthDayModal] = useState(false);
  const [hasNewBirthDaysOrNewLatePayments, setHasNewBirthDaysOrNewLatePayments] = useState(false);
  const [fluxoProcedimentoAtrasados, setFluxoProcedimentoAtrasados] = useState([]);

  const checkIfClientBirthDayAlert = (clientesList) => {
    const clientesToDisplay = [];
    clientesList.forEach((cliente) => {
      if (cliente.data_nascimento) {
        const birthDate = moment(cliente.data_nascimento, 'YYYY-MM-DD');
        const birthDay = birthDate.date();
        const birthMonth = birthDate.month();

        const birthDateMinusSevenDays = moment(cliente.data_nascimento, 'YYYY-MM-DD').subtract(7, 'days');
        const birthMinusSevenDaysDay = birthDateMinusSevenDays.date();
        const birthMinusSevenDaysMonth = birthDateMinusSevenDays.month();

        const currentDate = moment();
        const currentYear = currentDate.year();

        const dateBirthFormatted = moment({ year: currentYear, month: birthMonth, day: birthDay });

        const dateBirthMinusSevenDaysFormatted = moment(
          { year: currentYear, month: birthMinusSevenDaysMonth, day: birthMinusSevenDaysDay },
        );

        if (dateBirthFormatted.isSameOrAfter(currentDate, 'day') && dateBirthMinusSevenDaysFormatted.isSameOrBefore(currentDate, 'day')) {
          const clienteToAdd = {
            nome: cliente.nome,
            dataNascimento: moment(cliente.data_nascimento, 'YYYY-MM-DD').format('DD/MM'),
          };
          clientesToDisplay.push(clienteToAdd);
          setHasNewBirthDaysOrNewLatePayments(true);
        }
      }
    });

    let shouldSetClientsBirthDay = false;
    clientesToDisplay
      .forEach((clienteToDisplay) => clientesBirthDay.forEach((clientDisplayed) => {
        if (clienteToDisplay.nome !== clientDisplayed.nome) {
          shouldSetClientsBirthDay = true;
        }
      }));

    if (clientesBirthDay.length === 0 || shouldSetClientsBirthDay) {
      setClientesBirthDay(clientesToDisplay);
    }
  };

  const checkIfPaymentLateAlert = (fluxoProcedimentosList) => {
    const latePaymentsMessages = [];
    fluxoProcedimentosList.forEach((fluxoProcedimento => {
      if (fluxoProcedimento.data_procedimento) {
        const fluxoProcedimentoDate = moment(fluxoProcedimento.data_procedimento, "YYYY-MM-DD");
        const fluxoProcedimentoDatePlus45Days = fluxoProcedimentoDate.add(45, 'days');
        const currentDate = moment();
        const isBeforeOrEqual = fluxoProcedimentoDatePlus45Days.isSameOrBefore(currentDate, 'day');
        const isPago = Boolean(fluxoProcedimento.pago.data[0]);
        if (isBeforeOrEqual && !isPago) {
          latePaymentsMessages.push({
            cliente: fluxoProcedimento.clienteNome,
            data: fluxoProcedimento.data_procedimento,
            total: fluxoProcedimento.valor_total,
          });
        }
      }
    }));
    setFluxoProcedimentoAtrasados(latePaymentsMessages);
  };

  const getClientes = async () => {
    try {
      if (errorMessage) setErrorMessage('');
      await fetch('/api/getAll/cliente')
        .then((resp) => resp.json())
        .then((data) => {
          checkIfClientBirthDayAlert(data.result);
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

  const getFluxoProcedimentos = async () => {
    try {
      if (errorMessage) setErrorMessage('');
      await fetch('/api/getAll/fluxoProcedimento')
        .then((resp) => resp.json())
        .then((data) => {
          checkIfPaymentLateAlert(data.result);
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
    getClientes();
    getFluxoProcedimentos();
    schedule.scheduleJob('0 0 * * *', () => {
      getClientes();
      getFluxoProcedimentos();
    });
  }, []);

  const handleClose = () => {
    setHasNewBirthDaysOrNewLatePayments(false);
    setShowBirthDayModal(false);
  };
  const handleShow = () => setShowBirthDayModal(true);

  const handleAlertNumber = () => {
    const clientsBirthdaysLength = clientesBirthDay.length > 0 ? clientesBirthDay.length : 0;
    const fluxoProcedimentoAtrasadosLength = fluxoProcedimentoAtrasados.length > 0 ? fluxoProcedimentoAtrasados.length : 0;
    const totalLength = clientsBirthdaysLength + fluxoProcedimentoAtrasadosLength;
    return totalLength > 0 ? totalLength : null;
  };

  return (
    <>
      <CustomHeader>
        <Navbar expand="lg">
          <Navbar.Brand>
            <Link href="/">
              <HomeBtn>
                <div>
                  <FirstParagraphHome>Essencial</FirstParagraphHome>
                  <SecondParagraphHome>estética e saúde</SecondParagraphHome>
                </div>
              </HomeBtn>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <NavbarDiv>
            <Navbar.Collapse id="basic-navbar-nav">
              <LastRightAlignedDiv>
                <Nav className="mr-auto">
                  <NavDropdown
                    title={<SelectOptions>Selecione</SelectOptions>}
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item onClick={() => router.push('/listar/produto')}>
                      <LinkInMenu>
                        Produtos
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/listar/equipamento')}>
                      <LinkInMenu>
                        Equipamentos
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/listar/profissional')}>
                      <LinkInMenu>
                        Profissionais
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/listar/cliente')}>
                      <LinkInMenu>
                        Clientes
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/listar/saidaDeCaixa')}>
                      <LinkInMenu>
                        Saidas de caixa
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/listar/procedimento')}>
                      <LinkInMenu>
                        Procedimentos
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/listar/fluxoProcedimento')}>
                      <LinkInMenu>
                        Fluxo de procedimento
                      </LinkInMenu>
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => router.push('/caixa')}>
                      <LinkInMenu>
                        Caixa
                      </LinkInMenu>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </LastRightAlignedDiv>
            </Navbar.Collapse>
            <Button
              variant="dark"
              className="notification"
              onClick={handleShow}
            >
              <span><BiBell /></span>
              {hasNewBirthDaysOrNewLatePayments
                && (<span className="badge">{handleAlertNumber()}</span>)}
            </Button>
          </NavbarDiv>
        </Navbar>
      </CustomHeader>
      {errorMessage && (
        <ErrorTextMessage>
          {errorMessage}
        </ErrorTextMessage>
      )}
      <Modal show={showBirthDayModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <CentralizedDiv>
              <h6>Alertas:</h6>
            </CentralizedDiv>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <DivYellowColor>
          <h6>Clientes com aniversário hoje ou nos próximos dias:</h6>
        </DivYellowColor>
          {clientesBirthDay.map((cliente) => (
            <div key={uuidv4()}>
              <>
                <DivBreakWord>
                  <strong>cliente:</strong>{` ${cliente.nome} `}
                  <strong>data de nascimento: </strong>{cliente.dataNascimento}
                </DivBreakWord>
              </>
            </div>
          ))}
          <HrAlertDivider />
          <DivYellowColor>
            <h6>Clientes com fluxo de procedimentos não marcados como pago há 45 dias ou mais:</h6>
          </DivYellowColor>
          {fluxoProcedimentoAtrasados.map((fluxoProcedimento) => (
            <div key={uuidv4()}>
              <>
                <DivBreakWord>
                  <strong>cliente:</strong>{` ${fluxoProcedimento.cliente} `}
                  <strong>data:</strong>{` ${moment(fluxoProcedimento.data, "YYYY-MM-DD").format('DD/MM/YYYY')} `}
                  <strong>total:</strong>{` ${formatterValue(fluxoProcedimento.total)} `}
                </DivBreakWord>
              </>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;

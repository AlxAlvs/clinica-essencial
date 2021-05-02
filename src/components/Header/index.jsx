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
} from '../../../public/static/css/styledComponents';

const Header = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [clientesBirthDay, setClientesBirthDay] = useState([]);
  const [showBirthDayModal, setShowBirthDayModal] = useState(false);
  const [hasNewBirthDays, setHasNewBirthDays] = useState(false);

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
          setHasNewBirthDays(true);
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

  useEffect(() => {
    getClientes();
    schedule.scheduleJob('0 0 * * *', () => { getClientes(); });
  }, []);

  const handleClose = () => {
    setHasNewBirthDays(false);
    setShowBirthDayModal(false);
  };
  const handleShow = () => setShowBirthDayModal(true);

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
              {hasNewBirthDays
                && (<span className="badge">{clientesBirthDay.length > 0 ? clientesBirthDay.length : null}</span>)}
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
              <h6>Clientes com aniversário hoje ou nos próximos dias</h6>
            </CentralizedDiv>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clientesBirthDay.map((cliente) => (
            <div key={uuidv4()}>
              <DivBreakWord>
                <strong>{`${cliente.nome}: `}</strong>
                {cliente.dataNascimento}
              </DivBreakWord>
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

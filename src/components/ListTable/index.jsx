import {
  Container,
  Spinner,
  Table,
  Row,
  Col,
  Card,
  Button,
} from 'react-bootstrap';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import {
  CardDiv,
  InsertBtnDiv,
  CardTitle,
  TdMinimunWidth,
  CentralizedDiv,
  TdMMaximunWidth,
  DivYellowColor,
} from '../../../public/static/css/styledComponents';
import {
  formatterValue,
  cpfMask,
  cnpjMask,
  phoneMask,
  renderTableName,
} from '../../utils';
import getModel from '../../models/index';

const ListTable = ({
  data,
  table,
}) => {
  const router = useRouter();

  const renderTableHeader = () => (
    <thead>
      <tr>
        {getModel(table).map((property) => (
          <th key={uuidv4()}>{Object.values(property)[0].displayName}</th>
        ))}
        <th key={uuidv4()}>ações</th>
      </tr>
    </thead>
  );

  const renderProperty = (propToRender, databaseObj) => {
    switch (propToRender.type) {
      case 'monetary':
        return (
          databaseObj[propToRender.databaseName]
            ? formatterValue(databaseObj[propToRender.databaseName])
            : null
        );
      case 'date':
        return (
          databaseObj[propToRender.databaseName]
            ? moment(databaseObj[propToRender.databaseName], 'YYYY-MM-DD').format('DD MM YYYY')
            : null
        );
      case 'checkbox':
        return (
          databaseObj[propToRender.databaseName] && databaseObj[propToRender.databaseName].data[0]
            ? 'sim'
            : 'não'
        );
      case 'cpf':
        return (
          databaseObj[propToRender.databaseName]
            ? cpfMask(databaseObj[propToRender.databaseName])
            : null
        );
      case 'cnpj':
        return (
          databaseObj[propToRender.databaseName]
            ? cnpjMask(databaseObj[propToRender.databaseName])
            : null
        );
      case 'phone':
        return (
          databaseObj[propToRender.databaseName]
            ? phoneMask(databaseObj[propToRender.databaseName])
            : null
        );
      default:
        return (
          databaseObj[propToRender.databaseName]
        );
    }
  };

  const renderTableBody = () => (
    <tbody>
      {data && Array.isArray(data.result) ? (
        data.result.map((databaseObject) => (
          <tr key={uuidv4()}>
            {getModel(table).map((property) => (
              <TdMMaximunWidth key={uuidv4()}>
                {renderProperty(Object.values(property)[0], databaseObject)}
              </TdMMaximunWidth>
            ))}
            <TdMinimunWidth key={uuidv4()}>
              <Button
                key={uuidv4()}
                variant="secondary"
                onClick={() => router.push(`/editar/${table}/${databaseObject.id}`)}
              >
                Editar
              </Button>
              &nbsp;
              <Button
                key={uuidv4()}
                variant="danger"
                onClick={() => router.push(`/excluir/${table}/${databaseObject.id}`)}
              >
                Excluir
              </Button>
            </TdMinimunWidth>
          </tr>
        ))
      ) : (
        <>
          <tr />
        </>
      )}
    </tbody>
  );

  const handleTitle = (string) => {
    const capitalizedWord = string.charAt(0).toUpperCase() + string.slice(1);
    if (string === 'saída de caixa') {
      return 'Saídas de caixa';
    }
    if (string === 'profissional') {
      return 'Profissionais';
    }
    if (string === 'fluxoProcedimento') {
      return 'Fluxo de procedimento';
    }
    return `${capitalizedWord}s`;
  };

  const renderTableTitle = () => (
    <CardTitle>
        <DivYellowColor>
          {handleTitle(renderTableName(table))}
        </DivYellowColor>
    </CardTitle>
  );

  return (
    <CardDiv>
      <Container fluid>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            {data ? (
              <Card
                bg="dark"
              >
                <Card.Header>{renderTableTitle()}</Card.Header>
                <Card.Body>
                  <Row>
                    <InsertBtnDiv>
                      <Button variant="dark" onClick={() => router.push(`/criar/${table}`)}>
                        Cadastrar
                        {' '}
                        {renderTableName(table)}
                      </Button>
                    </InsertBtnDiv>
                  </Row>
                  <Table striped bordered hover variant="dark">
                    {renderTableHeader()}
                    {renderTableBody()}
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
      </Container>
    </CardDiv>
  );
};

ListTable.propTypes = {
  data: PropTypes.shape(),
  table: PropTypes.string,
};

ListTable.defaultProps = {
  data: {},
  table: '',
};

export default ListTable;

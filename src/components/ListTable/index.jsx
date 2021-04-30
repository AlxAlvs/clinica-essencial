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
} from '../../../public/static/css/styledComponents';
import { formatterValue } from '../../utils';
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
          formatterValue(databaseObj[propToRender.databaseName])
        );
      case 'date':
        return (
          databaseObj[propToRender.databaseName]
            ? moment(databaseObj[propToRender.databaseName], 'YYYY-MM-DD').format('DD MM YYYY')
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
              <td key={uuidv4()}>
                {renderProperty(Object.values(property)[0], databaseObject)}
              </td>
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
    return `${capitalizedWord}s`;
  };

  const renderTableTitle = () => (
    <CardTitle>
      {handleTitle(table)}
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
                        {table}
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

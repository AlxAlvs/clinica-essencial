import React from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CustomHeader,
  SelectOptions,
  HomeBtn,
  LinkInMenu,
  FirstParagraphHome,
  SecondParagraphHome,
  NavbarDiv,
  LastRightAlignedDiv,
} from '../../../public/static/css/styledComponents';

const Header = () => {
  const router = useRouter();

  return (
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
                </NavDropdown>
              </Nav>
            </LastRightAlignedDiv>
          </Navbar.Collapse>
        </NavbarDiv>
      </Navbar>
    </CustomHeader>
  );
};

export default Header;

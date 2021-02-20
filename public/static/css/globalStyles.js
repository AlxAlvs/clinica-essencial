import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        background-color: black;
    }

    .navbar-light .navbar-nav .nav-link {
        color: white;
    }

    .navbar-light .navbar-nav .nav-link:focus, .navbar-light .navbar-nav .nav-link:hover {
        color: white;
    }

    .navbar-toggler-icon {
        display: inline-block;
        width: 1.5em;
        height: 1.5em;
        vertical-align: middle;
        content: "";
        background: no-repeat center center gray;
        background-size: 100% 100%;
    }

    .dropdown-item.active, .dropdown-item:active, .dropdown-item:hover {
        color: #fff;
        text-decoration: none;
        background-color: white;
    }

    .dropdown-menu.show :hover {
        display: block;
        background-color: rgb(57, 57, 59);
    }

    .dropdown-menu.show {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
    }

    .btn-dark {
        color: #fff;
        background-color: rgb(19, 18, 18);
        border-color: #343a40;
    }

    .card-body {
        background-color: rgb(19,18,18);
    }

    .card-header {
        background-color: rgb(19,18,18);
    }
`;

export const theme = {
  colors: {
    primary: '#212121',
    secondary: '#e0e0e0',
  },
};

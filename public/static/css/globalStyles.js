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

    .form-control.is-valid, .was-validated .form-control:valid {
        padding-right: calc(1.5em + .75rem);
        background-image: none;
        background-position: right calc(.375em + .1875rem) center;
        background-size: calc(.75em + .375rem) calc(.75em + .375rem);
    }

    #react-datepicker {
        display: block;
        width: 100%;
        height: calc(1.5em + .75rem + 2px);
        padding: .375rem .75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        
    }

    .card-header {
        background-color: rgb(40,40,40);
    }

    .modal-content {
        color: #fff;
        background-color: rgb(40,40,40);
    }

    .modal-body {
        color: #fff;
        background-color: rgb(19, 18, 18);
        border: none;
    }

    .modal-header {
        border: none;
    }

    .modal-footer {
        border: none;
    }

    .react-datepicker-wrapper {
        width: 100%;
    }

    .notification {
        background-color: none;
        color: white;
        text-decoration: none;
        padding: 15px 26px;
        position: relative;
    }

    .notification:hover {
        background: #212121;
    }

    .notification .badge {
        position: absolute;
        top: -10px;
        right: -10px;
        padding: 5px 10px;
        border-radius: 50%;
        background: red;
        color: white;
    }
`;

export const theme = {
  colors: {
    primary: '#212121',
    secondary: '#e0e0e0',
  },
};

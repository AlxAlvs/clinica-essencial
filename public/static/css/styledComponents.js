import styled from 'styled-components';

export const CustomHeader = styled.div`
    border-bottom: solid rgb(19, 18, 18) 5px;
    // box-shadow: 0 5px 5px 0 rgba(19, 18, 18, 1), 0 5px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 0px;
    padding: 0px;
`;

export const SelectOptions = styled.span`
    color: ${({ theme }) => theme.colors.secondary};
    margin-right: 10px;
`;

export const HomeBtn = styled.span`
    &:hover {
        cursor: pointer;
    }
    color: #ffeb3b;
`;

export const LinkInMenu = styled.div`
    &:hover {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.secondary};
        text-decoration: none;
    }
    width: 100%;
    color: ${({ theme }) => theme.colors.secondary};
`;

export const FirstParagraphHome = styled.p`
    font-size: 20px;
    text-align: center;
    margin: 0px;
    padding: 0px;
    font-family: 'Lobster Two', cursive;
    margin-left: 15px;
`;

export const SecondParagraphHome = styled.p`
    font-size: 15px;
    text-align: center;
    margin: 0px;
    padding: 0px;
    font-family: 'Lobster Two', cursive;
    margin-left: 15px;
`;

export const CentralizedDiv = styled.div`
    display: flex;
    justify-content: center;
`;

export const NavbarDiv = styled.div`
    display: flex;
    width: 95%;
    flex-direction: row;
`;

export const LastRightAlignedDiv = styled.div`
    &:hover {
        cursor: pointer;
        background-color: ${({ theme }) => theme.colors.primary};
    }
    margin-right: 100px;
    margin-left: 50px;
    width: auto;
    border-radius: 3%;
    padding: 5px;
    color: white;
`;

export const CardTitle = styled.span`
    color: ${({ theme }) => theme.colors.secondary};
`;

export const CardDiv = styled.div`
    margin-top: 5%;
`;

export const InsertBtnDiv = styled.div`
    margin-bottom: 10px;
    margin-right: 13px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;

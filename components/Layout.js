import styled from 'styled-components';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-left: 250px; /* Matches the width of the sidebar */
  padding: 20px;
  width: 100%;
  height: 100vh;
  background-color: #f8f8f8;
`;

export default function Layout({ children }) {
  return (
    <LayoutContainer>
      <Sidebar />
      <Content>{children}</Content>
    </LayoutContainer>
  );
}

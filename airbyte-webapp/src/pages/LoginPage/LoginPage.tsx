import React, { Suspense } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import MainPageWithScroll from "components/MainPageWithScroll";
import PageTitle from "components/PageTitle";
import LoadingPage from "components/LoadingPage";
import HeadTitle from "components/HeadTitle";
import LoginForm from "./components/LoginForm";

const Content = styled.div`
  padding-top: 4px;
  margin: 0 33px 0 27px;
  height: 100%;
`;

const onSubmit = async (values: {}) => {
  console.log("submit login ", values);
  localStorage.setItem("isLoggedIn", "true");
};

const LoginPage: React.FC = () => {
  return (
    <MainPageWithScroll
      headTitle={<HeadTitle titles={[{ id: "Login" }]} />}
      pageTitle={<PageTitle withLine title={<FormattedMessage id="login" />} />}
    >
      <Content>
        <Suspense fallback={<LoadingPage />}>
          {<LoginForm onSubmit={onSubmit} />}
        </Suspense>
      </Content>
    </MainPageWithScroll>
  );
};

export default LoginPage;

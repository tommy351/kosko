import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styled from "styled-components";
import useBaseUrl from "@docusaurus/useBaseUrl";

const HeroPrimary = styled.header.attrs({
  className: "hero hero--primary"
})`
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media screen and (max-width: 966px) {
    padding: 2em;
  }
`;

const HeroTitle = styled.h1.attrs({
  className: "hero__title"
})``;

const HeroSubtitle = styled.p.attrs({
  className: "hero__subtitle"
})``;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  width: 100%;
`;

const Button = styled(Link).attrs({
  className: "button button--outline button--secondary button--lg"
})``;

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout description={siteConfig.tagline}>
      <HeroPrimary>
        <div className="container">
          <HeroTitle>{siteConfig.title}</HeroTitle>
          <HeroSubtitle>{siteConfig.tagline}</HeroSubtitle>
          <Buttons>
            <Button to={useBaseUrl("docs/overview")}>Get Started</Button>
          </Buttons>
        </div>
      </HeroPrimary>
      <main></main>
    </Layout>
  );
}

import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styled from "styled-components";
import useBaseUrl from "@docusaurus/useBaseUrl";

const Container = styled.div.attrs({
  className: "container"
})``;

const HeroPrimary = styled.header.attrs({
  className: "hero hero--primary"
})`
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media screen and (max-width: 966px) {
    padding: 2rem;
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

const FeatureGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: 3rem 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const features = [
  {
    title: "Multiple Environments",
    content: (
      <p>
        Kosko can generate Kubernetes manifests for multiple environments. No
        more copy and maintain multiple YAML files anymore.
      </p>
    )
  },
  {
    title: "Validation",
    content: (
      <p>
        All components are validated against Kubernetes OpenAPI schema. You can
        also customize your own validator.
      </p>
    )
  },
  {
    title: "TypeScript Support",
    content: (
      <p>
        TypeScript and any languages compiled to JavaScript are supported. It
        makes your manifests type-safe.
      </p>
    )
  },
  {
    title: "Reusability",
    content: (
      <p>
        Reuse variables and functions across components. Make use of the awesome
        Node.js ecosystem.
      </p>
    )
  }
];

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout description={siteConfig.tagline}>
      <HeroPrimary>
        <Container>
          <HeroTitle>{siteConfig.title}</HeroTitle>
          <HeroSubtitle>{siteConfig.tagline}</HeroSubtitle>
          <Buttons>
            <Button to={useBaseUrl("docs/guides/getting-started")}>
              Get Started
            </Button>
          </Buttons>
        </Container>
      </HeroPrimary>
      <Container>
        <FeatureGrid>
          {features.map((feat, i) => (
            <div key={i}>
              <h3>{feat.title}</h3>
              {feat.content}
            </div>
          ))}
        </FeatureGrid>
      </Container>
    </Layout>
  );
}

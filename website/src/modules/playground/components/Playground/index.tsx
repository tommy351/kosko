import Layout from "@theme/Layout";
import styles from "./styles.module.scss";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function Playground() {
  return (
    <Layout title="Playground">
      <main className={styles.main}>
        <BrowserOnly>
          {() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { Content } = require("./Content");
            return <Content />;
          }}
        </BrowserOnly>
      </main>
    </Layout>
  );
}

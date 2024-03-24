import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

export default function NpmInstallCommand({
  dev,
  children
}: {
  dev?: boolean;
  children: string;
}) {
  return (
    <Tabs groupId="packageManager">
      <TabItem value="npm" label="NPM">
        <CodeBlock language="shell">
          npm install {children}
          {dev ? " --save-dev" : ""}
        </CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        <CodeBlock language="shell">
          yarn add {children}
          {dev ? " --dev" : ""}
        </CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="PNPM">
        <CodeBlock language="shell">
          pnpm install {children}
          {dev ? " --save-dev" : ""}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

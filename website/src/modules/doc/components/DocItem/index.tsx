import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import { DocProvider } from "@docusaurus/theme-common/internal";
import DocItemMetadata from "@theme/DocItem/Metadata";
import DocItemLayout from "@theme/DocItem/Layout";
import type { Props } from "@theme/DocItem";
import AvailabilityInfo from "../AvailabilityInfo";
import useFrontMatter from "@site/src/utils/useFrontMatter";
import LintRuleBadges from "./LintRuleBadges";

function Availability() {
  const frontMatter = useFrontMatter();
  if (!frontMatter.available_since) return null;

  return <AvailabilityInfo availability={frontMatter.available_since} />;
}

export default function DocItem(props: Props) {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <>
            <Availability />
            <LintRuleBadges />
            <MDXComponent />
          </>
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}

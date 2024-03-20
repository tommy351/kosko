import React, { useMemo } from "react";
import DocCard from "@theme/DocCard";
import useFrontMatter from "@site/src/utils/useFrontMatter";
import { useDocById } from "@docusaurus/theme-common/internal";

const INDEX_SUFFIX = "/index";

function getDocLink(id: string) {
  return `/docs/${id.endsWith(INDEX_SUFFIX) ? id.substring(0, id.length - INDEX_SUFFIX.length) : id}`;
}

function DocCardContainer({ id }: { id: string }) {
  const doc = useDocById(id);
  const item = useMemo(
    () =>
      ({
        type: "link",
        href: getDocLink(doc.id),
        label: doc.title,
        description: doc.description
      }) as const,
    [doc]
  );

  return (
    <div className="col col--6 margin-bottom--lg">
      <DocCard item={item} />
    </div>
  );
}

export default function RelatedDoc() {
  const frontMatter = useFrontMatter();
  if (!frontMatter.related?.length) return null;

  return (
    <>
      <h2>Related</h2>
      <section className="row">
        {frontMatter.related.map((id, index) => (
          <DocCardContainer key={index} id={id} />
        ))}
      </section>
    </>
  );
}

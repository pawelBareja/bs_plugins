import { useBlockProps, RichText } from "@wordpress/block-editor";
import type { BlockSaveProps } from "@wordpress/blocks";
import type { HeaderAtributes } from "./types";

export default function Save({ attributes }: BlockSaveProps<HeaderAtributes>) {
  const { tytul, podtytul, ikona } = attributes;
  const blockProps = useBlockProps.save();

  return (
    <div {...blockProps} className="blok-header">
      {ikona && (
        <div className="blok-header__ikona">
          <img src={ikona.url} alt={ikona.alt || tytul} />
        </div>
      )}

      <RichText.Content
        tagName="h2"
        className="blok-header__tytul"
        value={tytul}
      />

      {podtytul && (
        <RichText.Content
          tagName="p"
          className="blok-header__podtytul"
          value={podtytul}
        />
      )}
    </div>
  );
}

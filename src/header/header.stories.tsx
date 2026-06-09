import type { Meta, StoryObj } from "@storybook/react";
import Edit from "./edit";
import type { HeaderAtributes } from "./types";
import "./style.scss";

const meta: Meta<typeof Edit> = {
  title: "Bloki/Header",
  component: Edit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Edit>;

const baseAttributes: HeaderAtributes = {
  tytul: "Dlaczego warto",
  podtytul:
    "Specjalizujemy się w dostawach kwiatów ciętych i roślin doniczkowych dla klientów biznesowych. Realizujemy regularne dostawy do biur, hoteli oraz przestrzeni reprezentacyjnych, tworząc sezonowe kompozycje dopasowane do charakteru wnętrza oraz identyfikacji wizualnej marki.",
  ikona: null,
};

const makeSetAttributes =
  (current: HeaderAtributes, update: (attrs: HeaderAtributes) => void) =>
  (partial: Partial<HeaderAtributes>) =>
    update({ ...current, ...partial });

export const BezIkony: Story = {
  args: {
    attributes: baseAttributes,
    setAttributes: () => {},
    clientId: "preview-1",
    isSelected: false,
    context: {},
  },
};

export const ZIkona: Story = {
  args: {
    attributes: {
      ...baseAttributes,
      ikona: {
        id: 1,
        url: "https://placehold.co/48x48/e2e8f0/64748b?text=icon",
        alt: "Ikona kwiatka",
      },
    },
    setAttributes: () => {},
    clientId: "preview-2",
    isSelected: false,
    context: {},
  },
};

export const BezPodtytulu: Story = {
  args: {
    attributes: {
      ...baseAttributes,
      podtytul: "",
    },
    setAttributes: () => {},
    clientId: "preview-3",
    isSelected: false,
    context: {},
  },
};

export const Pusty: Story = {
  args: {
    attributes: {
      tytul: "",
      podtytul: "",
      ikona: null,
    },
    setAttributes: () => {},
    clientId: "preview-4",
    isSelected: false,
    context: {},
  },
};

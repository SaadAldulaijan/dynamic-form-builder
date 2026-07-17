export type DesignerNode =
  | {
      type: 'form';
    }
  | {
      type: 'section';
      sectionKey: string;
    }
  | {
      type: 'field';
      fieldKey: string;
      sectionKey?: string;
    };

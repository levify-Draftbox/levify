declare module '@editorjs/table' {
    import { BlockTool, BlockToolData } from '@editorjs/editorjs';
    
    export interface TableData extends BlockToolData {
      content: string[][];
    }
    
    export default class Table implements BlockTool {
      static get toolbox(): {
        title: string;
        icon: string;
      };
      constructor({ data, config, api, readOnly });
      render(): HTMLElement;
      save(blockContent: HTMLElement): TableData;
    }
  }
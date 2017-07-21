/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/* Para poder importar los jsons con import default  */
declare module "*.json" {
    const value: any;
    export default value;
}
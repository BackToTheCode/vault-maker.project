declare module '*.md' {
  const content: string;
  export = content;
}
declare module "*.svg" {
  const content: any;
  export default content;
}
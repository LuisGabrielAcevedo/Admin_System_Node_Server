import { importSchema } from 'graphql-import';
const typeDefs = importSchema('graphql/schema.graphql');
export {typeDefs};
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HeadersRequest } from './enums/headers.enum';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      playground: true,
      //resolvers: { JSON: GraphQLJSON },
      installSubscriptionHandlers: true,
      context: ({ req, res }: { req: Request; res: Response }) => {
        const companyUui = req.headers[HeadersRequest.XCompanyUuid];
        return {
          companyUui: companyUui,
          headers: req.headers,
        };
      },
    }),
  ],
  exports: [GraphQLModule],
})
export class CommonModule {}

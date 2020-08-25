import { SchemaDirectiveVisitor } from 'apollo-server-lambda';
import { defaultFieldResolver } from 'graphql';
import { AuthenticationError } from 'apollo-server-lambda';

export class AuthorizationDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line max-len
  // From: https://www.apollographql.com/blog/reusable-graphql-schema-directives-131fb3a177d1/
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async function(...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole ||
          objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const context = args[2];

        if (!context.user.roles?.includes(requiredRole)) {
          throw new AuthenticationError('User not authorized. Admin only.');
        }

        return resolve.apply(this, args);
      };
    });
  }
}

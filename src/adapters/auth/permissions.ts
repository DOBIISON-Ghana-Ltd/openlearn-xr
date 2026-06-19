import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({
  ...defaultStatements,
});

const editor = ac.newRole({
  ...defaultStatements,
});

const admin = ac.newRole({
  ...adminAc.statements,
});

export { ac, user, editor, admin };

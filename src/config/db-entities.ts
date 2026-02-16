import { User } from 'src/users/user.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { EventAuth } from 'src/auth/entities/eventauth.entity';
import { Role } from 'src/roles/role.entity';
import { DataTable } from 'src/roles/datatable.entity';
import { Route } from 'src/routes/route.entity';

export const ENTITIES = [User, Auth, EventAuth, Role, DataTable, Route];

// export { User, Auth, EventAuth, Role, DataTable, Route };

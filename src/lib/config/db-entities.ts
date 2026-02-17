import { User } from 'src/lib/users/user.entity';
import { Auth } from 'src/lib/auth/entities/auth.entity';
import { EventAuth } from 'src/lib/auth/entities/eventauth.entity';
import { Role } from 'src/lib/roles/role.entity';
import { DataTable } from 'src/lib/roles/datatable.entity';
import { Route } from 'src/lib/routes/route.entity';

export const ENTITIES = [User, Auth, EventAuth, Role, DataTable, Route];

// export { User, Auth, EventAuth, Role, DataTable, Route };

const allRoles = {
  user: ['createTask', 'getMyTasks', 'upateMyTask', 'changeTasks', 'deleteMyTask'],
  admin: ['getUsers', 'manageUsers', 'getTasks'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
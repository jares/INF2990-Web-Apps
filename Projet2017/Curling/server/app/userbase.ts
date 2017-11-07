export class Userbase {
    users: string[] = [];
    public isExistingUser(usernameToAdd: string): boolean {
        if (this.users.length === 0) {
            return false;
        }
        for (let user of this.users) {
            if (user === usernameToAdd) {
                return true;
            }
        }
        return false;
    }
    public addUser(username: string): boolean {
        if (!this.isExistingUser(username)) {
            this.users.push(username);
            return true;
        }
        else {
            return false;
        }
    }
    public removeUser(username: string): boolean {
        let index = this.users.indexOf(username, 0);
        if (index > -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}

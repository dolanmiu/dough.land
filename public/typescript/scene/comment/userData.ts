module DoughLand {
    export class UserData {
        private name: string;
        private email: string;
        private comment: string;
        private userIP: string;

        constructor(name: string, email: string, comment: string, userIP: string) {
            this.name = name;
            this.email = email;
            this.comment = comment;
            this.userIP = userIP;
        }

        public getName(): string {
            return this.name;
        }

        public getEmail(): string {
            return this.email;
        }

        public getComment(): string {
            return this.comment;
        }

        public getUserIP(): string {
            return this.userIP;
        }
    }
} 
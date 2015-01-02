module DoughLand {
    export class Authentication {
        private userIP: string;
        private ableToComment: boolean;

        constructor() {
            this.userIP = '';
            this.ableToComment = false;
        }

        private ajaxCheckIP(ip: string) {
            var jsonString = '{"ip":"' + ip + '"}';
            $.ajax({
                url: "/ip/check",
                type: "post",
                data: jsonString,
                contentType: 'application/json',
                success: function (res) {
                    this.ableToComment = !res; //will have bug
                }
            });
        }

        public authenticate(): void {
            $.getJSON("http://www.telize.com/jsonip?callback=?", json => {
                this.userIP = json.ip;
                this.ajaxCheckIP(json.ip);
            });
        }

        public getIP(): string {
            return this.userIP;
        }

        public getAbleToComment(): boolean {
            return this.ableToComment;
        }

        public setAbleToComment(able: boolean) {
            this.ableToComment = able;
        }
    }
}
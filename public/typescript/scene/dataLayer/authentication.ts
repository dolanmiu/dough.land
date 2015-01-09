module DoughLand {
    export class Authentication {
        private userIP: string;
        private ableToComment: boolean;

        constructor() {
            this.userIP = '';
            this.ableToComment = false;
        }

        private ajaxCheckIP(ip: string, callback: (res: boolean) => void) {
            var jsonString = '{"ip":"' + ip + '"}';
            $.ajax({
                url: "/ip/check",
                type: "post",
                data: jsonString,
                contentType: 'application/json'
            })
                .done(res => {
                    callback(!res); 
                });
        }

        public authenticate(callback: (res: boolean) => void): void {
            $.getJSON("http://www.telize.com/jsonip?callback=?", json => {
                this.userIP = json.ip;
                this.ajaxCheckIP(json.ip, res => {
                    callback(res);
                });
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
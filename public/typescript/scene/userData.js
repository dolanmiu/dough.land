var DoughLand;
(function (DoughLand) {
    var UserData = (function () {
        function UserData(name, email, comment, userIP) {
            this.name = name;
            this.email = email;
            this.comment = comment;
            this.userIP = userIP;
        }
        return UserData;
    })();
    DoughLand.UserData = UserData;
})(DoughLand || (DoughLand = {}));
//# sourceMappingURL=userData.js.map